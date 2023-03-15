import React from 'react';
import {
	AuthAction,
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { getSpotifyAccessToken } from '@/util/admin/spotify';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { firestore } from 'firebase-admin';
import initAuth from '@/initAuth';
import Link from 'next/link';
import { Mixtape } from '@/types/Mixtape';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Cassette } from '@/components/misc/Cassette';
import { PageTitle } from '@/components/misc/PageTitle';

initAuth();

const Page: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
	props
) => {
	const AuthUser = useAuthUser();

	return (
		<>
			<Head>
				<title key={'Title'}>{AuthUser.displayName}'s Playlists</title>
				<meta name="description" content="Mixtape" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<Container>
					<PageTitle>Your Mixtape Collection</PageTitle>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{props.mixtapes
							.sort((a, b) => {
								return b.created_at - a.created_at;
							})
							.map((mixtape) => (
								<div key={mixtape.id}>
									<div>
										<Link href={`/mixtape/${mixtape.id}`}>
											<div>
												<Cassette mixtape={mixtape} />
												<h2 className="text-center truncate mt-4">
													{mixtape.title ||
														'Untitled'}
												</h2>
											</div>
										</Link>
									</div>
								</div>
							))}
						<div>
							<Link href="/playlists">
								<div>
									<div className="cassette mx-8 rounded-md shadow-none border-dashed border-2 bg-stone-200 border-stone-800">
										<div className="w-full h-full p-4 flex flex-col justify-center items-center">
											<h2 className="text-2xl">
												Create a new mixtape
											</h2>
										</div>
									</div>
									<div className="text-center truncate mt-4">
										Do it!
									</div>
								</div>
							</Link>
						</div>
					</div>
				</Container>
			</Layout>
		</>
	);
};

export const getServerSideProps = withAuthUserTokenSSR({
	whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (context) => {
	const { AuthUser } = context;

	const output: Mixtape[] = [];

	if (AuthUser.id) {
		try {
			const documents = await firestore()
				.collection('mixtapes')
				.where('creator.id', '==', AuthUser.id)
				.get();
			documents.forEach((doc) => {
				let tape = doc.data() as Mixtape;
				tape.id = doc.id;
				output.push(tape);
			});
		} catch (error) {
			console.error(error);
		}
	}

	return {
		props: {
			mixtapes: output,
		},
	};
});

export default withAuthUser({
	whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
})(Page as any);
