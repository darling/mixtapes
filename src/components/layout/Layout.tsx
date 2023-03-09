import { FC } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout: FC<{ children: any }> = ({ children }) => {
	return (
		<>
			<div className="min-h-screen">
				<Header />
				<main>{children}</main>
			</div>
			<Footer />
		</>
	);
};
