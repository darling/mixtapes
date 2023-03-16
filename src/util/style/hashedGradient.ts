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
		const color = `#${hslToRgb(hue, saturation, lightness)}`;

		const radius = Math.floor(randomNumber * 15) + 5;

		const gradient = `radial-gradient(circle at ${x1}% ${y1}%, ${color} ${radius}%, transparent 70%)`;

		gradients.push(gradient);
	}

	return gradients.join(', ') + '';
};

export const generateRandomColorSet = (mixtapeId: string) => {
	// hash the mixtapeId for a seed
	const seed = cyrb128(mixtapeId);

	// The number of colors is fixed at 5
	const numColors = 5;

	let colors: string[] = [];

	// Essentially: for each color, generate a random number between 0 and 1, then use that number to generate a random color
	// The key to this though is it's all seeded by the mixtapeId, so the same mixtapeId will always generate the same color set
	for (let i = 0; i < numColors; i++) {
		const random = Math.sin(seed + i) * 10000;
		const randomNumber = random - Math.floor(random);

		const hue = Math.floor(randomNumber * 360);
		const saturation = Math.floor(randomNumber * 50) + 50;
		const lightness = Math.floor(randomNumber * 50) + 50;
		const color = `#${hslToRgb(hue, saturation, lightness)}`;

		colors.push(color);
	}

	return colors;
};

const hslToRgb = (h: number, s: number, l: number): string => {
	s /= 100;
	l /= 100;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	let r = 0;
	let g = 0;
	let b = 0;

	if (0 <= h && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (60 <= h && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (120 <= h && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (180 <= h && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (240 <= h && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (300 <= h && h < 360) {
		r = c;
		g = 0;
		b = x;
	}

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
};
