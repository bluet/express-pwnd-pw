/*!
 * express-pwnd-pw
 * Copyright(c) 2019 BlueT - Matthew Lien - 練喆明
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

const crypto = require('crypto');
const axios = require('axios');

/**
 * Module exports.
 * @public
 */

module.exports = createPwndPw;


/**
 * Create a new pwnd-pw middleware.
 *
 * @param {string|array|object} [options]
 * @param {array} [options.watchKey=['password', 'passwd', 'pw']] Names of the keys to check
 * @param {array} [options.watchIn=['params', 'body', 'query']] Names of the components to check
 * @return {function} middleware
 * @public
 */

function createPwndPw (options) {
	let watchKey = new Set();
	let watchIn = new Set();

	// console.dir(options);
	if (typeof options === 'string') {
		// console.log('String');
		watchKey = new Set([options]);
	} else if (Array.isArray(options)) {
		// console.log('Array');
		watchKey = new Set(options);
	} else if (typeof options === 'object') {
		// console.log('Object');
		watchKey = new Set(options['watchKey']);
		watchIn = new Set(options['watchIn']);
	}

	// console.dir(watchKey);
	watchKey = watchKey.size > 0 ? watchKey : new Set(['password', 'passwd', 'pw']);
	watchIn = watchIn.size > 0 ? watchIn : new Set(['params', 'body', 'query']);

	// if ( !(watchKey instanceof Set) || watchKey.size <= 0) {
	// 	throw Error("Invalid key name for express-pwnd-pw");
	// }

	// if ( !(watchIn instanceof Set) || watchKey.size <= 0) {
	// 	watchIn = new Set(['params', 'body', 'query']);
	// }

	return async function (req, res, next) {
		let passwords = new Set();
		// let matches;
		let result = {};

		// console.dir(watchKey);
		// console.dir(watchIn);

		// to pass to Session()
		req.pwndPwKeys = Object.create(watchKey);
		req.pwndPwIn = Object.create(watchIn);

		// console.dir(req.params);

		watchKey.forEach(element => {
			if (watchIn.has('params') && Object.keys(req.params).includes(element)) {
				passwords.add(req.params[element]);
			}
			if (watchIn.has('body') && Object.keys(req.body).includes(element)) {
				passwords.add(req.body[element]);
			}
			if (watchIn.has('query') && Object.keys(req.query).includes(element)) {
				passwords.add(req.query[element]);
			}
		});


		// console.dir([...passwords]);

		await Promise.all([...passwords].map(async (pw) => {
			let shasum = crypto.createHash('sha1').update(pw).digest('hex').toLowerCase();
			let shasum_first = shasum.substring(0, 5);
			let shasum_rest = shasum.substring(5);
			let response = await axios.get('https://api.pwnedpasswords.com/range/' + shasum_first);
			let hashes = response.data.split(/\r?\n/);
			// console.dir(hashes);
			hashes.filter((str) => {
				let [rest_str, count] = str.split(':');
				if (rest_str.toLowerCase() === shasum_rest) {
					result[shasum] = parseInt(count);
				}
			});
			return Promise.resolve();
		}));

		// matches.forEach((pair) => { Object.assign(result, pair) });
		// matches = matches.filter(times => typeof(times) !== 'undefined');

		// define req.session getter / setter
		Object.defineProperty(req, 'pwndPw', {
			get: () => { return result; }
		});
		
		// Implement the middleware function based on the options object
		next();
	};
}
