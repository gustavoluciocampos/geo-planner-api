import passport from 'passport';

const express = require('express');
const router = express.Router();
const service = process.cwd() + '/src/service/';
const locationsService = require(service + 'locationsService');

router.post('/locations', passport.authenticate('bearer', { session: false }),
  function (req, res) {
    const locationsData = locationsService.mapLocationsData(req.body.locations);
    //locationsService.updateLocations(locationsData);
    res.json({
        locations: locationsData,
    });
  }
);

router.get('/locations', passport.authenticate('bearer', { session: false }),
  async function (req, res) {
    res.json({
        locations: await locationsService.receiveLocations(req.query.groupId),
    });
  }
);

router.get('/locations/center', passport.authenticate('bearer', { session: false }),
  async function (req, res) {
    const { dc_info, error } =
      await locationsService.receiveDcLocation(req.query.groupId);
    res.json({ dc_info, error });
  }
);

module.exports = router;
