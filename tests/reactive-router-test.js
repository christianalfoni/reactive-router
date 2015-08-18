var Router = require('../index');

module.exports = {
  setUp: function (callback) {
    this.routes = {
      '/':                  function(arg){ return 'rootCallback ' + arg; },
      '/foo':               function(arg){ return 'fooCallback ' + arg; },
      '/foo/:id':           function(arg){ return 'fooIdCallback ' + arg; },
      '/foo/:id/baz':       function(arg){ return 'fooIdBazCallback ' + arg; },
      '/foo/:id/baz/:guid': function(arg){ return 'fooIdBazGuidCallback ' + arg; }
    };
    this.router = Router(this.routes);
    callback();
  },

  tearDown: function (callback) {
    this.router = null;
    callback();
  },

  _invokeCallback: function (test) {
    callbackValue = this.router._invokeCallback(this.routes, '/foo', "location");

    test.equal(callbackValue, 'fooCallback location');
    test.done();
  },

  _match: function(test) {
    // data
    var routesFixture = {
      '/': '/',
      '/foo': '/foo',
      '/foo/bar': '/foo/bar',
      '/foo/:id': '/foo/123',
      '/foo/:id/baz': '/foo/123/baz',
      '/foo/:id/baz/:guid': '/foo/123/baz/abc'
    };
    var routes = Object.keys(routesFixture);

    // assertion helper
    var self = this;
    function assertMatch(route, location, nonMatchingRoutes) {
      test.ok(self.router._match(route, location));

      nonMatchingRoutes.forEach(function(route, location) {
        test.ok(!self.router._match(route, location));
      });
    }

    // test
    routes.forEach(function(route) {
      var mutableRoutes  = routes.slice()
      var index          = mutableRoutes.indexOf(route);
      var routeUnderTest = mutableRoutes.splice(index, 1).shift();
      var location       = routesFixture[route];

      assertMatch(routeUnderTest, location, mutableRoutes);
    });

    test.done();
  },

  _findMatchingRoute: function(test) {
    var activeRoute = this.router._findMatchingRoute(this.routes, '/foo/123');
    test.equal(activeRoute, '/foo/:id');

    test.done();
  },

  _matchRoute: function(test) {
    var matchedRoute = this.router._matchRoute(this.routes, '/foo/123/baz/abc');
    test.equal(matchedRoute, 'fooIdBazGuidCallback /foo/123/baz/abc');
    test.done();
  }
};
