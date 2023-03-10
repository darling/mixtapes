import { FC } from 'react';
import { Container } from '../layout/Container';
import Link from 'next/link';
import { useAuthUser } from 'next-firebase-auth';

export const HomeHero: FC = () => {
	const AuthUser = useAuthUser();

	return (
		<div className="isolate">
			<div className="relative px-6 lg:px-8 py-32 lg:py-52">
				<Container>
					<div className="text-center">
						<h1 className="text-4xl font-serif font-bold tracking-tight text-stone-700 sm:text-6xl">
							Experience the magic of mixtapes with Spotify
						</h1>
						<p className="mt-6 text-lg leading-8 text-stone-600">
							Looking to express yourself through music? Curate a
							personalized musical experience that's a reflection
							of your feelings and memories.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							{AuthUser.id ? (
								<Link
									href="/playlists"
									className="rounded-full bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									Create a Mixtape
								</Link>
							) : (
								<Link
									href="/auth"
									className="rounded-full shadow-lg bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
								>
									Sign into Spotify
								</Link>
							)}
							<a
								href="#"
								className="text-sm font-semibold leading-6 text-stone-700"
							>
								Learn more <span aria-hidden="true">→</span>
							</a>
						</div>
					</div>
				</Container>
			</div>
		</div>
	);
};
