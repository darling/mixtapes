import initAuth from '@/initAuth';
import { Mixtape } from '@/types/Mixtape';
import { Track } from '@/types/Track';
import { getMixtape } from '@/util/admin/mixtape';
import { mixtapeContentSchema } from '@/validation/mixtape/mixtapeContent';
import { mixtapeTrackUpdateSchema } from '@/validation/mixtape/trackContent';
import { firestore } from 'firebase-admin';
import { NextApiHandler } from 'next';
import { verifyIdToken } from 'next-firebase-auth';

initAuth();

const handler: NextApiHandler = async (req, res) => {
	if (!req.headers || !req.headers.authorization) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	// Make sure this is a POST request
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	let mixtapeUpdate: Partial<Mixtape> = {};

	try {
		const body = await mixtapeContentSchema.validate(req.body);
		mixtapeUpdate = body;
	} catch (error) {
		return res.status(400).json({ message: 'Bad Request' });
	}

	// Make sure the user is authenticated
	const AuthUser = await verifyIdToken(req.headers.authorization);

	if (!AuthUser || !AuthUser.id) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const mixtapeId = req.query.id as string;

	if (!mixtapeId) {
		return res.status(400).json({ message: 'Bad Request' });
	}

	const mixtape = await getMixtape(mixtapeId);

	if (!mixtape) {
		return res.status(404).json({ message: 'Not Found' });
	}

	if (mixtape.creator.id !== AuthUser.id) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	// Everything checks out, overwrite the track metadata without messing with the rest of the mixtape

	try {
		const documentRef = firestore().collection('mixtapes').doc(mixtapeId);

		Object.keys(mixtapeUpdate).forEach((key: string) => {
			// @ts-ignore
			if (mixtapeUpdate[key] === undefined) {
				// @ts-ignore
				delete mixtapeUpdate[key];
			}
		});

		console.log(mixtapeUpdate);

		// Update the mixtape in Firestore
		const ref = await documentRef.update({
			...mixtapeUpdate,
		});

		let newMixtape = {
			...mixtape,
		};

		newMixtape = {
			...newMixtape,
			...mixtapeUpdate,
		};

		return res.status(200).json(newMixtape);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export default handler;
