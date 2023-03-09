import { firestore } from 'firebase-admin';

export const getSpotifyAccessToken = async (
	id: string
): Promise<string | undefined> => {
	const userEntry = await firestore().collection('users').doc(id).get();

	if (!userEntry.exists) {
		return undefined;
	}

	const user = userEntry.data();

	const accessToken = user?.access_token;
	const refreshToken = user?.refresh_token;
	const expiresAt = user?.expires_at;

	if (!accessToken || !refreshToken || !expiresAt) {
		return undefined;
	}

	if (Date.now() >= expiresAt) {
		// try to mint a new token or return null
		const newAccessToken = await refreshSpotifyAccessToken(id);

		if (!newAccessToken) {
			return undefined;
		}

		return newAccessToken;
	}

	return accessToken;
};

export const refreshSpotifyAccessToken = async (
	id: string
): Promise<string | undefined> => {
	const userEntry = await firestore().collection('users').doc(id).get();

	if (!userEntry.exists) {
		return undefined;
	}

	const user = userEntry.data();

	const accessToken = user?.access_token;
	const refreshToken = user?.refresh_token;
	const expiresAt = user?.expires_at;

	if (!accessToken || !refreshToken || !expiresAt) {
		return undefined;
	}

	if (Date.now() - 1000 * 60 * 5 < expiresAt) {
		return accessToken;
	}

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(
				`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
			).toString('base64')}`,
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		}),
	});

	const data = await response.json();

	if (!data.access_token) {
		return undefined;
	}

	await firestore()
		.collection('users')
		.doc(id)
		.update({
			access_token: data.access_token,
			expires_at: Date.now() + data.expires_in * 1000,
		});

	return data.access_token as string;
};
