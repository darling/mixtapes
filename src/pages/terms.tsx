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
				<title>Terms and Conditions</title>
				<meta
					name="description"
					content="Review the Terms of Service for MixtapesBut.Digital, which outline the rules and guidelines for using our music sharing platform. Make sure to read and understand our terms before creating and sharing mixtapes."
				></meta>
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
		'https://www.iubenda.com/api/terms-and-conditions/62207639/no-markup'
	);

	const data = response.data;

	return {
		props: {
			content: data.content,
		},
	};
};

export default withAuthUser()(Page as any);
