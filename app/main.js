import controller from './controller.js';
import {Container, Mixin} from 'cerebral-react';
import React from 'react';
import addressbar from 'addressbar';

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
  componentWillMount() {
    this.signals.urlChanged({url: location.href});
  },
  render() {
    return (
      <div>
        <a href="/foo">Foo</a>
        <a onClick={(e) => e.prevetDefault(); this.signals.urlChanged({url: '/foo/456'})}>Bar</a>
        <div>
          <Messages/>
        </div>
      </div>
    );
  }
});

function route (input, state, output, services) {
  state.set('url', input.url);
  services.route(input.url, {
    '/': output.home,
    '/foo': output.foo,
    '/bar': output.bar,
    '/foo/:id': output.message
  });
}

route.outputs = ['home', 'foo', 'bar', 'message'];

function unsetMessage (args, state) {
  state.set('messageId', null);
}

function setMessage (args, state) {
  state.set('messageId', args.params.id);
}

controller.signal('urlChanged', route, {
  home: [],
  foo: [unsetMessage],
  bar: [],
  message: [setMessage]
});

addressbar.on('change', function (event) {
  event.preventDefault();
  controller.signals.urlChanged({url: event.target.value});
});

controller.on('change', function () {
  addressbar.value = controller.get('url');
});

React.render(<Container controller={controller} app={App}/>, document.body);
