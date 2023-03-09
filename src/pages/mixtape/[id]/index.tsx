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
import axios from 'axios';
import { TrackSegment } from '@/components/mixtape/TrackSegment';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { useFetch } from '@/util/swr';
import { Container } from '@/components/layout/Container';
import { Layout } from '@/components/layout/Layout';
import { Cassette } from '@/components/misc/Cassette';
import Link from 'next/link';

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

	const [step, setStep] = React.useState(0);

	const playSongOnSpotify = async (mixtape: Mixtape) => {
		// if no AuthUser, return
		if (!AuthUser || !AuthUser.id) return;

		const trackIds = mixtape.tracks.map((track) => track.id);
		// post these to /api/mixtape/play
		try {
			const playRequest = await axios.post(
				'/api/mixtape/play',
				{
					tracks: trackIds,
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
			AuthUser.signOut();
			router.push('/');
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

	if (!data) return <div>Loading...</div>;

	return (
		<>
			<Head>
				<title>
					{data.title || 'A mixtape'} by{' '}
					{data.from || data.creator.name} | A mixtape (but digital)
				</title>
				<meta name="description" content="Mixtape" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<Container>
					<div className="max-w-xl mx-auto bg-purple-100 border-2 border-purple-500 text-purple-900 rounded-lg p-4 flex flex-row justify-between">
						<h2>Manage your mixtape</h2>
						<Link
							className="px-4 py-2 rounded-md bg-purple-200"
							href={`/mixtape/${mixtapeId}/edit`}
						>
							Edit
						</Link>
					</div>
					<div
						style={{
							minHeight: '80vh',
						}}
						className="flex flex-col py-16 justify-items-stretch justify-between"
					>
						<div className="text-center flex flex-col gap-4 py-4">
							<h1 className="text-4xl font-serif font-bold">
								{data.title ||
									'From: ' + (data.from || data.creator.name)}
							</h1>
							<p>{data.description}</p>
							<div className="flex flex-row gap-4 mx-auto">
								{data.to && <p>To: {data.to}</p>}
								{data.from && <p>From: {data.from}</p>}
							</div>
						</div>
						<div className="max-w-2xl h-full w-full mx-auto">
							<Cassette mixtape={data} />
						</div>
					</div>
					<div className="flex flex-col">
						{data.tracks.map((track, index) => {
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
										<div className="relative">
											<div
												className="absolute inset-0 flex items-center"
												aria-hidden="true"
											>
												<div className="w-full border-t border-stone-700" />
											</div>
											<div className="relative flex justify-center">
												<span className="bg-stone-50 text-stone-700 px-3 mr-3 text-base leading-6">
													{index + 1}
												</span>
												<span className="bg-stone-50 text-stone-700 px-3 text-base leading-6">
													Spotify
												</span>
											</div>
										</div>
										<TrackSegment
											track={track}
											mixtapeId={data.id || ''}
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
												playSongOnSpotify(data)
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
								{new Date(data.created_at).toLocaleDateString()}{' '}
								{data.to ? ` for ${data.to}` : ''} by{' '}
								{data.from || data.creator.name}. It contains{' '}
								{data.tracks.length} special track
								{data.tracks.length > 1 ? 's' : ''} picked just
								for you.
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
									value={window.location.href}
									readOnly
								/>
								<button
									onClick={() =>
										navigator.clipboard.writeText(
											window.location.href
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

export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(Page as any);
