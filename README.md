[![Build Status](https://travis-ci.org/BlueT/express-pwnd-pw.svg?branch=master)](https://travis-ci.org/BlueT/express-pwnd-pw) 
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=BlueT_express-pwnd-pw&metric=alert_status)](https://sonarcloud.io/dashboard?id=BlueT_express-pwnd-pw)
[![Open Source Helpers](https://www.codetriage.com/bluet/express-pwnd-pw/badges/users.svg)](https://www.codetriage.com/bluet/express-pwnd-pw)  
[![npm version](https://img.shields.io/npm/v/express-pwnd-pw.svg)](https://www.npmjs.org/package/express-pwnd-pw)
[![install size](https://packagephobia.now.sh/badge?p=express-pwnd-pw)](https://packagephobia.now.sh/result?p=express-pwnd-pw)
[![npm downloads](https://img.shields.io/npm/dm/express-pwnd-pw.svg)](http://npm-stat.com/charts.html?package=express-pwnd-pw)
[![GitHub license](https://img.shields.io/github/license/BlueT/express-pwnd-pw.svg)](https://github.com/BlueT/express-pwnd-pw/blob/master/LICENSE)

# express-pwnd-pw

Express.js security middleware for checking user password safety with Have I Been Pwned (HIBP) API.

## INSTALL

`npm i express-pwnd-pw`

Or find help from:
- https://www.npmjs.com/package/express-pwnd-pw
- https://github.com/BlueT/express-pwnd-pw

## SYNOPSIS

~~~~ js
"use strict";
var express = require('express');
var app = express();
var pwndPw = require('express-pwnd-pw');

app.use(pwndPw());	// use default settings

app.post('/foo', function (req, res) {
	if (Object.keys(req.pwndPw) > 0) {
		// It's a popular password! (rock)
	}
	res.send('Hello World!');
});

app.get('/bar', function (req, res) {
	// ...
	let vuln = pwndPw.password('12345');
	if (Object.keys(vuln) > 0) {
		// It's a popular password! (rock)
	}
})

app.listen(3000);
~~~~


## Middleware

~~~~ js
"use strict";
var express = require('express');
var app = express();
var pwndPw = require('express-pwnd-pw');

app.use(pwndPw());	// use default settings

app.post('/foo', function (req, res) {
	if (Object.keys(req.pwndPw) > 0) {
		// It's a popular password! (rock)
		// { '8cb2237d0679ca88db6464eac60da96345513964': 2333232 }
	}
	res.send('Hello World!');
});

app.listen(3000);
~~~~

## Helper Functions

### password()

~~~~ js
var pwndPw = require('express-pwnd-pw');

let vuln = pwndPw.password(['12345', '67890']);
if (Object.keys(vuln) > 0) {
	// It's a popular password! (rock)
	// {
	// 	'8cb2237d0679ca88db6464eac60da96345513964': 2333232,
	// 	'230991abcd77e8173edb0af392e1f11120051e29': 6638
	// }
}

~~~~


## Contribute

PRs welcome!  
If you use/like this module, please don't hesitate to give me a **Star**. I'll be happy whole day!

_Hope this module can save your time, a tree, and a kitten._
