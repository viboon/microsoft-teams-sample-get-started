import { Response } from 'express';
let graph = require('fbgraph');
let userStore = require('../util/userStore');
let config = require('../config.json');

export class FbProvider {
    public static startOAuth(userId: string, res: Response) {
        let authUrl = graph.getOauthUrl({
            "client_id": config.client_id,
            "redirect_uri": config.host + '/' + config.redirect_uri + '/' + userId,
            "scope": config.scope
        });
        res.redirect(authUrl);
    }

    public static retrieveAccessToken(code: string, userId: string, callback: any) {
        graph.authorize({
            "client_id": config.client_id,
            "redirect_uri": config.host + '/' + config.redirect_uri + '/' + userId,
            "client_secret": config.client_secret,
            "code": code
        }, (err: any, res: Response) => {
            callback(err, res);
        });
    }

    public static search(keyword: string, accessToken: string, queryOptions: any, callback: any) {
            let searchOptions: any = {
                q: keyword, type: 'event', fields: 'name,description,cover,ticket_uri', access_token: accessToken
            };
            if (queryOptions) {
                searchOptions.limit = queryOptions.count;
                searchOptions.offset = queryOptions.skip;
            }
        graph.search(searchOptions, callback);
    }
}