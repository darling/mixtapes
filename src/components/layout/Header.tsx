import initAuth from '@/initAuth';
import { FC, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Container } from './Container';
import Link from 'next/link';
import { useAuthUser } from 'next-firebase-auth';

initAuth();

const navigation = [
	{ name: 'About', href: '/about' },
	{ name: 'Playlists', href: '/playlists' },
	{ name: 'Mixtapes', href: '/mixtapes' },
];

export const Header: FC = () => {
	const AuthUser = useAuthUser();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header>
			<Container>
				<nav
					className="w-full flex items-center justify-between py-6 px-2 lg:px-0"
					aria-label="Global"
				>
					<div className="flex lg:flex-1">
						<Link href="/" className="-m-1.5 p-1.5">
							<span className="sr-only">
								Mixtapes But Digital
							</span>
							<img
								className="h-8 w-auto"
								src="/img/MixtapesButDigital.svg"
								alt=""
							/>
						</Link>
					</div>
					<div className="flex lg:hidden">
						<button
							type="button"
							className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-stone-700"
							onClick={() => setMobileMenuOpen(true)}
						>
							<span className="sr-only">Open main menu</span>
							<Bars3Icon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
					<div className="hidden lg:flex lg:gap-x-12">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className="text-sm font-semibold leading-6 text-stone-900"
							>
								{item.name}
							</Link>
						))}
					</div>
					<div className="hidden lg:flex lg:flex-1 lg:justify-end">
						{AuthUser.id ? (
							<Link
								href="/profile"
								className="text-sm font-semibold leading-6 text-stone-900"
							>
								{AuthUser.displayName}
							</Link>
						) : (
							<Link
								href="/auth"
								className="text-sm font-semibold leading-6 text-stone-900"
							>
								Log in <span aria-hidden="true">&rarr;</span>
							</Link>
						)}
					</div>
				</nav>
				<Dialog
					as="div"
					className="lg:hidden"
					open={mobileMenuOpen}
					onClose={setMobileMenuOpen}
				>
					<div className="fixed inset-0 z-10" />
					<Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-stone-900/10">
						<div className="flex items-center justify-between">
							<Link href="/" className="-m-1.5 p-1.5">
								<span className="sr-only">
									Mixtapes But Digital
								</span>
								<img
									className="h-8 w-auto"
									src="/img/MixtapesButDigital.svg"
									alt=""
								/>
							</Link>
							<button
								type="button"
								className="-m-2.5 rounded-md p-2.5 text-stone-700"
								onClick={() => setMobileMenuOpen(false)}
							>
								<span className="sr-only">Close menu</span>
								<XMarkIcon
									className="h-6 w-6"
									aria-hidden="true"
								/>
							</button>
						</div>
						<div className="mt-6 flow-root">
							<div className="-my-6 divide-y divide-stone-500/10">
								<div className="space-y-2 py-6">
									{navigation.map((item) => (
										<Link
											key={item.name}
											href={item.href}
											className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-stone-900 hover:bg-stone-50"
										>
											{item.name}
										</Link>
									))}
								</div>
								<div className="py-6">
									{AuthUser?.id ? (
										<Link
											href="/profile"
											className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-stone-900 hover:bg-stone-50"
										>
											{AuthUser.displayName}
										</Link>
									) : (
										<Link
											href="/auth"
											className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-stone-900 hover:bg-stone-50"
										>
											Log in
										</Link>
									)}
								</div>
							</div>
						</div>
					</Dialog.Panel>
				</Dialog>
			</Container>
		</header>
	);
};
