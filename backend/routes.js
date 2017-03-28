const express = require('express');
const proxy = require('express-http-proxy');
const base64 = require('js-base64').Base64;

const apiExceptions = require('fi-api-client').exceptions;

const apiClient = require('./models');
const auth = require('./auth');
const config = require('./config');


const router = express.Router();

const correspondances = {
  'all_groups': 'allGroups',
  'all_events': 'allEvents',
  'groups': 'groups',
  'events': 'events',
  'people': 'people',
};

function checkIfOwner(user, resource, _id) {
  if (['all_groups', 'all_events'].includes(resource)) {
    console.log(apiClient);
    return apiClient[correspondances[resource]].get(_id)
      .then(function (item) {
        return item.contact.email === user.email;
      })
      .catch((err) => {
        if (err instanceof apiExceptions.NotFoundError) {
          return false;
        }
      });
  } else if (resource === 'people') {
    return Promise.resolve(user.id === _id);
  } else {
    return Promise.resolve(false);
  }
}

function checkRightsMiddleware(req, res, next) {
  checkIfOwner(req.user, req.params.resource, req.params.id)
    .then(function (valid) {
      if (valid) {
        next();
      } else {
        res.status(403).json({status: 'Forbidden', code: 403});
      }
    })
}

function decorateWithAuthHeader(proxyReq, originalReq) {
  proxyReq.headers['Authorization'] = 'Basic ' + base64.encode(`${config.APIKey}:`);
  return proxyReq;
}

function preserveHeaders(headers) {
  return function (req, res, next) {
    if (!Array.isArray(headers)) {
      headers = [headers];
    }
    const preservedHeaders = res._preservedHeaders = {};

    for(const header of headers) {
      preservedHeaders[header] = res.getHeader(header);
    }

    next();
  };
}

function restoreHeaders(rsp, data, req, res, cb) {
  res.set(res._preservedHeaders);
  cb(null, data);
}

const proxyToAPI = proxy(config.apiEndpoint, {
  decorateRequest: decorateWithAuthHeader,
  intercept: restoreHeaders
});

const proxyMiddlewares = [
  preserveHeaders(['Access-Control-Allow-Origin']),
  proxyToAPI
];

router.get('/login', function (req, res) {
  res.send("<html><body><form action='/authenticate' method='POST'><input type='text' name='username'><input type='password' name='password'><input type='submit' value='envoyer'></form> </body></html>")
});

router.post('/authenticate', auth.authenticateRoute);

// validate user is authenticated
router.use(function (req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).send('not authenticated my friend');
  }
  next();
});

router.get('/profile', function(req, res) {
  res.send(req.user);
});

// this route handles all methods to specific resources that are owned by the authenticated user
router.all(
  '/:resource([a-z_]+)/:id([0-9a-f]{24})',
  checkRightsMiddleware,
  proxyMiddlewares
);

// this route handles the creation of new resources (everyone that is authenticated can do it) TODO verify assertion
router.all('/all_events/', proxyMiddlewares);
router.all('/all_groups/', proxyMiddlewares);


// every other route is 404
router.use(function (req, res) {
  res.status(404).json({status: 'Does not exist', code: 404});
});


module.exports = router;
