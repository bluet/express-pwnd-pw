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
module.exports.password = checkPassword;


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
	} else if (Array.isArray(options)) {
		watchKey = new Set(options);
	} else if (typeof options === 'object') {
		watchKey = new Set(options['watchKey']);
		watchIn = new Set(options['watchIn']);
	}

	watchKey = watchKey.size > 0 ? watchKey : new Set(['password', 'passwd', 'pw']);
	watchIn = watchIn.size > 0 ? watchIn : new Set(['params', 'body', 'query']);


	return async function (req, res, next) {
		let passwords = new Set();
		let result = {};

		req.pwndPwKeys = Object.create(watchKey);
		req.pwndPwIn = Object.create(watchIn);

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

		result = await checkPassword(passwords);
		Object.defineProperty(req, 'pwndPw', {
			get: () => { return result; }
		});
		
		next();
	};
}


/**
 * Create password() helper.
 *
 * @param {string|array} [passwords] Password(s) to check
 * @return {object} Object of hash:count
 * @public
 */

async function checkPassword (passwords) {
	let result = {};

	if (typeof passwords === 'string') {
		passwords = [passwords];
	}
	let matches = await Promise.all([...passwords].map(async (pw) => {
		let shasum = crypto.createHash('sha1').update(pw).digest('hex').toLowerCase();
		let shasum_first = shasum.substring(0, 5);
		let shasum_rest = shasum.substring(5);
		let response = await axios.get('https://api.pwnedpasswords.com/range/' + shasum_first);

		let hashes = response.data.split(/\r?\n/).filter((str) => {
			let [rest_str, count] = str.toLowerCase().split(':');
			if (rest_str === shasum_rest) {
				return({[rest_str]: parseInt(count)});
			}
		});

		if (hashes.length > 0) {
			let count = parseInt(hashes[0].split(':')[1]);
			hashes = {[shasum]: count};
		}

		return Promise.resolve(hashes);
	}));

	matches.forEach((item) => {
		Object.assign(result, item);
	});

	return result;
}
