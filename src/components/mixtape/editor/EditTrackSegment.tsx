import initAuth from '@/initAuth';
import { Mixtape } from '@/types/Mixtape';
import { Track } from '@/types/Track';
import {
	mixtapeTrackUpdateSchema,
	useMixtapTrackUpdateValidationResolver,
} from '@/validation/mixtape/trackContent';
import axios from 'axios';
import { useAuthUser } from 'next-firebase-auth';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';

initAuth();

export const EditTrackSegment: FC<{ track: Track; mixtape: Mixtape }> = ({
	track,
	mixtape,
}) => {
	const { mutate } = useSWRConfig();
	const AuthUser = useAuthUser();
	const resolver = useMixtapTrackUpdateValidationResolver(
		mixtapeTrackUpdateSchema
	);

	const { register, handleSubmit, formState, reset } = useForm({
		resolver,
		defaultValues: {
			pre_description: track.pre_description,
			post_description: track.post_description,
		},
		mode: 'onChange',
	});

	const submitHandler = handleSubmit(async (data) => {
		const validData = await mixtapeTrackUpdateSchema.validate(data);

		console.log('VALID DATA', validData);

		const trackIndex = mixtape.tracks.findIndex(
			(mixtapeTrack) => mixtapeTrack.id === track.id
		);

		const response = await axios.post(
			`/api/mixtape/${mixtape.id}/${trackIndex}`,
			validData,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${await AuthUser.getIdToken()}`,
				},
			}
		);

		console.log('RESPONSE', response);

		// the response should be the updated mixtape
		const mixtapeNew = response.data;

		// its time to invalidate the swr cache
		mutate(`/api/mixtape/${mixtape.id}`, mixtapeNew);

		// reset the form
		reset({
			pre_description: track.pre_description,
			post_description: track.post_description,
		});
	});

	return (
		<form className="flex flex-col gap-4" onSubmit={submitHandler}>
			<div className="text-center">
				<h2 className="font-serif font-bold text-lg">{track.name}</h2>
				<div className="text-xs">
					{track.artists.map((artist) => artist.name).join(', ')}
				</div>
			</div>
			<div>
				<label htmlFor="pre_description">Pre-Description</label>
				<textarea
					className="form-item"
					placeholder="This will show up before the track"
					{...register('pre_description')}
				/>
			</div>
			<div>
				<label htmlFor="post_description">Post-Description</label>
				<textarea
					className="form-item"
					placeholder="This will show up after the track"
					{...register('post_description')}
				/>
			</div>
			<div>
				{formState.errors.post_description?.message ||
					formState.errors.pre_description?.message}
			</div>
			<div className="flex justify-center items-center gap-4">
				<input
					hidden={!formState.isDirty}
					className="bg-stone-900 text-stone-300 rounded-full py-2 px-4"
					onClick={() => {
						reset();
					}}
					type="button"
					value="Reset"
				/>
				<input
					hidden={!formState.isDirty}
					disabled={!formState.isValid}
					className="bg-stone-900 text-stone-300 transition-colors duration-100 disabled:bg-red-900 disabled:text-red-300 disabled:cursor-not-allowed rounded-full py-2 px-4 cursor-pointer"
					type="submit"
					value="Submit"
				/>
			</div>
		</form>
	);
};
