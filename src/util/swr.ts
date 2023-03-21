import initAuth from '@/initAuth';
import axios from 'axios';
import { AuthUser } from 'next-firebase-auth';
import useSWR from 'swr';

initAuth();

const fetcher = async (url: string, AuthUser: AuthUser) => {
	const token = await AuthUser?.getIdToken();

	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: token || undefined,
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
	return useSWR<Data, Error>(url, (url: string) => fetcher(url, AuthUser));
};
