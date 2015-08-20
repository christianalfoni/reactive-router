'use strict';
var history       = require('history');
var createHistory = history.createHistory;

var Router = function(routes, history) {
  // history requires DOM, stub during test
  var history = history || createHistory();

  return {
    listen: function() {
      var self = this;
      this.unlisten = history.listen(function(location) {
        self._matchRoute(routes, location);
      });
    },

    stopListening: function() { this.unlisten(); },

    set: function(url) {
      history.pushState({}, url);
    },

    setSilent: function(url) {
      this.isSilent = true;
      this.set(url);
      this.isSilent = false;
    },

    // "private" methods
    _matchRoute: function(routes, location) {
      var route              = _findMatchingRoute(routes, location.pathname);
      var locationWithParams = _parsePath(route, location);

      return this._invokeCallback(routes, route, locationWithParams);
    },

    _invokeCallback: function(routes, route, location) {
      if (!this.isSilent) {
        return routes[route].call(this, location);
      }
    },

    isSilent: false
  };
}

function _findMatchingRoute(routes, pathname) {
  return Object.keys(routes).filter(function(route) {
    return _match(route, pathname);
  }).shift();
}

function _match(route, pathname) {
  return _asRegex(route).test(pathname);
}

function _parsePath(route, location) {
  var params      = _parseParams(route, location.pathname);
  location.params = params;
  return location;
}

function _parseParams(route, pathname) {
  var urlValues       = _asRegex(route).exec(pathname);
  var dynamicSegments = _asRegex(route).exec(route);
  var params          = {};

  if (urlValues && dynamicSegments) {
    for(var i = 1; i < urlValues.length; i++) {
      params[dynamicSegments[i].substr(1)] = urlValues[i];
    }
  }
  return params;
}

function _asRegex(route) {
  var regexableRoute = '^' + route.replace(/:(\w+)/g, "(:?\\w+)") + '$';
  return new RegExp(regexableRoute, 'g');
}

// exports
Router._match             = _match;
Router._findMatchingRoute = _findMatchingRoute;
Router._parseParams       = _parseParams;
Router._parsePath         = _parsePath;

module.exports = Router;
