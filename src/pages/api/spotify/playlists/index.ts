import initAuth from '@/initAuth';
import { getSpotifyAccessToken } from '@/util/admin/spotify';
import axios from 'axios';
import { auth, firestore } from 'firebase-admin';
import { NextApiHandler } from 'next';
import { verifyIdToken } from 'next-firebase-auth';

initAuth();

const handler: NextApiHandler = async (req, res) => {
	if (!req.headers || !req.headers.authorization) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	// Make sure this is a GET request
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	const AuthUser = await verifyIdToken(req.headers.authorization);

	if (!AuthUser || !AuthUser.id) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const access_token = await getSpotifyAccessToken(AuthUser.id);

	if (!access_token) {
		await auth().revokeRefreshTokens(AuthUser.id);
		return res.status(401).json({ message: 'Unauthorized' });
	}

	// Everything checks out, get the playlists

	// if index parameter is not provided, default to 0
	const offset = req.query.page ? parseInt(req.query.page as string) : 0;

	try {
		const playlistsRequest =
			await axios.get<SpotifyApi.ListOfUsersPlaylistsResponse>(
				'https://api.spotify.com/v1/me/playlists',
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
					params: {
						limit: 50,
						offset: offset * 50,
					},
				}
			);

		const playlists = playlistsRequest.data.items.map((playlist) => ({
			id: playlist.id,
			name: playlist.name,
			image: playlist.images?.[0]?.url || undefined,
			tracks: playlist.tracks.total,
		}));

		return res.status(200).json(playlists);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export default handler;
