import React from 'react';
import {
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { getSpotifySignInUrl } from '@/util/spotify';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { HomeHero } from '@/components/home/Hero';
import { HomeFeatures } from '@/components/home/Features';

const Home = () => {
	const AuthUser = useAuthUser();

	return (
		<>
			<Head>
				<title>Create a Digital Mixtape</title>
				<meta name="description" content="Mixtape" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<HomeHero />
				<HomeFeatures />
				<Container>
					<div className="max-w-5xl mx-auto">
						<div>Hello, world!</div>
						{AuthUser.id ? (
							<div className="block">
								<div>
									Logged in as {AuthUser.displayName} aka{' '}
									{AuthUser.id}
								</div>
								<img src={AuthUser.photoURL || ''} alt="" />
								<button onClick={() => AuthUser.signOut()}>
									Sign out
								</button>
								<div className="flex flex-col">
									<Link href={'/playlists'}>
										see playlists
									</Link>
									<Link href={'/mixtapes'}>see mixtapes</Link>
								</div>
							</div>
						) : (
							<div>
								<a
									className="bg-green-500 text-white font-bold text-center rounded-full px-4 py-2 w-full"
									href={getSpotifySignInUrl()}
								>
									Sign in to Spotify
								</a>
							</div>
						)}
					</div>
				</Container>
			</Layout>
		</>
	);
};

export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(Home);
