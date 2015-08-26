var utils = {
  findMatchingRoute: function (routes, pathname) {
    return Object.keys(routes).filter(function(route) {
      return utils.match(route, pathname);
    }).shift();
  },
  match: function (route, pathname) {
    return utils.asRegex(route).test(pathname);
  },
  parseParams: function (route, pathname) {
    var urlValues = utils.asRegex(route).exec(pathname);
    var dynamicSegments = utils.asRegex(route).exec(route);
    var params = {};

    if (urlValues && dynamicSegments) {
      for(var i = 1; i < urlValues.length; i++) {
        params[dynamicSegments[i].substr(1)] = urlValues[i];
      }
    }
    return params;
  },
  asRegex: function (route) {
    var regexableRoute = '^' + route.replace(/:(\w+)/g, "(:?\\w+)") + '$';
    return new RegExp(regexableRoute, 'g');
  }
};

module.exports = utils;
