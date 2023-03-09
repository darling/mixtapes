import { init } from 'next-firebase-auth';

const initAuth = () => {
	init({
		authPageURL: '/auth',
		appPageURL: '/playlists',
		loginAPIEndpoint: '/api/login',
		logoutAPIEndpoint: '/api/logout',
		cookies: {
			name: 'Mixtapes',
			keys: [process.env.COOKIE_SECRET_CURRENT],
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
			sameSite: 'strict',
			path: '/',
			signed: true,
		},
		firebaseClientInitConfig: {
			apiKey: 'AIzaSyCwFmjpp1pTGi-z4oPiEeGGFy50gEhEmOY',
			authDomain: 'mixtapes-89c52.firebaseapp.com',
			projectId: 'mixtapes-89c52',
			storageBucket: 'mixtapes-89c52.appspot.com',
			messagingSenderId: '139033774209',
			appId: '1:139033774209:web:3dad01f1c5aca2da216580',
			measurementId: 'G-N9SSQFGBG2',
		},
		firebaseAdminInitConfig: {
			credential: {
				projectId: 'mixtapes-89c52',
				clientEmail:
					'firebase-adminsdk-us6w5@mixtapes-89c52.iam.gserviceaccount.com',
				privateKey:
					process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
						/\\n/g,
						'\n'
					) ?? '',
			},
			databaseURL: 'https://mixtapes-89c52.firebaseio.com',
		},
		onVerifyTokenError: (error) => {
			console.error(error);
		},
		onTokenRefreshError: (error) => {
			console.error(error);
		},
	});
};

export default initAuth;
