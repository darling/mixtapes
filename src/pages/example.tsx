import React from 'react';
import {
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { InferGetServerSidePropsType, NextPage } from 'next';

const Page: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
	const AuthUser = useAuthUser();

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
			<main></main>
		</>
	);
};

export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(Page as any);
