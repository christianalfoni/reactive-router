import controller from './controller.js';
import {Container, Mixin} from 'cerebral-react';
import React from 'react';
import route from './../index.js';
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
  render() {
    return (
      <div>
        <a href="/foo">Foo</a>
        <a href='/foo/456'>Bar</a>
        <div>
          <Messages/>
        </div>
      </div>
    );
  }
});


function setUrl (input, state, output, services) {
  state.set('url', input.path);
}

controller.signal('indexRouted', setUrl);

controller.signal('fooRouted', setUrl, function fooRouted (args, state) {
  state.set('messageId', null);
});

controller.signal('barRouted', setUrl);

controller.signal('messageRouted', setUrl, function messageRouted (args, state) {
  state.set('messageId', args.params.id);
});


addressbar.on('change', route({
  '/': controller.signals.indexRouted,
  '/foo': controller.signals.fooRouted,
  '/bar': controller.signals.barRouted,
  '/foo/:id': controller.signals.messageRouted
}));

controller.on('change', function () {
  console.log('CHANGE!');
  addressbar.value = controller.get('url');
});
React.render(<Container controller={controller} app={App}/>, document.body);
