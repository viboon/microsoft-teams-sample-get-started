import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { IndexRoute } from './routes/index';
import { AuthRoute } from './routes/auth';
import { ComposeExtensionRoute } from './routes/composeExtension';

class Server {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    public config() {
        // view engine setup
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'jade');

        // uncomment after placing your favicon in /public
        //app.use(favicon(__dirname + '/public/favicon.ico'));
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(require('stylus').middleware(path.join(__dirname, 'public')));
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    public routes() {
        this.app.use('/', IndexRoute.createRouter());
        this.app.use('/auth', AuthRoute.createRouter());
        this.app.use('/api/composeExtension', ComposeExtensionRoute.createRouter());

        // catch 404 and forward to error handler
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            let err: any = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handlers
        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }

    public start() {
        let debug = require('debug')('composeExtensionAuth');
        this.app.set('port', process.env.PORT || 3000);

        let server = this.app.listen(this.app.get('port'), function() {
            debug('Express server listening on port ' + server.address().port);
        });

    }
}

let server = new Server();
server.start();

