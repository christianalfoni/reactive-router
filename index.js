'use strict';
// var createHistory = require('history');

var Router = function(routes) {
  return {
    listen: function() {
      this.listener = createHistory().listen(function(location) {
        this._matchRoute(location);
      });
    },

    stopListening: function() { this.listen.unlisten(); },

    set: function(url) {
      //todo
    },

    setSilent: function(url) {
      this.isSilent = true;
      this.set(url);
      this.isSilent = false;
    },

    // "private" methods
    _matchRoute: function(location) {
      var route = this._findMatchingRoute(routes, location);
      this._invokeCallback(routes, route, locaion);
    },

    _findMatchingRoute: function(routes, location) {
      return (
        Object.keys(routes).find(function(key) {
          return this.match(key, location);
        })
      );
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
