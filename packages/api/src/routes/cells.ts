import { promises as fs } from 'fs';
import path from 'path';
import express from 'express';

interface Cell {
  id: string;
  type: 'code' | 'text';
  content: string;
}

export const setCellsRouter = (fileName: string, dir: string) => {
  const router = express.Router();

  const fullFilePath = path.join(dir, fileName);

  router.get('/cells', async(req, res) => {
    try {
      const cells = await fs.readFile(fullFilePath, {encoding: 'utf-8'});

      res.send(JSON.parse(cells));
    } catch (error: any) {
      if(error.code === 'ENOENT') {
        await fs.writeFile(fullFilePath, '[]', 'utf-8');

        res.send([]);
      }else {
        throw error;
      }
    }
  });

  router.post('/cells', async(req, res) => {
    const { cells }: { cells: Cell[] } = req.body;

    await fs.writeFile(
      fullFilePath,
      JSON.stringify(cells),
      'utf-8'
    );

    res.send({status: 'ok'});
  });

  return router;
};