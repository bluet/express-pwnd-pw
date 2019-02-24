const test = require('tape');
var appRoot = require('app-root-path');
const pwndPw = require(appRoot + '/index.js');


test('test password("12345")', async (assert) => {
	let result = await pwndPw.password('12345');
	// console.dir(result);
	assert.true(result);
	assert.true(result['8cb2237d0679ca88db6464eac60da96345513964']);
	assert.true(parseInt(result['8cb2237d0679ca88db6464eac60da96345513964']) >= 2333232);
	assert.end();
});

test('test password(["12345", "67890", "5e9795e3f3ab55e7790a6283507c085db0d764fc"])', async (assert) => {
	let result = await pwndPw.password(['12345', '67890', '5e9795e3f3ab55e7790a6283507c085db0d764fc']);
	// console.dir(result);
	assert.true(result);
	assert.true(Object.keys(result).length === 2);
	assert.true(result['8cb2237d0679ca88db6464eac60da96345513964']);
	assert.true(parseInt(result['8cb2237d0679ca88db6464eac60da96345513964']) >= 2333232);
	assert.true(result['8cb2237d0679ca88db6464eac60da96345513964']);
	assert.true(parseInt(result['230991abcd77e8173edb0af392e1f11120051e29']) >= 6638);
	assert.false(result['5e9795e3f3ab55e7790a6283507c085db0d764fc']);
	assert.end();
});
