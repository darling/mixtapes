import { Mixtape } from '@/types/Mixtape';
import {
	cyrb128,
	generateRandomGradientSet,
} from '@/util/style/hashedGradient';
import { motion } from 'framer-motion';
import { FC, useRef, useState } from 'react';

type Props = {
	mixtape: Mixtape;
};

export const Cassette: FC<Props> = ({ mixtape }) => {
	const cardRef = useRef<HTMLDivElement>(null);

	const rotateToMouse = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (!cardRef.current) return;
		const bounds = cardRef.current.getBoundingClientRect();

		const mouseCoords = {
			x: e.clientX,
			y: e.clientY,
		};

		const leftX = mouseCoords.x - bounds.x;
		const topY = mouseCoords.y - bounds.y;

		const center = {
			x: leftX - bounds.width / 2,
			y: topY - bounds.height / 2,
		};

		const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

		cardRef.current.style.transform = `
        scale3d(1.07, 1.07, 1.07)
        rotate3d(
            ${center.y / 100}, 
            ${-center.x / 100}, 
            0, 
            ${Math.log(distance) * 2}deg
        )`;
	};

	const resetRotation = () => {
		if (!cardRef.current) return;
		cardRef.current.style.transform = `
		scale3d(1, 1, 1)
		rotate3d(
		    0,
		    0,
		    0,
		    0
		)`;
	};

	const mixtapeDuration = mixtape.tracks.reduce((acc, track) => {
		return acc + track.duration_ms;
	}, 0);

	const mixtapeDurationHuman = new Date(mixtapeDuration)
		.toISOString()
		.substring(14, 19);

	const mixtapeCreatedHuman = new Date(mixtape.created_at).toLocaleDateString(
		'en-US',
		{
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}
	);

	return (
		<div
			style={{
				perspective: '1500px',
			}}
			className="mx-8"
		>
			<div
				ref={cardRef}
				className="cassette mx-auto bg-stone-900 text-yellow-50 select-none rounded-lg"
				onMouseMove={rotateToMouse}
				onMouseLeave={resetRotation}
				onTouchEnd={resetRotation}
			>
				<div className="h-full w-full p-4">
					<div className="w-full h-5/6 rounded-lg overflow-hidden shadow-sm">
						<div
							style={{
								background: generateRandomGradientSet(
									`${mixtape.id} ${mixtape.id}`
								),
								filter: 'contrast(1.2) saturation(1.2)',
								height: '100%',
								width: '100%',
								// over the course of mixtape duration, rotate the hue
								animation: `rotateHue ${Math.round(
									mixtapeDuration / 1000 / 25
								)}s linear infinite`,
							}}
						>
							<img
								className="absolute w-full h-full"
								src="https://grainy-gradients.vercel.app/noise.svg"
								alt={mixtape.title}
								style={{
									// multiply using the image as a mask
									mixBlendMode: 'multiply',
									// make sure the image is always on top and covers the entire div
									zIndex: 1,
									top: 0,
									left: 0,
								}}
							/>
							<div className="h-1/2"></div>
							<div className="h-1/2 flex flex-row justify-around">
								<div className="bg-yellow-50 rounded-full h-full aspect-square flex flex-row items-center justify-center">
									<motion.div
										animate={{
											rotate: [0, 360],
										}}
										transition={{
											duration: 5,
											repeat: Infinity,
											ease: 'linear',
										}}
										className="bg-stone-900 h-1/2 aspect-square rounded-lg shadow-inner"
									></motion.div>
								</div>
								<div className="bg-yellow-50 rounded-full h-full aspect-square flex flex-row items-center justify-center">
									<motion.div
										animate={{
											rotate: [0, 360],
										}}
										transition={{
											duration: 5,
											repeat: Infinity,
											ease: 'linear',
										}}
										className="bg-stone-900 h-1/2 aspect-square rounded-lg shadow-inner"
									></motion.div>
								</div>
							</div>
						</div>
					</div>
					<div className="text-sm text-stone-300 flex flex-row justify-between">
						<p>{mixtapeDurationHuman}</p>
						<p>{mixtapeCreatedHuman}</p>
					</div>
					<div className="flex justify-end">
						<p className="text-xs font-serif text-stone-500">
							MixtapesBut.Digital
						</p>
					</div>
				</div>

				<h2 className="font-sans lg:text-5xl text-2xl font-bold align-middle truncate pb-4">
					{mixtape.title || `Untitled`}
				</h2>
			</div>
		</div>
	);
};
