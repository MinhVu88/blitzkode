import path from 'path';
import { Command } from 'commander';
import { serve } from '@blitzkode/api';

const productionMode = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
  .command('serve [fileName]')
  .description('open & edit a file')
  .option(
    '-p, --port <number>',
    'a port on which a server runs',
    '4000'
  )
  .action(async(
    fileName = 'blitzkode.js', 
    options: {port: string}
  ) => {
    try {
      const currentDir = path.join(
        process.cwd(), 
        path.dirname(fileName)
      );

      const currentFile = path.basename(fileName);

      console.log(
        `cli | commands | serve.ts => 
        * process.cwd() -> ${process.cwd()}  
        * path.dirname(fileName) -> ${path.dirname(fileName)}  
        * path.basename(fileName) -> ${path.basename(fileName)} 
        * currentDir -> ${currentDir}`
      );

      /*
        - if the app's in prod env & productionMode is true, that value will be switched
          to false, so that devMode in api/src/index.ts is false
      */
      await serve(
        parseInt(options.port), 
        currentFile, 
        currentDir,
        !productionMode
      );

      console.log(`\n${currentFile} opened. Go to http://localhost:${options.port} to edit the file.`);
    }catch(error: any) {
      if(error.code === 'EADDRINUSE') {
        console.error('\nError -> port',options.port,'is in use. Try another one');
      }else {
        console.log('\nError ->',error.message);
      }

      process.exit(1);
    }
  });