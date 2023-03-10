import { FC } from 'react';
import { Container } from '../layout/Container';
import Link from 'next/link';

export const HomeCTA: FC = () => {
	return (
		<div className="bg-stone-100">
			<Container>
				<div className="py-24 sm:py-32 lg:flex lg:items-center lg:justify-between">
					<h2 className="text-3xl font-serif font-bold tracking-tight text-stone-700 sm:text-4xl">
						Ready to get started?
						<br />
						Share your feelings with a mixtape.
					</h2>
					<div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
						<Link
							href="/auth"
							className="rounded-full bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Get started
						</Link>
						<Link
							href="/about"
							className="text-sm font-semibold leading-6 text-stone-700"
						>
							Learn more <span aria-hidden="true">→</span>
						</Link>
					</div>
				</div>
			</Container>
		</div>
	);
};
