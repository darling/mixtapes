import { Mixtape } from '@/types/Mixtape';
import { useAutoResize } from '@/util/form/useAutoResize';
import {
	mixtapeContentSchema,
	useMixtapeContentValidationResolver,
} from '@/validation/mixtape/mixtapeContent';
import axios from 'axios';
import { useAuthUser } from 'next-firebase-auth';
import { FC, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';

export const EditMixtape: FC<{ mixtape: Mixtape }> = ({ mixtape }) => {
	const { mutate } = useSWRConfig();
	const AuthUser = useAuthUser();
	const resolver = useMixtapeContentValidationResolver(mixtapeContentSchema);
	const { register, handleSubmit, formState, reset } = useForm<
		Partial<Mixtape>
	>({
		resolver,
		defaultValues: {
			title: mixtape.title,
			description: mixtape.description,
			to: mixtape.to,
			from: mixtape.from,
			public: mixtape.public,
		},
	});

	const { ref: preRef, ...restOfPreRef } = register('description');
	const preDescriptionRef = useRef<HTMLTextAreaElement>(null);

	useAutoResize(preDescriptionRef);

	const submitHandler = handleSubmit(async (data) => {
		console.log('SUBMIT DATA', data);

		const payload = await mixtapeContentSchema.validate(data);

		console.log('PAYLOAD', payload);

		const response = await axios.post(
			'/api/mixtape/' + mixtape.id + '/edit',
			{
				...payload,
			},
			{
				headers: {
					Authorization: `${await AuthUser.getIdToken()}`,
				},
			}
		);

		console.log('RESPONSE', response);

		mutate('/api/mixtape/' + mixtape.id, response.data);

		// override the local mixtape with the updated mixtape

		if (response.data) {
			reset({
				title: response.data.title,
				description: response.data.description,
				to: response.data.to,
				from: response.data.from,
				public: response.data.public,
			});
		}
	});

	return (
		<form className="flex flex-col gap-4" onSubmit={submitHandler}>
			<div>
				<label htmlFor="title">Title</label>
				<input className="form-item" {...register('title')} />
			</div>
			<div>
				<label htmlFor="description">Description</label>
				<textarea
					className="form-item resize-none"
					{...restOfPreRef}
					ref={(e) => {
						preRef(e);
						// @ts-ignore
						preDescriptionRef.current = e;
					}}
				/>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label htmlFor="to">To</label>
					<input className="form-item" {...register('to')} />
				</div>
				<div>
					<label htmlFor="from">From</label>
					<input className="form-item" {...register('from')} />
				</div>
				<div>
					<label htmlFor="public">Is Public?</label>
					<input type="checkbox" {...register('public')} />
				</div>
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
