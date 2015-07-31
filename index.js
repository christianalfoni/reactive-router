const Router = function (routes) {

  var silent = false;
  var matchRoutes = function (currentUrl) {
    var result = Object.keys(routes).reduce(function (info, url) {
      var length = url.split('/').length;
      if (Router.match(currentUrl, url) && info.hit > info.currentHit) {
        info.cb = routes[url];
        info.currentHit = length;
        info.params = Router.match(currentUrl, url);
      }
      return info;
    }, {
      cb: null,
      currentHit: 0,
      params: null,
      hit: currentUrl.split('/').length
    });
    result.cb({
      url: currentUrl,
      params: result.params
    });
  };

  window.addEventListener('hashchange', function () {
    if (silent) {
      silent = false;
      return;
    }
    matchRoutes(location.hash.substr(1));
  });
  matchRoutes(location.hash ? location.hash.substr(1) : '/');

  return {
    set: function (url) {
      if (url !== location.hash.substr(1)) {
        location.hash = url;
      }
    },
    setSilent: function (url) {
      if (url !== location.hash.substr(1)) {
        silent = true;
        location.hash = url;
      }
    }
  };

};

Router.match = function (currentUrl, url) {

  var currentArray = currentUrl.split('/');
  var array = url.split('/');

  var params = {};

  for (var x = 0; x < array.length; x++) {
    if (array[x] !== currentArray[x] && array[x][0] !== ':') {
      return null;
    }
    if (array[x][0] === ':' && currentArray[x]) {
      params[array[x].substr(1)] = currentArray[x];
    }
  }
  return params;

};

module.exports = Router;
