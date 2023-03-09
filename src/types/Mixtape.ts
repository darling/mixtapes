import { Track } from './Track';

export type Mixtape = {
	// Immutable
	id: string;
	created_at: number;
	creator: {
		id: string;
		name: string;
	};
	tracks: Track[];

	// Editable by user::

	public: boolean;

	// User entered data
	title?: string;
	description?: string;
	to?: string;
	from?: string;
};
