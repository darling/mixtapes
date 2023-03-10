import initAuth from '@/initAuth';
import { getMixtape } from '@/util/admin/mixtape';
import { NextApiHandler } from 'next';
import { verifyIdToken } from 'next-firebase-auth';

initAuth();

const handler: NextApiHandler = async (req, res) => {
	const mixtapeId = req.query.id as string;
	const mixtape = await getMixtape(mixtapeId);

	if (!mixtape) {
		return res.status(404).json({ message: 'Not Found' });
	}

	let AuthUser;

	if (req.headers.authorization) {
		try {
			AuthUser = await verifyIdToken(req.headers.authorization);
		} catch (error) {
			console.error(error);
		}
	}

	if (!mixtape.public && AuthUser && mixtape.creator.id !== AuthUser.id) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	// return the mixtape
	return res.status(200).json(mixtape);
};

export default handler;
