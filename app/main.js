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
        <a style={{color: 'blue'}} href="/foo">Foo</a>
        <a style={{color: 'blue'}} onClick={() => this.signals.urlChanged({path: '/foo/456'})}>Bar</a>
        <div>
          <Messages/>
        </div>
      </div>
    );
  }
});

controller.signal('indexRouted', function fooRouted (args, state) {
  state.set('url', args.path);
});

controller.signal('fooRouted', function fooRouted (args, state) {
  state.set('url', args.path);
  state.set('messageId', null);
});

controller.signal('barRouted', function barRouted (args, state) {
  state.set('url', args.path);
});

controller.signal('messageRouted', function messageRoutedd (args, state) {
  state.set('url', args.path);
  state.set('messageId', args.params.id);
});

controller.signal('urlChanged', function urlChanged (args, state) {
  state.set('url', args.path);
});

const router = Router({
  '/': controller.signals.indexRouted,
  '/foo': controller.signals.fooRouted,
  '/bar': controller.signals.barRouted,
  '/foo/:id': controller.signals.messageRouted
}, {
  hashbang: true
});

controller.eventEmitter.on('change', function (state) {
  router.set(state.url);
});

controller.eventEmitter.on('remember', function (state) {
  router.setSilent(state.url);
});

React.render(controller.injectInto(App), document.body);
