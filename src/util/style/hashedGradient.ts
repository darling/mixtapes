export const cyrb128 = (str: string) => {
	let h1 = 0xdeadbeef ^ 0,
		h2 = 0x41c6ce57 ^ 0;
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 =
		Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
		Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 =
		Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
		Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const generateRandomGradientSet = (mixtapeId: string) => {
	// hash the mixtapeId for a seed
	const seed = cyrb128(mixtapeId);

	// generate a random number between 0 and 1
	const random = ((seed + 15) * 9301 + 49297) % 233280;

	// The number of gradients is between 5 and 10
	const numGradients = Math.floor((random / 233280) * 5) + 5;

	let gradients: string[] = [];

	// Essentially: for each gradient, generate a random number between 0 and 1, then use that number to generate a random color, position, and radius
	// The key to this though is it's all seeded by the mixtapeId, so the same mixtapeId will always generate the same gradient set
	for (let i = 0; i < numGradients; i++) {
		const random = Math.sin(seed + i) * 10000;
		const randomNumber = random - Math.floor(random);

		const x1 = Math.floor(randomNumber * 100);
		const y1 = Math.floor(Math.sin(randomNumber * Math.PI) * 100);

		const hue = Math.floor(randomNumber * 360);
		const saturation = Math.floor(randomNumber * 50) + 50;
		const lightness = Math.floor(randomNumber * 50) + 50;
		const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

		const radius = Math.floor(randomNumber * 15) + 5;

		const gradient = `radial-gradient(circle at ${x1}% ${y1}%, ${color} ${radius}%, transparent 70%), `;

		gradients.push(gradient);
	}

	return gradients.join('') + ' rgb(28 25 23 / var(--tw-bg-opacity))';
};
