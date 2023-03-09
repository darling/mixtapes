import { FC } from 'react';

export const PageTitle: FC<{ children?: any }> = ({ children }) => {
	return (
		<div className="text-center py-24 sm:py-32 max-w-2xl mx-auto">
			<h1 className="text-4xl sm:text-6xl font-serif font-bold">
				{children}
			</h1>
		</div>
	);
};

export const PageTitleWithDescription: FC<{
	title: string;
	children?: any;
}> = ({ children, title }) => {
	return (
		<div className="text-center py-24 sm:py-32 max-w-2xl mx-auto">
			<h1 className="text-4xl sm:text-6xl font-serif font-bold">
				{title}
			</h1>
			<div className="mt-4 tracking-wide">{children}</div>
		</div>
	);
};
