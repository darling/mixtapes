import { useEffect } from 'react';

export const useAutoResize = (ref: React.RefObject<HTMLTextAreaElement>) => {
	useEffect(() => {
		const resize = () => {
			if (ref.current) {
				ref.current.style.height = 'auto';
				ref.current.style.height = `${ref.current.scrollHeight}px`;
			}
		};

		if (ref.current) {
			ref.current.addEventListener('input', resize);
			resize();
		}

		return () => {
			if (ref.current) {
				ref.current.removeEventListener('input', resize);
			}
		};
	}, [ref]);
};
