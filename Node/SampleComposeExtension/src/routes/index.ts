import * as express from 'express';

export class IndexRoute {
  private router: express.Router;

  public static createRouter(): express.Router {
    let router: express.Router;
    router = express.Router();
    let indexRoute = new IndexRoute(router);
    indexRoute.config();
    return router;
  }

  constructor(router: express.Router) {
    this.router = router;
  }

  public config(): void {
    /* GET home page. */
    this.router.get('/', (req: express.Request, res: express.Response) => {
      res.render('index', { title: 'Compose Extension Authentication Sample' });
    });
  }
}