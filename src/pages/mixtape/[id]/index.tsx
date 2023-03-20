import React, { useEffect } from 'react';
import {
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { InferGetServerSidePropsType, NextPage } from 'next';
import initAuth from '@/initAuth';
import { Mixtape } from '@/types/Mixtape';
import axios, { AxiosError } from 'axios';
import { TrackSegment } from '@/components/mixtape/TrackSegment';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useFetch } from '@/util/swr';
import { Container } from '@/components/layout/Container';
import { Layout } from '@/components/layout/Layout';
import { Cassette } from '@/components/misc/Cassette';
import Link from 'next/link';
import { getMixtape } from '@/util/admin/mixtape';
import { PageTitle } from '@/components/misc/PageTitle';

initAuth();

const Page: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
	props
) => {
	const router = useRouter();
	const AuthUser = useAuthUser();

	const mixtapeId = router.query.id as string;

	const [step, setStep] = React.useState(0);

	const playSongOnSpotify = async (mixtape: Mixtape) => {
		// if no AuthUser, return
		if (!AuthUser || !AuthUser.id) {
			router.push('/auth?mixtape=' + mixtape.id);
			return;
		}

		const trackIds = mixtape.tracks.map((track) => track.id);
		// post these to /api/mixtape/play
		try {
			const playRequest = await axios.post(
				'/api/mixtape/play',
				{
					tracks: trackIds,
					mixtape: mixtape.id,
				},
				{
					headers: {
						Authorization: `${await AuthUser.getIdToken()}`,
					},
				}
			);

			// If 200 increase step
			if (playRequest.status === 200) {
				setStep(step + 1);
			}
		} catch (error) {
			// check if the error is axios error
			if (axios.isAxiosError(error) && error instanceof AxiosError) {
				// if it is, check if the error is 401
				if (error && error.response && error.response.status === 401) {
					// if it is, sign out the user and if there's a redirect in the response, redirect to that
					AuthUser.signOut();

					if (error.response.data.redirect) {
						alert(
							'You need to be logged in to do that! We will redirect you to the login page now.'
						);
						router.push(error.response.data.redirect);
					} else {
						router.push('/');
					}
				}

				// if 500 or 400, show error

				console.error(error);

				// 400

				if (error.response && error.response.status === 400) {
					// inside the response, there should be a message
					if (error.response.data.message) {
						alert(error.response.data.message);
					}

					return;
				}
			}
		}
	};

	const scrollNext = () => {
		setStep(step + 1);
	};

	useEffect(() => {
		if (step > 0) {
			const el = document.getElementById(`${step - 1}`);
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	}, [step]);

	let mixtape = props.mixtape;

	const title = `${mixtape.title || 'A mixtape'} by ${
		mixtape.from || mixtape.creator.name
	} | A mixtape (but digital)`;

	return (
		<>
			<Head key={mixtape.id}>
				<title>{title || 'This is' + ' a Mixtape (but Digital)'}</title>
				<meta
					property="og:title"
					content={title || 'This is' + ' a Mixtape (but Digital)'}
				/>
				<meta property="og:type" content="website" />
				<meta
					property="og:url"
					content={`https://mixtapesbut.digital/mixtape/${mixtape.id}`}
				/>
				<meta
					property="og:image"
					content={`https://mixtapesbut.digital/api/mixtape/og?id=${mixtape.id}&title=${mixtape.title}&author=${mixtape.creator.name}`}
				/>
				<meta property="og:description" content={mixtape.description} />
				<meta property="og:site_name" content="Mixtapes but digital" />

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@mixtapesbutdig" />
				<meta name="twitter:creator" content="@mixtapesbutdig" />
				<meta name="twitter:title" content={title} />
				<meta
					name="twitter:description"
					content={mixtape.description}
				/>

				<meta name="description" content="Mixtape" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<Container>
					<div hidden={mixtape.creator.id !== AuthUser?.id}>
						<div className="max-w-xl mx-auto bg-purple-100 border-2 border-purple-500 text-purple-900 rounded-lg p-4 flex flex-row justify-between">
							<h2>Manage your mixtape</h2>
							<Link
								className="px-4 py-2 rounded-md bg-purple-200"
								href={`/mixtape/${mixtapeId}/edit`}
							>
								Edit
							</Link>
						</div>
					</div>
					<div
						style={{
							minHeight: '80vh',
						}}
						className="flex flex-col py-16 justify-items-stretch justify-between"
					>
						<div className="text-center flex flex-col gap-4 py-4">
							<h1 className="text-4xl font-serif font-bold">
								{mixtape.title ||
									'From: ' +
										(mixtape.from || mixtape.creator.name)}
							</h1>
							<p>{mixtape.description}</p>
							<div className="flex flex-row gap-4 mx-auto">
								{mixtape.to && <p>To: {mixtape.to}</p>}
								{mixtape.from && <p>From: {mixtape.from}</p>}
							</div>
						</div>
						<div className="max-w-2xl h-full w-full mx-auto">
							<Cassette mixtape={mixtape} />
						</div>
					</div>
					<div className="flex flex-col">
						{mixtape.tracks.map((track, index) => {
							return (
								<div key={track.name + track.id}>
									<motion.div
										animate={
											step > index
												? { opacity: 1 }
												: { opacity: 0 }
										}
										transition={{
											duration: 1,
											delay: 0.5,
											delayChildren: 0.5,
										}}
										layoutScroll
										className={
											(step <= index
												? 'hidden '
												: 'min-h-screen ') +
											'flex flex-col justify-center relative'
										}
										id={`${index}`}
									>
										<TrackSegment
											track={track}
											mixtapeId={mixtape.id || ''}
											index={index}
										/>
									</motion.div>
								</div>
							);
						})}

						<div className="flex flex-col">
							{step < 5 && (
								<motion.div
									className="mx-auto flex flex-row items-start"
									layout
									animate={{ opacity: 1 }}
									initial={{ opacity: 0 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.5 }}
								>
									<button
										onClick={scrollNext}
										className="bg-stone-700 text-yellow-50 rounded-full py-2 px-4"
									>
										{step === 0
											? 'View Contents'
											: 'View next track'}
									</button>
									<div hidden={step > 0} className="ml-2">
										<button
											onClick={() =>
												playSongOnSpotify(mixtape)
											}
											className="bg-green-500 text-yellow-50 rounded-full py-2 px-4 "
										>
											Play on Spotify
										</button>
										<div className="italic text-xs text-stone-700 text-center">
											Might require sign-in
										</div>
									</div>
								</motion.div>
							)}
						</div>
					</div>
				</Container>
				<Container>
					<div className="py-16 grid lg:grid-cols-2 grid-cols-1 gap-4">
						<div className="flex flex-col gap-4">
							<h2 className="text-3xl text-center font-serif">
								What is this?
							</h2>
							<p>
								This mixtape was created on{' '}
								{new Date(
									mixtape.created_at
								).toLocaleDateString()}{' '}
								{mixtape.to ? ` for ${mixtape.to}` : ''} by{' '}
								{mixtape.from || mixtape.creator.name}. It
								contains {mixtape.tracks.length} special track
								{mixtape.tracks.length > 1 ? 's' : ''} picked
								just for you.
							</p>
							<p>
								By connecting your spotify account, you can play
								the mixtape on spotify. The songs should
								autoplay in order, but you can also skip to the
								next song by clicking the next button. And
								because this is a mixtape, you can't see the
								next song unless you press skip or "View next
								track".
							</p>
							<p>
								The songs on each mixtape from this site can't
								be changed, and each mixtape is unique.
							</p>
						</div>
						<div className="flex flex-col gap-4">
							<h2 className="text-3xl text-center font-serif">
								Share
							</h2>
							<p>
								You can share this mixtape with anyone by
								sending them the link:
							</p>
							<div className="flex flex-row w-full gap-1">
								<input
									className="bg-stone-700 w-full text-yellow-50 rounded-l-full py-2 pl-4"
									contentEditable={false}
									value={`https://mixtapesbut.digital/mixtape/${mixtape.id}`}
									readOnly
								/>
								<button
									onClick={() =>
										navigator.clipboard.writeText(
											`https://mixtapesbut.digital/mixtape/${mixtape.id}`
										)
									}
									className="bg-stone-700 text-yellow-50 rounded-r-full py-2 px-4"
								>
									Copy
								</button>
							</div>
							<p>
								There are also image formats of the mixtape to
								share on social media:
							</p>
						</div>
					</div>
				</Container>
			</Layout>
		</>
	);
};

export const getServerSideProps = withAuthUserTokenSSR()(async (context) => {
	const { id } = context.query;

	const mixtape = await getMixtape(id as string);

	if (!mixtape) {
		return {
			notFound: true,
			props: {
				mixtape: {} as Mixtape,
			},
		};
	}

	const AuthUser = context.AuthUser;

	// Check if the user is the creator of the mixtape
	// And if the mixtape is public
	if (AuthUser?.id === mixtape.creator.id || mixtape.public) {
		return {
			props: {
				mixtape,
			},
		};
	}

	return {
		notFound: true,
		props: {
			mixtape: {} as Mixtape,
		},
	};
});

export default withAuthUser()(Page as any);
