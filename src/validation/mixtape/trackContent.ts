import { useCallback } from 'react';
import { ValidationError, object, string } from 'yup';

export const trim = (value: string, originalValue: string) => {
	if (originalValue.trim().length > 0) {
		return originalValue;
	}
	return undefined;
};

export const newlineRemoval = (value: string, originalValue: string) => {
	// Remove multiple newlines
	const newValue = originalValue.replace(/\n{4,}/g, '\n\n\n');

	// Check if the value contains real content
	if (newValue.trim().length > 0) {
		return newValue;
	}
	return undefined;
};

const descriptionRule = string()
	.max(2048)
	.transform(trim)
	.transform(newlineRemoval);

export const mixtapeTrackUpdateSchema = object({
	pre_description: descriptionRule,
	post_description: descriptionRule,
});

export const useMixtapTrackUpdateValidationResolver = (
	validationSchema: typeof mixtapeTrackUpdateSchema
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
			} catch (error: unknown) {
				if (error instanceof ValidationError) {
					return {
						values: {},
						errors: error.inner.reduce((all, current) => {
							return {
								...all,
								[current.path as string]: {
									type: current.type || 'validation',
									message: current.message,
								},
							};
						}, {}),
					};
				}

				return {
					values: {},
					errors: {},
				};
			}
		},
		[validationSchema]
	);
