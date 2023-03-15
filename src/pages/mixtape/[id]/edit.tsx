import React, { useEffect } from 'react';
import {
	AuthAction,
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { InferGetServerSidePropsType, NextPage } from 'next';
import initAuth from '@/initAuth';
import { Mixtape } from '@/types/Mixtape';
import axios from 'axios';
import { TrackSegment } from '@/components/mixtape/TrackSegment';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useFetch } from '@/util/swr';
import { Container } from '@/components/layout/Container';
import { Layout } from '@/components/layout/Layout';
import { Cassette } from '@/components/misc/Cassette';
import Link from 'next/link';
import {
	PageTitle,
	PageTitleWithDescription,
} from '@/components/misc/PageTitle';
import { EditMixtape } from '@/components/mixtape/editor/EditMixtape';
import { EditTrackSegment } from '@/components/mixtape/editor/EditTrackSegment';

initAuth();

const lorem =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nunc nisl eget nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nunc nisl eget nisl.';

const Page: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
	props
) => {
	const router = useRouter();
	const AuthUser = useAuthUser();

	const mixtapeId = router.query.id as string;

	const { isLoading, error, data } = useFetch<Mixtape>(
		'/api/mixtape/' + mixtapeId,
		AuthUser
	);

	const tryDelete = async (mixtape: Mixtape) => {
		// if no AuthUser, return
		if (!AuthUser || !AuthUser.id) return;

		// DELETE to /api/mixtape/:id/delete

		try {
			const deleteRequest = await axios.delete(
				'/api/mixtape/' + mixtape.id + '/delete',
				{
					headers: {
						Authorization: `${await AuthUser.getIdToken()}`,
					},
				}
			);

			if (deleteRequest.status === 200) {
				router.push('/mixtapes');
			}
		} catch (error) {
			AuthUser.signOut();
			router.push('/');
		}
	};

	if (!data) return <div>Loading...</div>;

	return (
		<>
			<Head>
				<title>
					Editing {data.title || 'Untitled'} | Mixtapes But Digital
				</title>
				<meta name="description" content="Mixtape" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="bg-red-400">
				{error && <div>Error: {error.message}</div>}
			</div>
			<Layout>
				<Container>
					<PageTitleWithDescription title="Edit your mixtape">
						While you can't edit the mixtape itself, you can add
						notes to the tracks and change the mixtape "cover" here.
					</PageTitleWithDescription>
				</Container>
				<Container>
					<div className="grid grid-cols-1 gap-8">
						<div className="p-4 bg-stone-100 rounded-lg">
							<div className="mb-4">
								<h2>Mixtape Information</h2>
							</div>
							<div>
								<EditMixtape mixtape={data} />
							</div>
						</div>
						{data.tracks.map((track) => (
							<div
								className="p-4 bg-stone-100 rounded-lg"
								key={track.id}
							>
								<EditTrackSegment
									track={track}
									mixtape={data}
								/>
							</div>
						))}
						<div className="">
							<button
								className="text-red-900 bg-red-300 rounded-lg px-4 py-2"
								onClick={() => tryDelete(data)}
							>
								Delete
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
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
	whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
})(Page as any);
