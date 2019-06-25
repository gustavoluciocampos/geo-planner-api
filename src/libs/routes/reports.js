import passport from 'passport';

var express = require('express');
var router = express.Router();
var service = process.cwd() + '/src/service/';
var reportService = require(service + 'reportService');

router.post('/reports/generate', passport.authenticate('bearer', { session: false }),
  async function (req, res) {
    const rawDeliveries = reportService.mergeInfos(req.body.orders, req.body.locations);
    const deliveries = await reportService.generateDeliveryData(rawDeliveries, 1);
    const metrics = reportService.generateDeliveryReport(rawDeliveries);
    reportService.saveDeliveryReport(deliveries, metrics);
    res.json({
        deliveries,
        deliveryReport: metrics,
    });
  }
);

module.exports = router;
