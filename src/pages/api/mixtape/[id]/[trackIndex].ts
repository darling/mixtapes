import initAuth from '@/initAuth';
import { Mixtape } from '@/types/Mixtape';
import { Track } from '@/types/Track';
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

	// Make sure the body fits the schema
	let trackUpdate: Partial<Track> = {};

	try {
		const body = await mixtapeTrackUpdateSchema.validate(req.body);
		trackUpdate = body;
	} catch (error) {
		return res.status(400).json({ message: 'Bad Request' });
	}

	// Make sure the user is authenticated
	const AuthUser = await verifyIdToken(req.headers.authorization);

	if (!AuthUser || !AuthUser.id) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const mixtapeId = req.query.id as string;
	const trackIndex = req.query.trackIndex as string;
	const trackIndexInt = parseInt(trackIndex);

	const mixtapeDocument = await firestore()
		.collection('mixtapes')
		.doc(mixtapeId)
		.get();

	if (!mixtapeDocument.exists) {
		return res.status(404).json({ message: 'Not Found' });
	}

	const mixtape = mixtapeDocument.data() as Mixtape;

	if (mixtape.creator.id !== AuthUser.id) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	// Make sure the track index is valid
	if (trackIndexInt < 0 || trackIndexInt >= mixtape.tracks.length) {
		return res.status(400).json({ message: 'Bad Request' });
	}

	// Everything checks out, overwrite the track metadata without messing with the rest of the mixtape

	try {
		const track = mixtape.tracks[trackIndexInt];

		// Update the track
		const updatedTrack: any = {
			...track,
			...trackUpdate,
		};

		Object.keys(updatedTrack).forEach((key: string) => {
			if (updatedTrack[key] === undefined) {
				delete updatedTrack[key];
			}
		});

		// Update the mixtape
		mixtape.tracks[trackIndexInt] = updatedTrack;

		console.log('Updated track', updatedTrack);

		// Update the mixtape in Firestore
		const ref = await mixtapeDocument.ref.update({
			tracks: mixtape.tracks,
		});

		return res.status(200).json(mixtape);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export default handler;
