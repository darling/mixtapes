import initAuth from '@/initAuth';
import Link from 'next/link';
import { Container } from './Container';

initAuth();

const navLinks = [
	{
		name: 'Home',
		href: '/',
	},
	{
		name: 'About',
		href: '/about',
	},
	{
		name: 'Mixtapes',
		href: '/mixtapes',
	},
	{
		name: 'Playlists',
		href: '/playlists',
	},
];

export const Header = () => {
	return (
		<div>
			<nav>
				<Container>
					<div className="my-8 flex flex-row gap-8 justify-center">
						{navLinks.map((link) => (
							<Link key={link.name} href={link.href}>
								<span className="tracking-wider font-bold">
									{link.name}
								</span>
							</Link>
						))}
					</div>
				</Container>
			</nav>
		</div>
	);
};
