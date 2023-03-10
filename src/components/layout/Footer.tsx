import { FC } from 'react';
import { Container } from './Container';
import Link from 'next/link';

const navLinks = [
	{
		name: 'Home',
		href: '/',
	},
	{
		name: 'Policy',
		href: '/policy',
	},
	{
		name: 'Terms',
		href: '/terms',
	},
	{
		name: 'Hello',
		href: '/curated',
	},
];

export const Footer: FC = () => {
	return (
		<>
			<footer className="bg-stone-100 mt-20">
				<Container>
					<div className="flex flex-row gap-8 py-20">
						{navLinks.map((link) => (
							<Link key={link.name} href={link.href}>
								{link.name}
							</Link>
						))}
					</div>
					<div className="py-20 text-3xl lg:text-5xl font-serif font-bold">
						Spread mixtapes not hate
					</div>
					<div className="py-20 text-stone-700 text-xs italic tracking-wider">
						&copy; 2023 Carter (Safe) - All Rights Reserved
					</div>
				</Container>
			</footer>
		</>
	);
};
