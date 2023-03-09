import { Artist } from './Artist';

export type Track = {
	id: string;
	name: string;
	artists: Artist[];
	image: string;
	duration_ms: number;
	preview_url: string;

	// User data
	pre_description?: string;
	post_description?: string;
};
