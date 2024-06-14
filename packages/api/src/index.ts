import path from 'path';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { setCellsRouter } from './routes/cells';

export const serve = (
  port: number, 
  fileName: string, 
  dir: string,
  devMode: boolean
) => {
  const server = express();

  server.use(express.json());

  // why is this middleware placed here? -> vid 296
  server.use(setCellsRouter(fileName, dir)); 

  // the 2 execution environments in which the React assets can be served up:
  if (devMode) {
    // dev mode: the create-react-app server's running
    server.use(createProxyMiddleware({
      target: 'http://localhost:3000',
      ws: true,
      logLevel: 'silent'
    }));
  } else {
    // production mode: cli is installed in a user's local machine
    const clientBuildPath = require.resolve('@blitzkode/client/build/index.html');

    server.use(express.static(path.dirname(clientBuildPath)));
  }

  return new Promise<void>((resolve, reject) => {
    server.listen(port, resolve).on('error', reject);
  });
};