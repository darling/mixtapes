import React, { useEffect } from 'react';
import {
	AuthAction,
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { NextPage } from 'next';
import initAuth from '@/initAuth';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { PageTitleWithDescription } from '@/components/misc/PageTitle';
import Link from 'next/link';
import { useFetch } from '@/util/swr';

initAuth();

type Playlist = {
	id: string;
	name: string;
	image?: string;
	tracks: number;
};

const Page: NextPage = () => {
	const AuthUser = useAuthUser();

	useEffect(() => {}, [AuthUser]);

	const [page, setPage] = React.useState(0);
	const { data, isLoading, error } = useFetch<Playlist[]>(
		'/api/spotify/playlists?page=' + page,
		AuthUser
	);

	const changePage = (page: number) => {
		setPage(page);

		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

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
					<PageTitleWithDescription title="Your Spotify Playlists">
						Choose which playlist you want to turn into a mixtape.
						Ideally the playlist will have 5 songs. I suggest
						picking and ordering the 5 songs inside a playlist
						before you start here.
					</PageTitleWithDescription>
					<div hidden={!isLoading}>Loading...</div>
					<div>
						{error && (
							<pre>
								<p>
									<strong>Error:</strong>
									There's been an error fetching your
									playlists. Try again.
								</p>
								<code>{JSON.stringify(error, null, 2)}</code>
							</pre>
						)}
					</div>
					<div
						hidden={isLoading}
						className="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
					>
						<button
							className="bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-2 px-4 rounded-lg"
							onClick={() => changePage(page - 1)}
							disabled={page === 0}
							hidden={page === 0}
						>
							Previous
						</button>
						<button
							className="bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-2 px-4 rounded-lg"
							onClick={() => changePage(page + 1)}
							disabled={(data?.length || 0) < 50}
							hidden={(data?.length || 0) < 50}
						>
							Next
						</button>
					</div>
					<div
						hidden={isLoading || data?.length === 0}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
					>
						{data?.map((playlist) => {
							const playlistCoverImage = playlist.image;

							return (
								<Link
									href={`/playlist/${playlist.id}`}
									className="flex flex-row shadow-sm hover:shadow-md lg:flex-col h-24 lg:h-auto gap-2 p-2 bg-stone-100 rounded-lg"
									key={playlist.id}
								>
									<img
										src={playlistCoverImage}
										className="shadow-sm rounded-lg aspect-square"
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
					<div hidden={isLoading || data?.length !== 0}>
						<p
							hidden={page !== 0}
							className="text-center text-stone-900 font-bold py-2 px-4 rounded-lg"
						>
							No playlists found. Try adding some to your Spotify
							account.
						</p>
						<p
							hidden={page === 0}
							className="text-center text-stone-900 font-bold py-2 px-4 rounded-lg"
						>
							This page is empty because of math or something,
							sorry.
						</p>
					</div>
					<div
						hidden={isLoading}
						className="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
					>
						<button
							className="bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-2 px-4 rounded-lg"
							onClick={() => changePage(page - 1)}
							disabled={page === 0}
							hidden={page === 0}
						>
							Previous
						</button>
						<button
							className="bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-2 px-4 rounded-lg"
							onClick={() => changePage(page + 1)}
							disabled={(data?.length || 0) < 50}
							hidden={(data?.length || 0) < 50}
						>
							Next
						</button>
					</div>
				</Container>
			</Layout>
		</>
	);
};

export const getServerSideProps = withAuthUserTokenSSR({
	whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({
	whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
})(Page as any);
