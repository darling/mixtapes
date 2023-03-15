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
import { HomeCTA } from '@/components/home/CTA';

const Home = () => {
	const AuthUser = useAuthUser();

	return (
		<>
			<Head>
				<title>Create a Digital Mixtape</title>
				<meta
					name="description"
					content="Welcome to MixtapesBut.Digital! Create and share personalized, intimate music collections with your loved ones. Connect your Spotify account and start curating your mixtape today."
				></meta>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<HomeHero />
				<HomeFeatures />
				<HomeCTA />
			</Layout>
		</>
	);
};

export default withAuthUser()(Home);
