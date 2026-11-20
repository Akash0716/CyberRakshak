import serverless from 'serverless-http';
import { app, initAppDB } from '../../server/src/app.js';

let serverlessHandler: any = null;

export const handler = async (event: any, context: any) => {
  // Ensure the database & in-memory seeds are initialized on cold start
  if (!serverlessHandler) {
    await initAppDB();
    serverlessHandler = serverless(app);
  }
  return serverlessHandler(event, context);
};
