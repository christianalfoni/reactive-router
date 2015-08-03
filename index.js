const page = require('page');

const Router = function (routes, options) {

  let isSilent = false;

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
