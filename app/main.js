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
        <Link href="/foo">Foo</Link>
        <Link href='/foo/456'>Bar</Link>
        <div>
          <Messages/>
        </div>
      </div>
    );
  }
});

const Link = React.createClass({
  mixins: [Mixin],

  getInitialState: function() {
    return {visited: false};
  },

  onClick: function(e) {
    e.preventDefault();
    this.setState({visited: true});
    this.signals.urlChanged({pathname: this.props.href});
  },

  linkStyles: function() {
    var styles = {textDecoration: 'underline'};
    if (this.state.visited) {
      styles['color'] = '#663366';
    } else {
      styles['color'] = 'blue';
    }
    return styles;
  },

  render() {
    return (
      <a style={this.linkStyles()}
         onClick={this.onClick}>
         {this.props.children}
      </a>
    );
  }
});

controller.signal('indexRouted', function fooRouted (args, state) {
  state.set('url', args.pathname);
});

controller.signal('fooRouted', function fooRouted (args, state) {
  state.set('url', args.pathname);
  state.set('messageId', null);
});

controller.signal('barRouted', function barRouted (args, state) {
  state.set('url', args.pathname);
});

controller.signal('messageRouted', function messageRouted (args, state) {
  state.set('url', args.pathname);
  state.set('messageId', args.params.id);
});

controller.signal('urlChanged', function urlChanged (args, state) {
  state.set('url', args.pathname);
  router.set(args.pathname);
});

const router = Router({
  '/': controller.signals.indexRouted,
  '/foo': controller.signals.fooRouted,
  '/bar': controller.signals.barRouted,
  '/foo/:id': controller.signals.messageRouted
});

router.listen();

// controller.eventEmitter.on('change', function(state) {
//   router.set(state.url);
// });

// controller.eventEmitter.on('remember', function (state) {
//   router.setSilent(state.url);
// });

React.render(controller.injectInto(App), document.body);
