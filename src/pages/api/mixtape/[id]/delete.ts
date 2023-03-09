import initAuth from '@/initAuth';
import { getMixtape } from '@/util/admin/mixtape';
import { firestore } from 'firebase-admin';
import { NextApiHandler } from 'next';
import { verifyIdToken } from 'next-firebase-auth';

initAuth();

const handler: NextApiHandler = async (req, res) => {
	if (!req.headers || !req.headers.authorization) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const mixtapeId = req.query.id as string;
	const mixtape = await getMixtape(mixtapeId);

	if (!mixtape) {
		return res.status(404).json({ message: 'Not Found' });
	}

	let AuthUser;

	try {
		AuthUser = await verifyIdToken(req.headers.authorization);
	} catch (error) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	if (AuthUser && mixtape.creator.id !== AuthUser.id) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	// delete the mixtape
	const ref = firestore().collection('mixtapes').doc(mixtapeId);

	await ref.delete();

	return res.status(200).json({ message: 'Success' });
};

export default handler;
