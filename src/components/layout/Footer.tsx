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
				</Container>
			</footer>
		</>
	);
};
