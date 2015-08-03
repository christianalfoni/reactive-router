# reactive-router
A reactive wrapper around Page JS

> **The URL is like any other state**

## What makes reactive-router different?
When the router moved to the frontend it has been given a lot of different jobs. Keep track of and parse the current url, control the VIEW layer and often do data-fetching and handling transition states. The reactive-router is going back to the roots of what a router does, and that is pass a URL request to the controller layer of your application.

Some more info
- [reactive-router](https://www.youtube.com/watch?v=6tUbnDHq8xs)
- [Cerebral - A state controller with its own debugger](https://www.youtube.com/watch?v=xCIv4-Q2dtA)

## Application state, not URLs
> Your VIEW layer should not care about what the URL is, it should care about what state your application is in

The way to think about the **reactive-router** is this:

1. A url triggers and the reactive-router triggers a related method on your controller layer
2. Your **controller** layer converts this request to application state. An example of this would be `/inbox` which puts your application in `{currentFolder: 'inbox'}`
3. Your **view** layer does not check the url to figure out what to render, it checks the `currentFolder` state

What this means is that you stop thinking about your UI as a reflection of the URLs, because it does not matter. What matters is the state you want to put your application in. A URL is just a way to trigger some state, it being setting what components to render, what filters to set, what item in a list to highlight etc.

## How does it work?
reactive-router is a wrapper around [pagejs](https://visionmedia.github.io/page.js/), a neat little routing library built by **visionmedia**.

I will show this example using the [cerebral controller project](https://github.com/christianalfoni/cerebral).
```js
import ReactiveRouter from 'reactive-router';
import controller from './controller.js';

/*
  ACTIONS
*/
const setCurrentUrl = function (args, state) {
  state.set('url', args.url);
};

const setCurrentPage = function (args, state) {
  state.set('currentPage', args.path.split('/')[1]); // /{page}
};

const setLoading = function (args, state) {
  state.set('isLoading', true);
};

const unsetLoading = function (args, state) {
  state.set('isLoading', false);
};

const getMessageByParamsId = function (args, state, promise) {
  args.utils.ajax.get('/messages/' + args.params.id)
    .then(function (message) {
        promsise.resolve({message: message});
    })
    .catch(function (error) {
        promise.reject({error: error});
    });
};

const setCurrentMessage = function (args, state) {
  state.set('currentMessage', args.message);
};

const setError = function (args, state) {
  state.set('error', args.error);
  state.set('url', '/error');
};

/*
  SIGNALS
*/
controller.signal('homeRouted',
    setCurrentUrl,
    setCurrentPage
);

controller.signal('messageRouted',
    setCurrentUrl,
    setCurrentPage,
    setLoading,
    [getMessageByParamsId, {
      resolve: [setMessage],
      error: [setError]
    }],
    unsetLoading
);

controller.signal('errorRouted',
    setCurrentUrl,
    setCurrentPage
);

/*
  ROUTER
  The way you define routes is changed. Pass one object to define all routes. Second argument is any
  Page JS options
*/
const router = ReactiveRouter({
  '/home': homeRouted,
  '/messages/:id': messageRouted,
  '/error': errorRouted
}, {
  hashbang: true
});

// Listen to state changes and set the url
state.on('change', function (state) {
  router.set(state.url);
});

// When remembering state with cerebral, silently set the url
state.on('remember', function (state) {
  router.setSilent(state.url);
});
```

## Why listen to state changes and set the url?
If you are familiar with React, you can compare this to an input. Even though the input/router is what caused the change, we want to store the state (value/url) and bring it right back to the input/router. The reason is that now we can manually change the input/router value/url inside our state store and it will be reflected in the UI, as you can see an example of with the `setError` action. To change a url you can trigger your own "change url" signal, or just change the url normally.

*Handle nesting*
```js
@State({currentPage: ['currentPage'])
const Comp = React.createClass({
  render() {
    switch (this.props.currentPage) {
        case 'home':
            return <Home/>;
        case 'messages':
            return <Messages/>
        case 'error':
            return <Error/>
    }
  }
});
```

*Trigger a route*
```js
const Comp = React.createClass({
  render() {
    return (
      <a href="/messages/123">Open message 123</a>
    );
  }
});
```

*Trigger route with state change*
```js

controller.signal('urlChanged', setCurrentUrl);

const Comp = React.createClass({
  render() {
    return (
      <a onClick={() => this.props.signals.urlChanged({path: '/messages/123'})}>Open message 123</a>
    );
  }
});
```
