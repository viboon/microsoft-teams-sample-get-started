const fs = require('fs-extra');
const authHelper = require('./authHelper.js');
const requestUtil = require('./requestUtil.js');

var server;

function start_listening() {
 
    this.server.get('login', (req, res, next) => {
		if (req.query.code !== undefined) {
			authHelper.getTokenFromCode(req.query.code, function (e, accessToken, refreshToken) {
				if (e === null) {
					// cache the refresh token in a cookie and go to page configured in 'state' param
					res.setCookie(authHelper.ACCESS_TOKEN_CACHE_KEY, accessToken);
					res.setCookie(authHelper.REFRESH_TOKEN_CACHE_KEY, refreshToken);
					res.redirect(req.params.state, next);
				} else {
					console.log(JSON.parse(e.data).error_description);
					res.status(500);
					res.send();
				}
			});
		}
		else
		{
    		sendFile('./auth/login.html', res);
		}
	});

    this.server.get('loginresult', (req, res, next) => {
   		sendFile('./auth/loginresult.html', res);
	});

	this.server.get('/disconnect', function (req, res, next) {
		// check for token
		res.clearCookie('nodecookie');
		requestUtil.clearCookies(res);
		res.status(200);
		res.redirect('/login', next);
	});

	this.server.get('auth/url', (req, res, next) => {
		var ret = { authUrl: authHelper.getAuthUrl() };
		res.send(ret);
		res.end();
	});

	this.server.get(/^\/graph/, (req, res, next) => {
		console.log(req.url);
		if (req.cookies.REFRESH_TOKEN_CACHE_KEY === undefined) {
			res.redirect('/login', next);
		} else {
			var url = '/stagingbeta' + req.url.substring('/graph'.length);
			requestUtil.executeRequestWithErrorHandling(req, res, 'GET', url, null, (data) => {
				res.send(data);
				res.end();
			});
		}
	});

	this.server.post(/^\/graph/, (req, res, next) => {
		console.log(req.url);
		if (req.cookies.REFRESH_TOKEN_CACHE_KEY === undefined) {
			res.redirect('/login', next);
		} else {
			var url = '/stagingbeta' + req.url.substring('/graph'.length);
			console.log(url);
			console.log(req.body);
			requestUtil.executeRequestWithErrorHandling(req, res, 'POST', url, req.body, (data) => {
				res.send(data);
				res.end();
			});
		}
	});

}

function sendFile(path, res){
	var data = fs.readFileSync(path, 'utf-8');
	res.writeHead(200, {
		'Content-Length': Buffer.byteLength(data),
  		'Content-Type': 'text/html'
	});

	res.write(data);
	res.end();
}

module.exports.init = function(server) {
	this.server = server;
	return this;
}

module.exports.start_listening = start_listening;