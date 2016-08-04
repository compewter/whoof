var routeHandler = require('./routeHandler');

module.exports = function (req, res, next) {

  res.set(defaultCorsHeaders);
  var route = req.url.substring(1).split('/')[0];

  switch(req.method){
    case 'GET':
      routeHandler[route].get(req, res, next);
      break;
    case 'POST':
      routeHandler[route].post(req, res, next);
      break;
    default:
      res.redirect('/');
  }

}

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
};
