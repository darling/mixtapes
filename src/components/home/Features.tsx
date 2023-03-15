import {
	CubeTransparentIcon,
	EyeIcon,
	PencilIcon,
} from '@heroicons/react/24/outline';
import { Container } from '../layout/Container';

const features = [
	{
		name: 'Limited size',
		description:
			'Each mixtape is limited to 5 songs. Create an experience that only uses the perfect tracks to convey your feelings.',
		href: '/about',
		icon: CubeTransparentIcon,
	},
	{
		name: 'Custom contents',
		description:
			"Listeners can't see tracks or the notes attached to each track ahead of time unless they open the mixtape or play it.",
		href: '/about',
		icon: PencilIcon,
	},
	{
		name: 'Unique experiences',
		description:
			"Each mixtape is unique and immutable. Once you've made the mixtape it can't be changed.",
		href: '/about',
		icon: EyeIcon,
	},
];

export function HomeFeatures() {
	return (
		<div className="py-24 sm:py-32">
			<Container>
				<div className="mx-auto max-w-2xl lg:mx-0">
					<h2 className="text-3xl font-serif font-bold tracking-tight text-stone-700 sm:text-4xl">
						A throwback to traditional mixtapes
					</h2>
					<p className="mt-6 text-lg leading-8 text-stone-600">
						The mixtape is an intimate way to share music with
						friends. It's a lost art, but we're bringing it back.
					</p>
				</div>
				<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
					<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
						{features.map((feature) => (
							<div key={feature.name} className="flex flex-col">
								<dt className="text-base font-semibold leading-7 text-stone-900">
									<div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-stone-600">
										<feature.icon
											className="h-6 w-6 text-white"
											aria-hidden="true"
										/>
									</div>
									{feature.name}
								</dt>
								<dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-stone-600">
									<p className="flex-auto">
										{feature.description}
									</p>
									<p className="mt-6">
										<a
											href={feature.href}
											className="text-sm font-semibold leading-6 text-stone-600"
										>
											Learn more{' '}
											<span aria-hidden="true">→</span>
										</a>
									</p>
								</dd>
							</div>
						))}
					</dl>
				</div>
			</Container>
		</div>
	);
}
