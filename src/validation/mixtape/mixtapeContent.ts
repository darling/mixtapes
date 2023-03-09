import { useCallback } from 'react';
import { boolean, object, string } from 'yup';
import { newlineRemoval, trim } from './trackContent';

const shortFieldRules = string()
	.max(128)
	.transform(trim)
	.transform(newlineRemoval);

const longFieldRules = string()
	.max(2048)
	.transform(trim)
	.transform(newlineRemoval);

export const mixtapeContentSchema = object({
	title: shortFieldRules,
	description: longFieldRules,
	to: shortFieldRules,
	from: shortFieldRules,
	public: boolean(),
});

export const useMixtapeContentValidationResolver = (
	validationSchema: typeof mixtapeContentSchema
) =>
	useCallback(
		async (data: unknown) => {
			try {
				const values = await validationSchema.validate(data, {
					abortEarly: false,
				});

				return {
					values,
					errors: {},
				};
			} catch (error: any) {
				return {
					values: {},
					errors: error.inner.reduce(
						(
							allErrors: any,
							currentError: { path: any; type: any; message: any }
						) => ({
							...allErrors,
							[currentError.path]: {
								type: currentError.type ?? 'validation',
								message: currentError.message,
							},
						}),
						{}
					),
				};
			}
		},
		[validationSchema]
	);
