import React, { useEffect } from 'react';
import {
	AuthAction,
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth';
import axios from 'axios';
import { auth, firestore } from 'firebase-admin';
import { NextPage } from 'next';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getApp } from 'firebase/app';
import initAuth from '@/initAuth';

initAuth();

const Page: NextPage<{ token: string }> = (props) => {
	const AuthUser = useAuthUser();

	useEffect(() => {
		if (props.token !== '0' && AuthUser.clientInitialized) {
			signInWithCustomToken(getAuth(getApp()), props.token);
		}
	}, [AuthUser, props.token]);

	return (
		<>
			<main>Loading...</main>
		</>
	);
};

const SPOTIFY_API_TOKEN_URL = 'https://accounts.spotify.com/api/token';

export const getServerSideProps = withAuthUserTokenSSR()(async (context) => {
	const code = `${context.query.code}`;

	if (code) {
		const tokenRequestFormData = {
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || '',
			client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '',
			client_secret: process.env.SPOTIFY_CLIENT_SECRET || '',
		};

		const tokenRequest = await axios.post(
			SPOTIFY_API_TOKEN_URL,
			tokenRequestFormData,
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		if (tokenRequest.status === 200) {
			const { access_token, refresh_token, expires_in } =
				tokenRequest.data;
			// Get user info
			const UserReq = await axios.get('https://api.spotify.com/v1/me', {
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			});

			// expires_in is in seconds, so we need to convert it to a timestamp
			const expires_at = new Date().getTime() + expires_in * 1000;

			if (UserReq.status === 200) {
				const { display_name, email, id, images } = UserReq.data;

				const token = await auth().createCustomToken(id);

				await firestore()
					.collection('users')
					.doc(id)
					.set(
						{
							id,
							access_token,
							refresh_token,
							expires_at,
						},
						{
							mergeFields: [
								'access_token',
								'refresh_token',
								'expires_at',
							],
						}
					);

				// if the user doesn't exist, create them
				const user = await auth().getUser(id);

				if (!user) {
					await auth().createUser({
						uid: id,
						displayName: display_name,
						email: email,
						photoURL: images[0].url,
					});
				}

				await auth().updateUser(id, {
					displayName: display_name,
					email: email,
					photoURL: images[0].url,
				});

				return {
					props: {
						token,
					},
				};
			}
		}
	}

	return {
		props: {
			token: '0',
		},
	};
});

export default withAuthUser({ whenAuthed: AuthAction.REDIRECT_TO_APP })(
	Page as any
);
