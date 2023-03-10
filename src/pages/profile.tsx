import React from 'react';
import {
	AuthAction,
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { PageTitle } from '@/components/misc/PageTitle';
import { useRouter } from 'next/router';

const Page: NextPage = () => {
	const AuthUser = useAuthUser();
	const router = useRouter();

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
					<div className="text-center pt-24 sm:pt-32 pb-8 max-w-2xl mx-auto">
						<h1 className="text-4xl sm:text-6xl font-serif font-bold">
							{AuthUser.displayName}'s Profile
						</h1>
					</div>
					<div className="flex flex-row items-center justify-center">
						<div className="rounded-full aspect-square bg-stone-200 overflow-clip h-24">
							<img src={AuthUser.photoURL || undefined} alt="" />
						</div>
					</div>
					<div className="grid grid-cols-1 gap-8 mt-8">
						<button
							onClick={() => {
								AuthUser.signOut();
								router.push('/');
							}}
							className="bg-red-300 text-red-900 py-2 px-4 rounded-lg shadow-md"
						>
							Log out
						</button>

						<div>
							<p>
								Deleting your account will delete all of your
								mixtapes. This action cannot be undone.
							</p>
							<button
								onClick={() => {
									alert(
										'Not implemented yet || Please email abuse@unworthy.net if not contact Safe'
									);
								}}
								className="bg-red-300 text-red-900 py-2 px-4 rounded-lg shadow-md"
							>
								Delete Account
							</button>
						</div>
					</div>
				</Container>
			</Layout>
		</>
	);
};

export default withAuthUser({
	whenAuthed: AuthAction.RENDER,
})(Page as any);
