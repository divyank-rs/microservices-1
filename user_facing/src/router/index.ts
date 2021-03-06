import { NextFunction, Request, Response, Router, Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Utils from '../utils';
import { StatusCodes } from 'http-status-codes';
import { UserRouter } from './user';

// all your route goes here
const _routes: [string, Router][] = [['/user', UserRouter]];

// export configured routes
export const routes = (app: Application) => {
  app.use(bodyParser.json());
  const corsOptions: cors.CorsOptions = {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'x-api-key',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: '*',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  app.use(cors(corsOptions));

  const parentController = Router();
  // every route will go under api/v1
  app.use('/api/v1', parentController);
  _routes.forEach((route) => {
    const [url, controller] = route;
    parentController.use(url, controller);
  });
  // finally add route to catch errors
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.statusCode) {
      Utils.RespondError(res, err, err.statusCode);
      return;
    }
    Utils.RespondError(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  });
};
