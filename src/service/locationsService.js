import Location from '../libs/model/location';
import DistributionCenter from '../libs/model/distributionCenter';
import DistanceMatrix from '../libs/model/distanceMatrix';
import { logger } from '../libs/log';

const log = logger(module);

// TODO optimize database operations
async function updateLocations(locationsData, groupId = 1) {
  if(locationsData.fileLoadError && locationsData.locationsInfo &&
      !locationsData.locationsInfo.length) {
    return;
  }
  Location.deleteMany({ group_id: groupId }, function (err) {
    if (err) {
      log.error(err);
    } else {
      locationsData.locationsInfo.forEach((location) => {
        const locationModel = new Location(location);
        locationModel.save(function (err) {
          if (err) {
            log.error(err);
          }
        });
      });
    }
  });
  const { status } = await createDistanceMatrix(groupId, locationsData);
}

function mapLocationsData(locationsData) {
  const detailedLocationInfo = {};
  try {
    detailedLocationInfo.locationsInfo = locationsData.map((item) => {
      return {
        'group_id': 1,
        'customer_id': parseInt(item['Nome'].slice(0,7), 10),
        'customer_name': item['Nome'],
        'address': item['Endere�o'],
        'neighborhood': item['Bairro'],
        'city': item['Cidade'],
        'lat': parseFloat(item['Latitude'].toString().replace(",",".")),
        'lng': parseFloat(item['Longitude'].toString().replace(",",".")),
        'sealed': item['PDV Lacrado'],
      };
    });
    detailedLocationInfo.fileLoadError = false;
  } catch(err) {
    detailedLocationInfo.fileLoadError = true;
  } finally {
    return detailedLocationInfo;
  }
}

async function receiveDcLocation(groupId) {
  const dcInfo = {};
  try {
    const docs = await DistributionCenter.findOne({ group_id: groupId }).exec();
    dcInfo.data = docs;
    dcInfo.error = false;
  } catch(e) {
    log.error(e);
    dcInfo.data = {};
    dcInfo.error = true;
  } finally {
    return { dc_info: dcInfo.data, error: dcInfo.error };
  }
}

async function receiveLocations(groupId) {
  const locationInfo = {};
  try {
    const { ...docs } = await Location.find({ group_id: groupId }).exec();
    locationInfo.records = docs;
    locationInfo.error = false;
  } catch(e) {
    log.error(e);
    locationInfo.records = {};
    locationInfo.error = true;
  } finally {
    return { records: Object.values(locationInfo.records), error: locationInfo.error };
  }
}

async function receiveDistanceMatrix(groupId, idList = []) {
  const distanceMatrix = {};
  try {
    const { ...docs } = idList.length ?
      await DistanceMatrix.find({ group_id: groupId }).where('id').in(idList).exec() :
      await DistanceMatrix.find({ group_id: groupId });
    distanceMatrix.records = docs;
    distanceMatrix.error = false;
  } catch(e) {
    log.error(e);
    distanceMatrix.records = {};
    distanceMatrix.error = true;
  } finally {
    return {
      records: Object.values(distanceMatrix.records),
      error: distanceMatrix.error,
    };
  }
}

async function createDistanceMatrix(groupId, locationsData, cdData) {
  const { exists } = await checksDistMatrixExist(groupId);
  if(exists) {
    return { status: 'already created' };
  }
  try {
    const matrices = await generateDistanceMatrix(locationsData, groupId);
    matrices.forEach((matrix) => {
      const distanceMatrixModel = new DistanceMatrix(matrix);
      distanceMatrixModel.save(function (err) {
        if (err) {
          log.error(err);
        }
      });
    });
  } catch(e) {
    return { status: 'error' };
  } finally {
    return { status: 'success' };
  }
}

async function checksDistMatrixExist(groupId) {
  const matrixInfo = {};
  try {
    const { ...docs } = await DistanceMatrix.findOne({ group_id: groupId }).exec();
    if(Object.values(docs).length) {
      matrixInfo.exists = true;
    } else {
      matrixInfo.exists = false;
    }
    matrixInfo.error = false;
  } catch(e) {
    log.error(e);
    matrixInfo.exists = false;
    matrixInfo.error = true;
  } finally {
    return { exists: matrixInfo.exists, error: matrixInfo.error };
  }
}

async function generateDistanceMatrix(locationsData, groupId) {
  const locations = locationsData.locationsInfo.map((location) => {
    return { id: location.customer_id, lat: location.lat, lng: location.lng };
  });
  const { ds } = locations.reduce((acm, actual) => {
    acm.ds.push({
        group_id: groupId, id: actual.id, d: Object.assign({}, locations.reduce((innerAcm, innerActual) => {
          innerAcm = Object.assign(innerAcm, {[innerActual.id]: getDistanceFromLatLonInKm(actual.lat, actual.lng, innerActual.lat, innerActual.lng) });
          delete innerAcm.id;
          delete innerAcm.lat;
          delete innerAcm.lng;
          return innerAcm;
        }, Object.assign({}, locations[0])))
    });
    delete acm.id;
    delete acm.lat;
    delete acm.lng;
    return acm;
  }, { ...locations[0], ds: [] });

  return ds;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = degTorad(lat2-lat1);
  const dLon = degTorad(lon2-lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(degTorad(lat1)) * Math.cos(degTorad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return parseFloat(((R * c) || 0).toFixed(2));
}

function degTorad(deg) {
  return deg * (Math.PI/180);
}

module.exports = { updateLocations, mapLocationsData, receiveDcLocation, receiveLocations,
  receiveDistanceMatrix, getDistanceFromLatLonInKm };
