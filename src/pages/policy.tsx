import React from 'react';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import Head from 'next/head';
import { InferGetStaticPropsType, NextPage } from 'next';
import axios from 'axios';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';

const Page: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
	props
) => {
	const AuthUser = useAuthUser();

	return (
		<>
			<Head>
				<title>Privacy Policy</title>
				<meta
					name="description"
					content="Discover MixtapesBut.Digital's Privacy Policy, which details how we handle and protect your personal information. Learn about our data collection, usage, and sharing practices to ensure a safe and secure experience."
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<Container>
					<div
						className="prose prose-stone mx-auto mt-44"
						dangerouslySetInnerHTML={{ __html: props.content }}
					></div>
				</Container>
			</Layout>
		</>
	);
};

export const getStaticProps = async () => {
	const response = await axios.get(
		'https://www.iubenda.com/api/privacy-policy/62207639/no-markup'
	);

	const data = response.data;

	return {
		props: {
			content: data.content,
		},
	};
};

export default withAuthUser()(Page as any);
