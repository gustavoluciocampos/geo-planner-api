import nconf from 'nconf';

nconf.argv().env();

if (process.env.ENV_IN === 'docker') {
    nconf.file('docker', {
        file: process.cwd() + '/src/config/docker.config.json'
    });
}

nconf.file('defaults', {
    file: process.cwd() + '/src/config/config.json'
});

module.exports = nconf;
