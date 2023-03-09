import initAuth from '@/initAuth';
import axios from 'axios';
import { AuthUser } from 'next-firebase-auth';
import useSWRImmutable from 'swr/immutable';

initAuth();

const fetcher = async (url: string, AuthUser: AuthUser) => {
	const token = (await AuthUser?.getIdToken()) || 'null';

	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: `${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw new Error('Error fetching data' + error);
	}
};

// rewrite useFetch to use Generics for Data and Error types

export const useFetch = <Data = any, Error = any>(
	url: string,
	AuthUser: AuthUser
) => {
	return useSWRImmutable<Data, Error>(url, (url: string) =>
		fetcher(url, AuthUser)
	);
};
