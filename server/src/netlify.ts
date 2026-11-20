import serverless from 'serverless-http';
import { app, initAppDB } from './app.js';

let serverlessHandler: any = null;

export const handler = async (event: any, context: any) => {
  if (!serverlessHandler) {
    await initAppDB();
    serverlessHandler = serverless(app);
  }
  return serverlessHandler(event, context);
};
