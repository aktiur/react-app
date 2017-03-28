const fi = require('fi-api-client');

const config = require('./config');

const apiClient = fi.createClient({endpoint: config.apiEndpoint, auth: 'basicToken', token: config.APIKey});

module.exports = apiClient;
