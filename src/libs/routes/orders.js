import passport from 'passport';

const express = require('express');
const router = express.Router();
const service = process.cwd() + '/src/service/';
const ordersService = require(service + 'ordersService');

router.post('/orders/import', passport.authenticate('bearer', { session: false }),
  function (req, res) {
    res.json({
        orders: ordersService.mapOrdersData(req.body.orders),
    });
  }
);

module.exports = router;
