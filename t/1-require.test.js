const test = require('tape');
var appRoot = require('app-root-path');
const pwndPw = require(appRoot + '/index.js');


test('require and initial (default options)', async (assert) => {
	assert.assert(pwndPw);
	assert.true(typeof pwndPw === 'function');
	let pwndPwModule = pwndPw();
	assert.assert(pwndPwModule);
	assert.true(typeof pwndPwModule === 'function');
	assert.end();
});

test('require and initial (string)', async (assert) => {
	let pwndPwModule = pwndPw('password');
	assert.assert(pwndPwModule);
	assert.true(typeof pwndPwModule === 'function');
	assert.end();
});

test('require and initial (array)', async (assert) => {
	let pwndPwModule = pwndPw(['password', 'pw']);
	assert.assert(pwndPwModule);
	assert.true(typeof pwndPwModule === 'function');
	assert.end();
});

test('require and initial (object: watchKey)', async (assert) => {
	let pwndPwModule = pwndPw({ 'watchKey': ['password', 'pw'] });
	assert.assert(pwndPwModule);
	assert.true(typeof pwndPwModule === 'function');
	assert.end();
});

test('require and initial (object: watchIn)', async (assert) => {
	let pwndPwModule = pwndPw({ 'watchIn': ['params'] });
	assert.assert(pwndPwModule);
	assert.true(typeof pwndPwModule === 'function');
	assert.end();
});

test('require and initial (object: watchKey + watchIn)', async (assert) => {
	let pwndPwModule = pwndPw({ 'watchKey': ['password', 'pw'], 'watchIn': ['params', 'body'] });
	assert.assert(pwndPwModule);
	assert.true(typeof pwndPwModule === 'function');
	assert.end();
});
