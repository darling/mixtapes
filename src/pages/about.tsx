import React from 'react';
import {
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';

const Page: NextPage = () => {
	const AuthUser = useAuthUser();

	return (
		<>
			<Head>
				<title>About MixtapesBut.Digital</title>
				<meta
					name="description"
					content="Learn more about MixtapesBut.Digital, a unique music sharing platform designed to bring back the cherished experience of creating mixtapes for loved ones. Get to know the story, the creator, and our collaboration with Spotify."
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<Container>
					<div className="prose prose-headings:font-serif mt-44">
						<h1>About MixtapesBut.Digital</h1>

						<p>
							Welcome to MixtapesBut.Digital, a unique and
							personal music sharing platform designed to rekindle
							the cherished experience of creating mixtapes for
							your loved ones. Our goal is to provide a simple yet
							powerful way for people to express their feelings
							through thoughtfully curated music collections.
						</p>

						<h2>The MixtapesBut.Digital Experience</h2>

						<p>
							At MixtapesBut.Digital, we believe that sharing
							music is an intimate and meaningful process. We
							strive to recreate the nostalgic mixtape-making
							experience from before the era of streaming
							services. By limiting each mixtape to just 5 songs,
							we encourage you to thoughtfully choose each track,
							making your mixtape a truly special gift.
						</p>

						<h2>Who We Are</h2>

						<p>
							MixtapesBut.Digital is the brainchild of a
							passionate college student who loves curating music.
							As a portfolio project, it showcases their
							development skills and aims to create a charming and
							useful platform for people to connect with others
							through music.
						</p>

						<h2>Our Collaboration with Spotify</h2>

						<p>
							We're excited to collaborate with Spotify,
							leveraging their API to give you access to a vast
							library of songs for your mixtapes. This partnership
							ensures a seamless user experience when searching
							for and adding songs to your collection.
						</p>

						<h2>Looking forward</h2>

						<p>
							Although MixtapesBut.Digital is not yet released,
							we're thrilled about the enthusiasm and excitement
							we've received so far. As we prepare for our launch,
							we invite you to be a part of our community, whether
							you're interested in expressing your emotions,
							creating a unique gift, or simply enjoying the art
							of music curation.
						</p>

						<p>(Socials pending)</p>

						<p>
							We can't wait for you to experience
							MixtapesBut.Digital and witness the connections that
							form through the power of music. Stay tuned for our
							upcoming release and get ready to share the love
							with MixtapesBut.Digital!
						</p>
					</div>
				</Container>
			</Layout>
		</>
	);
};

export default withAuthUser()(Page as any);
