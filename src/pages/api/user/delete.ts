import initAuth from '@/initAuth';
import { auth, firestore } from 'firebase-admin';
import { NextApiHandler } from 'next';
import { verifyIdToken } from 'next-firebase-auth';

initAuth();

const handler: NextApiHandler = async (req, res) => {
	if (!req.headers || !req.headers.authorization) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	// Make sure this is a DELETE request
	if (req.method !== 'DELETE') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	try {
		// Make sure the user is authenticated
		const AuthUser = await verifyIdToken(req.headers.authorization);

		if (!AuthUser || !AuthUser.id) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		// Everything checks out, delete the user

		await auth().deleteUser(AuthUser.id);

		// delete all mixtapes

		await firestore()
			.collection('mixtapes')
			.where('creator.id', '==', AuthUser.id)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					doc.ref.delete();
				});
			});

		await firestore().collection('users').doc(AuthUser.id).delete();

		return res.status(200).json({ message: 'OK' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export default handler;
