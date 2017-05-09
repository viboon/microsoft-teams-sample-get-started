import * as express from 'express';
import crypto = require('crypto');
import { FbProvider } from '../queryProvider/fbProvider';
let userStore = require('../util/userStore');
let config = require('../config.json');

function randomValueBase64(len: number) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

export class AuthRoute {
    private router: express.Router;

    public static createRouter(): express.Router {
        let router: express.Router;
        router = express.Router();
        let authRoute = new AuthRoute(router);
        authRoute.config();
        return router;
    }

    constructor(router: express.Router) {
        this.router = router;
    }

    public config() {
        // Auth start page - it will render the page that includes team SDK to call getContext() to get a context object
        // This is to demonstrate how to retrieve context info like team id and channnel id
        // Then it will redirect to start OAuth.
        this.router.get('/start/:userId', this.onStartAuth);

        // Start OAuth - contruct OAuth url and redirect
        this.router.get('/oauth/:userId/:teamId/:channelId', this.onOAuth);

        // OAuth callback handler - mark user/token pair to be verified, genereate auth code, and redirect to notify success/failure
        this.router.get('/callback/:userId', this.onAuthCallback);
    }

    private onStartAuth(req: express.Request, res: express.Response) {
        if (req.params && req.params.userId) {
            res.render('startAuth', { userId: req.params.userId, host: config.host });
        } else {
            // Redirect to notify error
            console.error('Missing user id in /auth/start request');
            res.render('authResult', { succeeded: false });
        }
    }

    private onOAuth(req: express.Request, res: express.Response) {
        if (req.params && req.params.userId) {
            if (userStore.isUserAuthenticated(req.params.userId)) {
                // Redirect to notify success, since user is already authenticated
                res.render('authResult', { succeeded: true, authCode: '' });
            } else {
                FbProvider.startOAuth(req.params.userId, res);
            }

        } else {
            // Redirect to notify failure
            console.error('Missing user id in /auth/oauth request');
            res.render('authResult', { succeeded: false });
        }
    }

    private onAuthCallback(req: express.Request, res: express.Response) {
        if (req.params && req.params.userId) {
            if (req.query && req.query.code) {
                FbProvider.retrieveAccessToken(req.query.code, req.params.userId, (err: any, facebookRes: any) => {
                    if (err) {
                        console.error('Failed to retrieve accessToken: ' + err);
                    } else {
                        // Generate auth code
                        let authCode = randomValueBase64(16);
                        userStore.queueTokenToVerify(req.params.userId, facebookRes.access_token, authCode);

                        // Redirect to notify success
                        res.render('authResult', { succeeded: true, authCode: authCode });
                    }
                });
            } else {
                // Redirect to notify failure
                console.error('Missing code in facebook OAtuh callback');
                res.render('authResult', { succeeded: false });
            }
        } else {
            // Redirect to notify failure
            console.error('Missing user id in facebook OAtuh callback');
            res.render('authResult', { succeeded: false });
        }
    }
}