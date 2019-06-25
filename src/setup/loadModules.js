// Imports
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import passport from 'passport';
import { logger } from '../libs/log';
const log = logger(module);


// Load express modules
export default function(server) {
    log.debug('SETUP - Loading modules...');

    // Enable CORS
    server.use(cors())

    // Request body parser
    server.use(bodyParser.json({limit: '20mb'}));
    server.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

    // Request body cookie parser
    server.use(cookieParser())

    // HTTP logger
    server.use(morgan('tiny'))

    //Passaport Use midware
    server.use(passport.initialize());
}
