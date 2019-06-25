import lodash from "lodash";
import reviewReport from '../libs/model/reviewReport';
import DistributionCenter from '../libs/model/distributionCenter';
import { getDistanceFromLatLonInKm, receiveDcLocation } from './locationsService';

function mergeInfos(leftData, rightData) {
  const info = {};
  try {
    if(!leftData.length || !rightData.length) {
      return {};
    }
    info.data = Object.values(leftData).map((leftItem) => {
      const rightObj = Object.values(rightData).find((rightItem) =>
        rightItem['customer_id'] == leftItem['customer_id']);
      return Object.assign(leftItem, rightObj);
    });
    info.fileLoadError = false;
  } catch(err) {
    info.fileLoadError = true;
  } finally {
    return info;
  }
}

async function generateDeliveryData(rawData, groupId) {
  const info = { records: [] };
  const groupedData = lodash.groupBy(rawData.data, 'customer_id');
  const { dc_info, error } = await receiveDcLocation(groupId);

  info.fileLoadError = rawData.fileLoadError || error;
  if(info.fileLoadError) {
    return info;
  }
  info.records = Object.values(groupedData).map((item) => item.reduce((acm, actual) => {
    const actualOrder = {
      product_id: actual['product_id'],
      product_name: actual['product_name'],
      volume: actual['volume'],
    };
    acm.orders.push(actualOrder);
    acm.volume_acm = parseFloat(acm.volume_acm) + parseFloat(actual.volume);
    return acm;
  }, Object.assign(item[0], { orders: [], volume_acm: 0 })));

  info.records = info.records.map((record) => {
    const newRecord = Object.assign({}, record);
    newRecord.volume_acm = parseFloat(newRecord.volume_acm).toFixed(2);
    newRecord.cases_acm = parseFloat(newRecord.volume_acm/dc_info.case_unit).toFixed(2);
    newRecord.cdDistanceStraight =
      getDistanceFromLatLonInKm(dc_info.lat, dc_info.lng, newRecord.lat, newRecord.lng);
    delete newRecord.product_id;
    delete newRecord.product_name;
    delete newRecord.volume;
    return newRecord;
  });

  return info;
}

function generateDeliveryReport(locations) {
  let report = {
    'off_route': { 'volume_acm': 0, 'customer_count': 0, },
    'in_route': { 'volume_acm': 0, 'customer_count': 0, },
    'total': { 'volume_acm': 0, 'customer_count': 0, },
  }
  const hlPerCase = 0.144;
  const groupedData = lodash.groupBy(locations.data, 'customer_id');
  const reportInput = Object.values(groupedData).map((item) => {
    const volume = Object.values(item).reduce((acm, actual) => acm + actual.volume, 0);
    return {
      'volume_acm': volume.toFixed(2),
      'off_route': item[0]['off_route'],
      'customer_id': item[0]['customer_id'],
      'customer_name': item[0]['customer_name'],
    };
  });

  reportInput.forEach((item) => {
    if(item.off_route === 'S') {
      report['off_route'].volume_acm += parseFloat(item.volume_acm);
      report['off_route'].customer_count++;
    } else {
      report['in_route'].volume_acm += parseFloat(item.volume_acm);
      report['in_route'].customer_count++;
    }
  });

  report['off_route'].volume_acm = parseFloat(report['off_route'].volume_acm.toFixed(2));
  report['in_route'].volume_acm = parseFloat(report['in_route'].volume_acm.toFixed(2));
  report['total'].volume_acm = report['in_route'].volume_acm +
    report['off_route'].volume_acm;
  report['total'].customer_count = report['in_route'].customer_count +
    report['off_route'].customer_count;
  report['off_route'].cases_acm = parseFloat((report['off_route'].volume_acm /
    hlPerCase).toFixed(2));
  report['in_route'].cases_acm = parseFloat((report['in_route'].volume_acm /
    hlPerCase).toFixed(2));
  report['total'].cases_acm = parseFloat((report['total'].volume_acm / hlPerCase).toFixed(2));

  return report;
}

function saveDeliveryReport(deliveries, metrics) {
  const report = {
    group_id: 1,
    volume_acm: metrics.total.volume_acm,
    volume_acm_in_route: metrics.in_route.volume_acm,
    volume_acm_off_route: metrics.off_route.volume_acm,
    cases_acm: metrics.total.cases_acm,
    cases_acm_in_route: metrics.in_route.cases_acm,
    cases_acm_off_route: metrics.off_route.cases_acm,
    customer_count: metrics.total.customer_count,
    customer_count_in_route: metrics.in_route.customer_count,
    customer_count_off_route: metrics.off_route.customer_count,
    deliveries: deliveries.records,
  };
  const reviewReportModel = new reviewReport(report);
  reviewReportModel.save(function (err) {
    if (err) {
      log.error(err);
    }
  });
}

module.exports = { mergeInfos, generateDeliveryData, generateDeliveryReport, saveDeliveryReport };
