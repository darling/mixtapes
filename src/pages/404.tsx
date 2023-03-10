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
import { PageTitle } from '@/components/misc/PageTitle';
import Link from 'next/link';

const Page: NextPage = () => {
	const AuthUser = useAuthUser();

	return (
		<>
			<Head>
				<title>404 | Mixtapes But Digital</title>
				<meta name="description" content="Mixtape" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<Container>
					<PageTitle>Lost?</PageTitle>
					<div>
						<p>Sorry, we couldn't find that page.</p>
						<Link href={'/'}>
							Click here to return to the homepage
						</Link>
					</div>
				</Container>
			</Layout>
		</>
	);
};

export default withAuthUser()(Page as any);
