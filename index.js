'use strict';
var page = require('page');

var Router = function (routes, options) {

  var isSilent = false;

  // register the routes
  Object.keys(routes).map(function (route) {
    page(route, function () {
      !isSilent && routes[route].apply(this, arguments);
    });
  });

  // start the router
  page(options || {});

  // export functions
  return {
    set: function (url) {
      if (page.current !== url) {
        page(url);
      }
    },
    setSilent: function (url) {
      isSilent = true;
      this.set(url);
      isSilent = false;
    }
  };

};

module.exports = Router;
