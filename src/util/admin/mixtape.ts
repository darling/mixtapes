import initAuth from '@/initAuth';
import { Mixtape } from '@/types/Mixtape';
import { firestore } from 'firebase-admin';

initAuth();

export const getMixtape = async (mixtapeId: string) => {
	const mixtape = await firestore()
		.collection('mixtapes')
		.doc(mixtapeId)
		.get();

	if (!mixtape.exists) {
		return;
	}

	let output = mixtape.data() as Mixtape;

	output.id = mixtape.id;

	return output;
};
