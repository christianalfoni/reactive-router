const page = require('page');

const Router = function (routes, options) {

  // register the routes
  Object.keys(routes).map(function (route) {
    page(route, function (context) {
      context.url = context.path;
      context.fragments = context.pathname.split('/');
      routes[route](context);
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
    }
  };

};

module.exports = Router;
