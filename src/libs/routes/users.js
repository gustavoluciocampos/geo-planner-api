import passport from 'passport';
import express from 'express';
import User from '../model/user'

const RouterFactory = new require('../router-factory').RouterFactory;
var router = express.Router();

router.get('/user/info', passport.authenticate('bearer', { session: false }),
    function (req, res) {
        res.json({
            user_id: req.user.userId,
            name: req.user.username,
            scope: req.authInfo.scope
        });
    }
);

RouterFactory.create({
    router: router,
    path: "user",
    model: User,
    auth: passport.authenticate('bearer', { session: false })
});

module.exports = router;
