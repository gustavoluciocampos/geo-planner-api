import mongoose from 'mongoose';
import config from '../../config';
import { logger } from '../log';
const log = logger(module);

mongoose.connect(config.get('mongoose:uri'));

const db = mongoose.connection;

db.on('error', function (err) {
    log.error('Connection error:', err.message);
});

db.once('open', function callback() {
    log.info('Connected to DB!');
});


mongoose.set('debug', true);

module.exports = mongoose;
