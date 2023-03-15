import React from 'react';
import {
	AuthAction,
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { NextPage } from 'next';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { useRouter } from 'next/router';
import axios from 'axios';

const Page: NextPage = () => {
	const AuthUser = useAuthUser();
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Manage Your Profile</title>
				<meta
					name="description"
					content="View and manage your MixtapesBut.Digital profile. Personalize your account, access your mixtape creations, and explore shared mixtapes from others. Make the most of your music sharing experience."
				></meta>
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
								onClick={async () => {
									// send DELETE to /api/user/delete

									await axios.delete('/api/user/delete', {
										headers: {
											Authorization: `${await AuthUser.getIdToken()}`,
										},
									});

									AuthUser.signOut();

									router.push('/');
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

export const getServerSideProps = withAuthUserTokenSSR({
	whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({
	whenAuthed: AuthAction.RENDER,
	whenUnauthedBeforeInit: AuthAction.RENDER,
})(Page as any);
