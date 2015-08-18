'use strict';
// var createHistory = require('history');

var Router = function(routes) {
  return {
    listen: function() {
      this.urlListener = createHistory().listen(function(location) {
        this._matchRoute(routes, location);
      });
    },

    stopListening: function() { this.urlListener.unlisten(); },

    set: function(url) {
      //todo
    },

    setSilent: function(url) {
      this.isSilent = true;
      this.set(url);
      this.isSilent = false;
    },

    // "private" methods
    _matchRoute: function(routes, location) {
      var route = this._findMatchingRoute(routes, location);
      return this._invokeCallback(routes, route, location);
    },

    _findMatchingRoute: function(routes, location) {
      var self = this;

      return Object.keys(routes).filter(function(route) {
        return self._match(route, location);
      }).shift();
    },

    _match: function(route, location) {
      return new RegExp(this._asRegex(route), 'g').test(location)
    },

    _asRegex: function(route) {
      var regexableRoute = '^' + route.replace(/:(\w+)/g, "(:?\\w+)") + '$';
      // console.log(regexableRoute);
      return regexableRoute;
    },

    _invokeCallback: function(routes, route, location) {
      if (!this.isSilent) {
        return routes[route].call(this, location);
      }
    },

    isSilent: false
  };
}

module.exports = Router;
