import React from 'react';
import {
	AuthAction,
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { getSpotifyAccessToken } from '@/util/admin/spotify';
import { InferGetServerSidePropsType, NextPage } from 'next';
import axios from 'axios';
import { auth } from 'firebase-admin';
import initAuth from '@/initAuth';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { PageTitle } from '@/components/misc/PageTitle';
import Link from 'next/link';

initAuth();

const Page: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
	props
) => {
	const AuthUser = useAuthUser();

	return (
		<>
			<Head>
				<title key={'Title'}>{AuthUser.displayName}'s Playlists</title>
				<meta name="description" content="Mixtape" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<Container>
					<PageTitle>Your Spotify Playlists</PageTitle>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{props.playlists.map((playlist) => {
							const playlistCoverImage = playlist.images[0];

							return (
								<Link
									href={`/playlist/${playlist.id}`}
									className="flex flex-row shadow-sm hover:shadow-md lg:flex-col h-24 lg:h-auto gap-2 p-2 bg-stone-100 rounded-lg"
									key={playlist.id}
								>
									<img
										src={playlistCoverImage?.url}
										className="h-full shadow-sm rounded-lg aspect-square"
									/>
									<div className="pb-8 overflow-hidden">
										<h2 className="font-bold truncate tracking-wider">
											{playlist.name}
										</h2>
									</div>
								</Link>
							);
						})}
					</div>
				</Container>
			</Layout>
		</>
	);
};

export const getServerSideProps = withAuthUserTokenSSR({
	whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (context) => {
	const { AuthUser } = context;

	const output = [];

	if (AuthUser.id) {
		const spotifyAccessToken = await getSpotifyAccessToken(AuthUser.id);

		if (spotifyAccessToken) {
			const response =
				await axios.get<SpotifyApi.ListOfUsersPlaylistsResponse>(
					`https://api.spotify.com/v1/me/playlists`,
					{
						headers: {
							Authorization: `Bearer ${spotifyAccessToken}`,
						},
						params: {
							limit: 50,
						},
					}
				);

			const data = response.data;

			if (data.items) {
				output.push(...data.items);
			}
		} else {
			await auth().revokeRefreshTokens(AuthUser.id);

			return {
				redirect: {
					destination: '/auth',
					permanent: false,
				},
				props: {
					playlists: [],
				},
			};
		}
	}

	return {
		props: {
			playlists: output,
		},
	};
});

export default withAuthUser({
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Page as any);
