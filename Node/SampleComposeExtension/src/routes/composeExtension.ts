import * as express from 'express';
import builder = require('botbuilder');
import teamBuilder = require('botbuilder-teams');
import { FbProvider } from '../queryProvider/fbProvider';
let userStore = require('../util/userStore');
let config = require('../config.json');

export class ComposeExtensionRoute {
    private router: express.Router;

    public static createRouter(): express.Router {
        let router: express.Router;
        router = express.Router();
        let composeExtensionRoute = new ComposeExtensionRoute(router);
        composeExtensionRoute.config();
        return router;
    }

    constructor(router: express.Router) {
        this.router = router;
    }

    public config(): void {
        let connector = new teamBuilder.TeamsChatConnector({
            appId: config.app_id,
            appPassword: config.app_password
        });

        // Register for commmand handler by commandId, which is defined in app manifest
        connector.onQuery('insertFbEvent', this.commandHandler.bind(this));
        this.router.post('/', connector.listen());
    }

    private commandHandler(
        event: builder.IEvent,
        query: teamBuilder.ComposeExtensionQuery,
        callback: (err: Error, result: teamBuilder.IComposeExtensionResponse, statusCode: number) => void) {
        let userId = event.address.user.id;
        if (!userId) {
            console.error("userId missing in invoke");
            callback(null, {}, 500);
        }

        // Check if need to auth
        let skipAuth: boolean;
        if (query.authenticationCode) {
            skipAuth = userStore.verifyUserToken(userId, query.authenticationCode);
        } else {
            skipAuth = userStore.isUserAuthenticated(userId);
        }

        if (!skipAuth) {
            callback(null, this.getAuthResponse(userId), 200);
        } else {
            // Default query keyword
            var keyword = 'event';

            // Check if this is initialRun, where user hasn't typed any search keyword
            if (query.parameters[0].name !== 'initialRun') {
                keyword = query.parameters[0].value;
            }

            // Call FB graph API
            FbProvider.search(keyword, userStore.getUserToken(userId), query.queryOptions, (err: any, fbRes: any) => {
                if (err) {
                    console.log(err);
                    // Need to renew access token
                    if (err.type === 'OAuthException' && err.code == 190) {
                        userStore.revokeUserToken(userId);
                        callback(null, this.getAuthResponse(userId), 200);
                    } else {
                        callback(null, err, 500);
                    }
                } else {
                    // Constrcut response
                    let attachments: teamBuilder.ComposeExtensionAttachment[] = [];
                    fbRes.data.forEach((result: any) => {
                        let card = new builder.ThumbnailCard()
                            .title('<a href="' + 'https://www.facebook.com/events/' + result.id + '" target="_blank">' + result.name + '</a>')
                            .images([new builder.CardImage().url(result.cover ? result.cover.source : 'http://www.racedepartment.com/images/rd_calext/calendar.png')]);
                        if (result.description) {
                            card = card.text(result.description.length < 100 ? result.description : result.description.substring(0, 200) + '...');
                        }
                        if (result.ticket_uri) {
                            card = card.buttons([
                                {
                                    type: "openUrl",
                                    title: "Buy tickets",
                                    value: result.ticket_uri
                                }
                            ]);
                        }
                        attachments.push(card.toAttachment());
                    });
                    let response = teamBuilder.ComposeExtensionResponse.result("list").attachments(attachments);
                    callback(null, response.toResponse(), 200);
                }
            });
        }
    }

    private getAuthResponse(userId: string) {
        return teamBuilder.ComposeExtensionResponse.auth().actions([
            builder.CardAction.openUrl(null, config.host + '/' + config.auth_uri + userId, "Please sign in Facebook")
        ]).toResponse();
    }
}