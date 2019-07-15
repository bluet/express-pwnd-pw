const test = require('tape');
var appRoot = require('app-root-path');
const pwndPw = require(appRoot + '/index.js');
const httpMocks = require('node-mocks-http');


test('pwnd-pw testing password 12345 should have matches', async (assert) => {
	const req = httpMocks.createRequest({ 
		params: { password: '12345' },
		body: {passwd: '67890'},
		query: {pw: '5e9795e3f3ab55e7790a6283507c085db0d764fc'}
	});
	const res = httpMocks.createResponse();
	
	await pwndPw()(req, res, () => {
		// console.dir(req.pwndPw);
		assert.true(req.pwndPw);
		assert.true(req.pwndPw['8cb2237d0679ca88db6464eac60da96345513964']);
		assert.true(parseInt(req.pwndPw['8cb2237d0679ca88db6464eac60da96345513964']) >= 2333232);
		assert.true(req.pwndPw['230991abcd77e8173edb0af392e1f11120051e29']);
		assert.true(parseInt(req.pwndPw['230991abcd77e8173edb0af392e1f11120051e29']) >= 6638);
		Promise.resolve(req.pwndPw);
	});
	assert.end();
});
