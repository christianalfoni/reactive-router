'use strict';
var addressbar = require('addressbar');
var utils = require('./src/utils.js');

module.exports = function (routes) {

  var runRoute = function (value) {
    var path = value.replace(location.origin, '').replace('#', '');
    var route = utils.findMatchingRoute(routes, path);
    var params = utils.parseParams(route, path);

    routes[route]({
      path: path,
      params: params
    });
  };

  runRoute(location.href);

  return function (event) {
    event.preventDefault();
    runRoute(event.target.value);
  }

};
