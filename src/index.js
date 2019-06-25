// Imports
import express from 'express'

// App Imports
import setupModules from './setup/loadModules';
import setupRoutes from './setup/loadRoutes';
import setupDefaultError from './setup/loadDefaultError';
import config from './config';
import { logger } from '../src/libs/log';
const log = logger(module);

// Create express server
const server = express();

//load Morgan, CORS, passaport
setupModules(server);

//load default error
setupRoutes(server);

//load default error
setupDefaultError(server);
server.set('port', process.env.PORT || config.get('port') || 3000);

server.listen(server.get('port'), function () {
  log.info('Express server listening on port ' + server.get('port'));
});
