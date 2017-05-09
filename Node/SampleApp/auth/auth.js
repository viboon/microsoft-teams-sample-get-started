/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
const authHelper = require('./authHelper.js');
const files = require('../utils/files.js');

var server;

function start_listening() {
 
    this.server.get('login', (req, res, next) => {
		if (req.query.code !== undefined) {
			authHelper.getTokenFromCode(req.query.code, function (e, accessToken, refreshToken) {
				if (e === null) {
					// Cache the access and refresh token in a cookie for simplicity.
					// DON'T DO THIS IN A PRODUCTION APP.
					res.setCookie(authHelper.ACCESS_TOKEN_CACHE_KEY, accessToken);
					res.setCookie(authHelper.REFRESH_TOKEN_CACHE_KEY, refreshToken);
					// Now we're signed in, go to the originally requested page, as configured in 'state' param.
					res.redirect(req.params.state, next);
				} else {
					res.status(500);
					res.send();
				}
			});
		}
		else
		{
    		files.sendFile('./auth/login.html', res);
		}
	});

    this.server.get('loginresult', (req, res, next) => {
   		files.sendFile('./auth/loginresult.html', res);
	});

	this.server.get('disconnect', function (req, res, next) {
		res.clearCookie('nodecookie');
		authHelper.clearCookies(res);
		res.status(200);
		res.redirect('/login', next);
	});

	this.server.get('api/authurl', (req, res, next) => {
		// Get the authentication login URL for use client side.
		var ret = { authUrl: authHelper.getAuthUrl() };
		res.send(ret);
		res.end();
	});

	this.server.get('api/temp', (req, res, next) => {
		// Get the authentication login URL for use client side.
		var ret = { clientSecret: process.env.ClientSecret,
			clientSecret2: process.env.APPSETTING_ClientSecret,
			host: process.env.WEBSITE_HOSTNAME,
			host2: process.env.host
		 };
		res.send(ret);
		res.end();
	});

}

module.exports.init = function(server) {
	this.server = server;
	return this;
}

module.exports.start_listening = start_listening;