import initAuth from '@/initAuth';
import { getSpotifyAccessToken } from '@/util/admin/spotify';
import axios from 'axios';
import { auth, firestore } from 'firebase-admin';
import { NextApiHandler } from 'next';
import { verifyIdToken } from 'next-firebase-auth';
import { array, object, string } from 'yup';

initAuth();

let mixtapeCreateRequestSchema = object({
	tracks: array().of(string()).max(5).min(1).required(),
});

const handler: NextApiHandler = async (req, res) => {
	if (!req.headers || !req.headers.authorization) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	// Make sure this is a POST request
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	// The body should consist of a JSON object with a tracks property
	// Tracks is a list of 5 or less Spotify track IDs
	// Example: { "tracks": ["1", "2", "3", "4", "5"] }

	// Make sure the body fits the schema
	let tracks;

	try {
		const body = await mixtapeCreateRequestSchema.validate(req.body);
		tracks = body.tracks;
	} catch (error) {
		return res.status(400).json({ message: 'Bad Request' });
	}

	// Make sure the user is authenticated
	const AuthUser = await verifyIdToken(req.headers.authorization);

	if (!AuthUser || !AuthUser.id) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const access_token = await getSpotifyAccessToken(AuthUser.id);

	if (!access_token) {
		await auth().revokeRefreshTokens(AuthUser.id);
		return res.status(401).json({ message: 'Unauthorized' });
	}

	// Everything checks out, create the mixtape

	try {
		// Ask spotify for the tracks
		const tracksRequest =
			await axios.get<SpotifyApi.MultipleTracksResponse>(
				'https://api.spotify.com/v1/tracks',
				{
					params: {
						ids: tracks.join(','),
					},
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			);

		const spotifyTracks = tracksRequest.data.tracks;
		const mixtapeTracks = spotifyTracks.map((track) => {
			return {
				id: track.id,
				name: track.name,
				artists: track.artists.map((artist) => {
					return {
						id: artist.id,
						name: artist.name,
					};
				}),
				image: track.album.images[0].url,
				duration_ms: track.duration_ms,
				preview_url: track.preview_url,
			};
		});

		const mixtape = await firestore()
			.collection('mixtapes')
			.add({
				tracks: mixtapeTracks,
				creator: {
					id: AuthUser.id,
					name: AuthUser.displayName,
				},
				created_at: Date.now(),
				public: true,
			});

		return res.status(200).json({ mixtape: mixtape.id });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export default handler;
