import oauth2 from '../libs/auth/oauth2';
import api from '../libs/routes/api';
import users from '../libs/routes/users';
import reports from '../libs/routes/reports';
import locations from '../libs/routes/locations';
import orders from '../libs/routes/orders';

require('../libs/auth/auth');

const apiEndPoint = '/api';
const currentVersion = '/v1';
const apiDefault = apiEndPoint + currentVersion;

export default function(server) {
    server.use(apiDefault, api);
    server.use(apiDefault, users);
    server.use(apiDefault, reports);
    server.use(apiDefault, locations);
    server.use(apiDefault, orders);
    server.use(apiDefault+'/oauth/token', oauth2.token);
}
