import { Buffer } from 'buffer';


/**
 * Prepend length to the data.
 *
 * @param data
 * @returns {Buffer}
 */
export function prependLength(data) {
	const lengthAsBytes = Buffer.alloc(4);

	lengthAsBytes.writeUInt32BE(data.length);

	return Buffer.concat([lengthAsBytes, data]);
}
