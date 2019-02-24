/*!
 * express-pwnd-pw
 * Copyright(c) 2019 BlueT - Matthew Lien - 練喆明
 * MIT Licensed
 */

'use strict'

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

	if (typeof options === 'string') {
		watchKey = new Set([options]);
	} else if (typeof options === 'array') {
		watchKey = new Set(options);
	} else if (typeof options === 'object') {
		watchKey = new Set(options['watchKey']);
		watchIn = new Set(options['watchIn']);
	}

	watchKey = watchKey.prototype.size > 0 ? watchKey : new Set(['password', 'passwd', 'pw']);

	if ( !(watchKey instanceof Set) || watchKey.prototype.size <= 0) {
		throw Error("Invalid key name for express-pwnd-pw");
	}

	if ( !(watchIn instanceof Set) || watchKey.prototype.size <= 0) {
		watchIn = new Set(['params', 'body', 'query']);
	}

	return async function (req, res, next) {
		let passwords = new Set();
		// let matches;
		let result = {};

		// to pass to Session()
		req.pwndPwKeys = Object.create(watchKey);
		req.pwndPwIn = Object.create(watchIn);

		watchKey.forEach(element => {
			if (watchIn.has('params') && req.params.includes(element)) {
				passwords.add(req.params[element]);
			}
			if (watchIn.has('body') && req.body.includes(element)) {
				passwords.add(req.body[element]);
			}
			if (watchIn.has('query') && req.query.includes(element)) {
				passwords.add(req.query[element]);
			}
		});

		await Promise.all(passwords.entries().map(async (pw) => {
			let shasum = crypto.createHash('sha1').update(pw);
			let shasum_first = shasum.substring(0, 5);
			let shasum_rest = shasum.substring(5);
			let response = await axios.get('https://api.pwnedpasswords.com/range/' + shasum_first);
			let [rest_str, count] = response.split(':');
			if (rest_str === shasum_rest) {
				result[shasum] = parseInt(count);
			}
			return Promise.resolve();
		}));

		// matches.forEach((pair) => { Object.assign(result, pair) });
		// matches = matches.filter(times => typeof(times) !== 'undefined');

		// define req.session getter / setter
		Object.defineProperty(req, 'pwndPw', {
			get: () => { return result }
		});
		
		// Implement the middleware function based on the options object
		next()
	}
}
