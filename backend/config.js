const config = {};

config.port = process.env.PORT || 5001;
config.APIKey = process.env.API_KEY;
config.logLevel = process.env.LOG_LEVEL || 'info';
config.apiEndpoint = process.env.API_ENDPOINT || "http://api.redado.dev";

module.exports = config;