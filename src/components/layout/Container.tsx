import { styleGlobals } from '@/util/style/globals';
import { FC } from 'react';

export const Container: FC<{ children: any }> = (props) => {
	return (
		<div className={styleGlobals.content} {...props}>
			{props.children}
		</div>
	);
};
