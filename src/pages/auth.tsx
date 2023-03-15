import React from 'react';
import {
	AuthAction,
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSpotifySignInUrl } from '@/util/spotify';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import initAuth from '@/initAuth';

initAuth();

const Page: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
	const AuthUser = useAuthUser();

	return (
		<>
			<Layout>
				<Container>
					<a href="/">Return Home</a>
					<a href={getSpotifySignInUrl()}>Sign into spotify</a>
					<p>
						You are currently{' '}
						{AuthUser.id
							? `signed in as ${AuthUser.displayName}`
							: `not signed in`}
						.
					</p>
				</Container>
			</Layout>
		</>
	);
};

export const getServerSideProps = withAuthUserTokenSSR({
	whenAuthed: AuthAction.REDIRECT_TO_APP,
})(async (context) => {
	let spotifyUrl = getSpotifySignInUrl();

	// sometimes a mixtape id is passed in the query
	const mixtapeId = context.query.mixtape as string;

	if (mixtapeId) {
		spotifyUrl += '&state=' + mixtapeId;
	}

	return {
		redirect: {
			destination: spotifyUrl,
			permanent: false,
		},
	};
});

export default withAuthUser({
	whenAuthed: AuthAction.REDIRECT_TO_APP,
})(Page as any);
