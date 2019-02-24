const test = require('tape');
const httpMocks = require('node-mocks-http');
var appRoot = require('app-root-path');

const pwndPw = require(appRoot + '/index.js');

// test('verifyToken resolves with a success message', (assert) => {
// 	const req = httpMocks.createRequest({ 
// 		cookies: { token: 'blablabla' }
// 	});
// 	const res = httpMocks.createResponse();

// 	return verifyToken(req, res).then((response) => {
// 		...
// 		assert.equal(typeof response.message, 'string');
// 		...
// 	});
// });

test('pwnd-pw testing password 12345 should have matches', (assert) => {
	const req = httpMocks.createRequest({ 
		params: { password: '12345' }
	});
	const res = httpMocks.createResponse();
	return pwndPw()(req, res, () => {
		// console.dir(response);
		// console.dir(req.pwndPw);
		assert.true(req.pwndPw);
		// assert.equal(Array.isArray(response.things), 'true');
		assert.end();
	});
});