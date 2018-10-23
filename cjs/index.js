'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var buffer = require('buffer');
var crc = require('crc');
var zlib = _interopDefault(require('zlib'));

/**
 * PNG header.
 *
 * @type {Buffer}
 */
const PNG_HEADER = buffer.Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

/**
 * Max width of the png.
 *
 * @type {number}
 */
const MAX_WIDTH = 1024;

/**
 * Create a chunk of the given type with the given data.
 *
 * @param type
 * @param data
 * @returns {Buffer}
 */
function createChunk(type, data) {
	const length = typeof data != 'undefined' ? data.length : 0;
	const chunk = buffer.Buffer.alloc(4 + 4 + length + 4);

	chunk.writeUInt32BE(length, 0);
	chunk.fill(type, 4, 8, 'utf8');
	if (typeof data != 'undefined') {
		chunk.fill(data, 8, chunk.length - 4);
	}
	chunk.writeUInt32BE(crc.crc32(chunk.slice(4, -4)), chunk.length - 4);

	return chunk;
}

/**
 * Create the IHDR chunk.
 *
 * @param width
 * @param height
 * @returns {Buffer}
 */
function createIHDRChunk(width, height) {
	const data = buffer.Buffer.alloc(13);

	// Width
	data.writeUInt32BE(width);
	// Height
	data.writeUInt32BE(height, 4);
	// Bit depth
	data.writeUInt8(8, 8);
	// RGBA mode
	data.writeUInt8(6, 9);
	// No compression
	data.writeUInt8(0, 10);
	// No filter
	data.writeUInt8(0, 11);
	// No interlacing
	data.writeUInt8(0, 12);

	return createChunk('IHDR', data);
}

/**
 * Create the IDAT chunk.
 *
 * @param data
 * @returns {Buffer}
 */
function createIDATChunk(data) {
	return createChunk('IDAT', data);
}

/**
 * Create the IEND chunk.
 *
 * @returns {Buffer}
 */
function createIENDChunk() {
	return createChunk('IEND');
}

/**
 * Create a png from the given pixel data.
 *
 * @param pixelData
 * @returns {Promise<Buffer>}
 */
function createPng(pixelData) {
	const length = pixelData.length + 4 - (pixelData.length % 4);
	const pixels = Math.ceil(length / 4);
	const width = Math.min(pixels, MAX_WIDTH);
	const height = Math.ceil(pixels / MAX_WIDTH);
	const bytesPerRow = width * 4;
	const buffer$$1 = buffer.Buffer.alloc((bytesPerRow + 1) * height);

	// Write pixel data to buffer
	for (let y = 0; y < height; y += 1) {
		const offset = y * bytesPerRow;
		const rowData = pixelData.slice(offset, offset + bytesPerRow);
		const rowStartX = offset + y + 1;
		const rowEndX = rowStartX + bytesPerRow;

		buffer$$1.writeUInt8(0, offset + y);
		buffer$$1.fill(rowData, rowStartX, rowEndX);
	}

	return new Promise((resolve, reject) => {
		zlib.deflate(buffer$$1, (error, deflated) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(buffer.Buffer.concat([
				PNG_HEADER,
				createIHDRChunk(width, height),
				createIDATChunk(deflated),
				createIENDChunk(),
			]));
		});
	});
}

/**
 * Prepend length to the data.
 *
 * @param data
 * @returns {Buffer}
 */
function prependLength(data) {
	const lengthAsBytes = buffer.Buffer.alloc(4);

	lengthAsBytes.writeUInt32BE(data.length);

	return buffer.Buffer.concat([lengthAsBytes, data]);
}

/**
 * Encode the given data to png.
 *
 * @param {string} data
 * @returns {Promise<Buffer>}
 */
function encode(data) {
	const bytes = buffer.Buffer.from(data, 'utf8');
	const pixelData = prependLength(bytes);

	return createPng(pixelData);
}

exports.encode = encode;
