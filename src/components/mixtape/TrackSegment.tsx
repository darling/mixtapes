import { Track } from '@/types/Track';
import { useAuthUser } from 'next-firebase-auth';
import Link from 'next/link';
import { FC, useState } from 'react';

export const TrackSegment: FC<{
	track: Track;
	index?: number;
	mixtapeId: string;
}> = ({ track, index }) => {
	const AuthUser = useAuthUser();

	return (
		<>
			<div className="pt-8">
				<div className="relative ">
					<div
						className="absolute inset-0 flex items-center"
						aria-hidden="true"
					>
						<div className="w-full border-t border-stone-700" />
					</div>
					<div className="relative flex justify-center">
						<span className="bg-stone-50 text-stone-700 px-3 mr-3 text-base leading-6">
							{(index || 0) + 1}
						</span>
						<Link
							href={`https://open.spotify.com/track/${track.id}`}
							target="_blank"
							className="bg-stone-50 text-stone-700 px-3 text-base leading-6"
						>
							Spotify
						</Link>
					</div>
				</div>
			</div>
			<TrackDescriptionTextArea
				track={track}
				value={track.pre_description}
			/>
			<div className="py-8 my-8 tracking-wider font-serif text-center">
				<h2 className="md:text-6xl text-5xl font-bold drop-shadow-md">
					{track.name}
				</h2>
				<h3 className="md:text-2xl my-2">
					{track.artists.map((artist) => artist.name).join(', ')}
				</h3>
			</div>
			<TrackDescriptionTextArea
				track={track}
				value={track.post_description}
			/>
		</>
	);
};

const TrackDescriptionTextArea: FC<{
	value?: string;
	track: Track;
}> = ({ value }) => {
	const basicClass =
		'md:text-xl font-sans placeholder:italic min-h-fit ring-none ring-purple-500 py-4 my-4 w-full';

	if (!value || value == '') return <></>;

	return (
		<div
			className="whitespace-pre-wrap break-words md:leading-relaxed"
			hidden={value == ''}
		>
			<p className={basicClass}>{value}</p>
		</div>
	);
};
