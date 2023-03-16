import { generateRandomColorSet } from '@/util/style/hashedGradient';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
	runtime: 'edge',
};

const font = fetch(
	new URL('../../../assets/Fraunces_72pt_SuperSoft-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
	const mixtapeId = req.nextUrl.searchParams.get('id') || '1';
	const mixtapeTitle = req.nextUrl.searchParams.get('title');
	const mixtapeAuthor = req.nextUrl.searchParams.get('author');
	const fontData = await font;

	const colors = generateRandomColorSet(mixtapeId);

	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					height: '100%',
					backgroundColor: '#fafaf9',
				}}
			>
				<div
					style={{
						display: 'flex',
					}}
				>
					<h1
						style={{
							fontFamily: 'Fraunces',
							fontSize: 72,
							color: '#44403c',
						}}
					>
						{mixtapeTitle || 'A mixtape (but digital)'}
					</h1>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{colors.map((color, i) => (
						<div
							key={i}
							style={{
								width: 100,
								height: 100,
								borderRadius: '50%',
								backgroundColor: color,
								margin: 10,
							}}
						/>
					))}
				</div>
				<div
					style={{
						display: mixtapeAuthor ? 'flex' : 'none',
					}}
				>
					<h2
						style={{
							fontFamily: 'Fraunces',
							fontSize: 36,
							color: '#44403c',
						}}
					>
						by {mixtapeAuthor}
					</h2>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					data: fontData,
					name: 'Fraunces',
				},
			],
		}
	);
}
