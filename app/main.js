import controller from './controller.js';
import {Mixin} from 'cerebral-react-immutable-store';
import React from 'react';
import Router from './../index.js';

const Messages = React.createClass({
  mixins: [Mixin],
  getStatePaths() {
    return {
      url: ['url'],
      messageId: ['messageId']
    };
  },
  render() {
    return (
      <div>
        <h1>Messages!</h1>
        {
          this.state.messageId ?
          this.state.messageId :
          null
        }
      </div>
    );
  }
});

const App = React.createClass({
  mixins: [Mixin],
  getStatePaths() {
    return {
      url: ['url']
    };
  },
  render() {
    return (
      <div>
        <a style={{color: Router.match(this.state.url, '/foo') ? 'red' : 'blue'}} href="#/foo">Foo</a>
        <a style={{color: Router.match(this.state.url, '/bar') ? 'red' : 'blue'}} onClick={() => this.signals.urlChanged({url: '/foo/456'})}>Bar</a>
        <div>
          {Router.match(this.state.url, '/foo') ? <Messages/> : null}
        </div>
      </div>
    );
  }
});

controller.signal('indexRouted', function fooRouted (args, state) {
  state.set('url', args.url);
});

controller.signal('fooRouted', function fooRouted (args, state) {
  state.set('url', args.url);
  state.set('messageId', null);
});

controller.signal('barRouted', function barRouted (args, state) {
  state.set('url', args.url);
});

controller.signal('messageRouted', function messageRoutedd (args, state) {
  state.set('url', args.url);
  state.set('messageId', args.params.id);
});

controller.signal('urlChanged', function urlChanged (args, state) {
  state.set('url', args.url);
});

const router = Router({
  '/': controller.signals.indexRouted,
  '/foo': controller.signals.fooRouted,
  '/bar': controller.signals.barRouted,
  '/foo/:id': controller.signals.messageRouted
});

controller.eventEmitter.on('change', function (state) {
  router.set(state.url);
});

controller.eventEmitter.on('remember', function (state) {
  router.setSilent(state.url);
});

React.render(controller.injectInto(App), document.body);
