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

  server.use(setCellsRouter(fileName, dir)); 

  if (devMode) {
    server.use(createProxyMiddleware({
      target: 'http://localhost:3000',
      ws: true,
      logLevel: 'silent'
    }));
  } else {
    const clientBuildPath = require.resolve('@blitzkode/client/build/index.html');

    server.use(express.static(path.dirname(clientBuildPath)));
  }

  return new Promise<void>((resolve, reject) => {
    server.listen(port, resolve).on('error', reject);
  });
};