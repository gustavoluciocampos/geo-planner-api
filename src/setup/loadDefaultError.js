import {
    logger
} from '../libs/log';
const log = logger(module);
export default function (server) {

    // Catch 404 and forward to error handler
    server.use(function (req, res, next) {
        res.status(404);
        log.debug('%s %d %s', req.method, res.statusCode, req.url);
        res.json({
            error: '404, Not found'
        });
        return;
    });

    // Error handlers
    server.use(function (err, req, res, next) {
        res.status(err.status || 500);
        log.error('%s %d %s', req.method, res.statusCode, err.message);
        res.json({
            error: err.message
        });
        return;
    });
}