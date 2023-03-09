export const getSpotifySignInUrl = () => {
	// Read playlists
	// Read user profile
	// Read currently playing
	// Modify playback state
	// Create playlists & edit playlists
	const scopes = [
		'playlist-read-private',
		'playlist-read-collaborative',
		'user-read-private',
		'user-read-email',
		'user-read-playback-state',
		'user-modify-playback-state',
		'user-read-currently-playing',
		'playlist-modify-public',
		'playlist-modify-private',
	];

	const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
	const redirect_uri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || '';

	const url = new URL('https://accounts.spotify.com/authorize');
	url.searchParams.append('client_id', client_id);
	url.searchParams.append('response_type', 'code');
	url.searchParams.append('redirect_uri', redirect_uri);
	url.searchParams.append('scope', scopes.join(' '));

	return url.toString();
};
