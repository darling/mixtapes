import React from 'react';
import {
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSpotifyAccessToken } from '@/util/admin/spotify';
import axios from 'axios';
import { auth } from 'firebase-admin';
import initAuth from '@/initAuth';
import { Container } from '@/components/layout/Container';
import { Layout } from '@/components/layout/Layout';
import { PageTitleWithDescription } from '@/components/misc/PageTitle';

initAuth();

const Page: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
	props
) => {
	const [createMixtapeDispatched, setCreateMixtapeDispatched] =
		React.useState<boolean>(false);
	// Tracks can only have up to 5 unique songs
	const [tracks, setTracks] = React.useState<string[]>([]);
	const AuthUser = useAuthUser();

	const addTrack = (trackId: string) => {
		// make sure there are no duplicates
		const uniqueTracks = new Set(tracks);

		if (uniqueTracks.has(trackId)) {
			return;
		}

		if (tracks.length < 5) {
			setTracks([...tracks, trackId]);
		}
	};

	const removeTrack = (trackId: string) => {
		setTracks(tracks.filter((track) => track !== trackId));
	};

	const reorderTracks = (startIndex: number, endIndex: number) => {
		const result = Array.from(tracks);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		setTracks(result);
	};

	const createMixtape = async () => {
		// Validate that there are up to 5 tracks
		// Validate that there are no duplicate tracks
		// Validate that there is one track

		setCreateMixtapeDispatched(true);

		if (tracks.length > 5) {
			throw new Error('Too many tracks');
		}

		if (tracks.length < 1) {
			throw new Error('Not enough tracks');
		}

		// make sure they are unique
		const uniqueTracks = new Set(tracks);

		if (uniqueTracks.size !== tracks.length) {
			throw new Error('Duplicate tracks');
		}

		try {
			const response = await axios.post(
				'/api/mixtape/create',
				{
					tracks,
				},
				{
					headers: {
						Authorization: `${await AuthUser.getIdToken()}`,
					},
				}
			);

			const mixtapeId = response.data.mixtape;

			// redirect to mixtape page

			window.location.href = `/mixtape/${mixtapeId}`;
		} catch (error) {
			console.error(error);
			// reset tracks
			setTracks([]);
		}
	};

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Mixtape" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<Container>
					<PageTitleWithDescription title="Create Mixtape">
						Choose up to 5 songs to add into a mixtape. Once you
						create the mixtape the songs cannot be changed.
					</PageTitleWithDescription>
					<div className="pb-16">
						<div className="text-xs tracking-wider">
							{props.playlist?.public ? 'Public' : 'Private'}{' '}
							Playlist
						</div>
						<h2 className="font-bold text-2xl font-serif">
							{props.playlist?.name}
						</h2>
						<div className="grid grid-cols-2">
							<div>{props.playlist?.tracks.total} tracks</div>
							<div>
								<a
									href={props.playlist?.external_urls.spotify}
									target="_blank"
								>
									Manage on Spotify
								</a>
							</div>
						</div>
					</div>
					<div
						className="bg-stone-100 rounded-lg p-4 my-4"
						hidden={tracks.length == 0}
					>
						<div className="text-2xl font-bold pb-4">
							{tracks.length} / 5 Tracks Loaded
						</div>
						<button
							className="py-2 px-4 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600"
							onClick={createMixtape}
							disabled={createMixtapeDispatched}
						>
							Create Mixtape
						</button>
					</div>
					<div className="grid grid-cols-1 gap-4">
						{props.playlist?.tracks.items.map((object, i) => {
							if (object.track) {
								const track = object.track;

								const selectedStyle = tracks.includes(track.id)
									? 'bg-indigo-500 text-white'
									: 'bg-stone-100';

								const isOnList = tracks.includes(track.id);

								return (
									<div
										className="flex flex-row gap-2"
										key={track.id + i}
									>
										<button
											className={
												selectedStyle +
												' w-full rounded-lg transition duration-300 text-left p-4'
											}
											onClick={
												tracks.includes(track.id)
													? () =>
															removeTrack(
																track.id
															)
													: () => addTrack(track.id)
											}
											key={track.id}
										>
											<div className="flex flex-col">
												<div hidden={!isOnList}>
													{tracks.indexOf(track.id) +
														1}
												</div>
												<div className="font-bold md:text-lg truncate">
													{track.name}
												</div>
												<div>
													{track.artists
														.map(
															(artist) =>
																artist.name
														)
														.join(', ')}
												</div>
											</div>
										</button>
									</div>
								);
							}
						})}
					</div>
				</Container>
			</Layout>
		</>
	);
};

export const getServerSideProps = withAuthUserTokenSSR()(async (context) => {
	const { AuthUser } = context;
	const { id } = context.query;

	let props: {
		playlist?: SpotifyApi.PlaylistObjectFull;
	} = {
		playlist: undefined,
	};

	if (!id) {
		return {
			notFound: true,
			props,
		};
	}

	if (AuthUser.id) {
		const spotifyAccessToken = await getSpotifyAccessToken(AuthUser.id);

		if (spotifyAccessToken) {
			const playlist = await axios.get<SpotifyApi.PlaylistObjectFull>(
				`https://api.spotify.com/v1/playlists/${id}`,
				{
					headers: {
						Authorization: `Bearer ${spotifyAccessToken}`,
					},
				}
			);

			props = {
				playlist: playlist.data,
			};
		} else {
			await auth().revokeRefreshTokens(AuthUser.id);

			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
				props: {
					playlists: [],
				},
			};
		}
	}

	return {
		props,
	};
});

export default withAuthUser()(Page as any);
