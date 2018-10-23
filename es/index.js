import { Buffer } from 'buffer';
import { createPng } from './png';
import { prependLength } from './utils';


/**
 * Encode the given data to png.
 *
 * @param {string} data
 * @returns {Promise<Buffer>}
 */
export function encode(data) {
	const bytes = Buffer.from(data, 'utf8');
	const pixelData = prependLength(bytes);

	return createPng(pixelData);
}
