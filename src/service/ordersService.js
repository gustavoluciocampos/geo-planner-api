function updateOrders(locationData) {
  // TODO
}

function mapOrdersData(ordersData) {
  const hlPerCase = 0.144;
  const detailedOrdersInfo = {};
  try {
    let volAcm = 0;
    let prevId = 0;
    detailedOrdersInfo.ordersInfo = ordersData.map((item) => {
      const itemId = parseInt(item['Cliente'], 10);
      const currentVol = parseFloat(item['Volume Marcacao'].toString().replace(',','.'));
      if(itemId !== prevId) {
        volAcm = 0;
      }
      volAcm += currentVol;
      prevId = itemId;
      return {
        'customer_id': itemId,
        'customer_name': item['Nome Cliente'],
        'salesman_id': item['Vendedor'],
        'salesman_name': item['Nome Vendedor'],
        'product_id': item['Cod. Prod.'],
        'product_name': item['Nome Prod.'],
        'cases': currentVol/hlPerCase,
        'cases_acm': (volAcm/hlPerCase).toFixed(2),
        'volume': currentVol,
        'volume_acm': volAcm.toFixed(2),
        'off_route': item['Fora de Rota'][0],
      };
    });
    detailedOrdersInfo.fileLoadError = false;
  } catch(err) {
    console.log(err);
    detailedOrdersInfo.fileLoadError = true;
  } finally {
    return detailedOrdersInfo;
  }
}

module.exports = { updateOrders, mapOrdersData };
