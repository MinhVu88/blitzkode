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

  /* get a list of cells from a file & render it in the browser
    - Check if the file exists by 1st trying reading it 
    - If reading it throws an error, it probably hasn't been created
    - It'll then be created along with default cells in it for user
    - Read the file & parse the cells out of it
    - Render the cells onto browser
  */
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

  /* write an updated list of cells to a file
    - Get a list of cells from the request object
    - Turn it into a format that can be safely written to the file
  */
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