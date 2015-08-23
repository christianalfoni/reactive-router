var Router             = require('../index');
var _match             = Router._match;
var _findMatchingRoute = Router._findMatchingRoute;
var _parseParams       = Router._parseParams;
var _parsePath         = Router._parsePath;

module.exports = {
  setUp: function(callback) {
    this.routes = {
      '/':                  function(arg){ return 'rootCallback ' + arg; },
      '/foo':               function(arg){ return 'fooCallback ' + arg; },
      '/foo/:id':           function(arg){ return 'fooIdCallback ' + arg; },
      '/foo/:id/baz':       function(arg){ return 'fooIdBazCallback ' + arg; },
      '/foo/:id/baz/:guid': function(arg){ return 'fooIdBazGuidCallback ' + arg; }
    };
    this.router = Router(this.routes, {});
    callback();
  },

  tearDown: function(callback) {
    this.router = null;
    callback();
  },

  set: function(test) {
    history = {pushState: function(_,url) { return 'set ' + url; }};
    this.router = Router(this.routes, history);

    test.equal(this.router.set('/foo/bar'), 'set /foo/bar');
    test.done();
  },

  setSilent: function(test) {
    history = {pushState: function(_,url) { return 'set ' + url; }};
    this.router = Router(this.routes, history);

    test.equal(this.router.setSilent('/foo/bar'), 'set /foo/bar');
    test.ok(this.router.isSilent);
    test.done();
  },

  _matchRoute: function(test) {
    var location = {pathname: '/foo/123/baz/abc'};
    var matchedRoute = this.router._matchRoute(this.routes,location);

    test.deepEqual(matchedRoute, 'fooIdBazGuidCallback ' + location);
    test.done();
  },

  _parsePath: function(test) {
    var location = {pathname: '/foo/123/baz/abc'};

    test.deepEqual(_parsePath('/foo/:id/baz/:guid', location), {
      pathname: '/foo/123/baz/abc', 
      params: { id: '123', guid: 'abc' }
    });

    test.done();
  },

  _invokeCallback: function (test) {
    callbackValue = this.router._invokeCallback(this.routes, '/foo', "location");

    test.equal(callbackValue, 'fooCallback location');
    test.done();
  },

  _findMatchingRoute: function(test) {
    var activeRoute = _findMatchingRoute(this.routes, '/foo/123');
    test.equal(activeRoute, '/foo/:id');

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
    function assertMatch(route, location, nonMatchingRoutes) {
      test.ok(_match(route, location));

      nonMatchingRoutes.forEach(function(route, location) {
        test.ok(!_match(route, location));
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

  _parseParams: function(test) {
    var nestedParams = _parseParams('/foo/:id/baz/:guid', '/foo/123/baz/abc');
    var rootParams   = _parseParams('/', '/');
    var fooParams    = _parseParams('/foo', '/foo');

    test.deepEqual(nestedParams, {id: '123', guid: 'abc'});
    test.deepEqual(rootParams, {});
    test.deepEqual(fooParams, {});

    test.done();
  }
};
