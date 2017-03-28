const express = require('express');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const winston = require('winston');
const redis = require('redis');
const crypto = require('crypto');
const cors = require('cors');
const expressWinston = require('express-winston');
const passport = require('passport');
const session = require('express-session');

Promise.promisifyAll(crypto);
Promise.promisifyAll(redis.RedisClient.prototype);

const config = require('./config');
const routes = require('./routes');

winston.configure({
  level: config.logLevel,
  transports: [
    new (winston.transports.Console)()
  ]
});

const app = express();

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ],
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{res.statusCode}} {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) {
    return false;
  } // optional: allows to skip some log messages based on request and/or response
}));
// allow CORS

const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, '*');
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded());
app.use(session({secret: 'huigjergroej'}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.listen(config.port);

winston.info(`Listening on port ${config.port}`);
