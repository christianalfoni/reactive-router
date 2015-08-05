# reactive-router
A reactive wrapper around Page JS

> **The URL is like any other state**

## What makes reactive-router different?
When the router moved to the frontend it has been given a lot of different jobs. Keep track of and parse the current url, control the VIEW layer and often do data-fetching and handling transition states. The reactive-router is going back to the roots of what a router does, and that is pass a URL request to the controller layer of your application.

Some more info
- [Article: Why we are doing MVC and FLUX wrong](http://www.christianalfoni.com/articles/2015_08_02_Why-we-are-doing-MVC-and-FLUX-wrong)
- [Video: reactive-router](https://www.youtube.com/watch?v=6tUbnDHq8xs)
- [Video: Cerebral - A state controller with its own debugger](https://www.youtube.com/watch?v=xCIv4-Q2dtA)

## Application state, not URLs
> Your VIEW layer should not care about what the URL is, it should care about what state your application is in

The way to think about the **reactive-router** is this:

1. A url triggers and the reactive-router triggers a related method on your controller layer, it being action creators or some other state changing controller
2. Your **controller** layer converts this request to application state. An example of this would be `/inbox` which puts your application in `{currentFolder: 'inbox'}`
3. Your **view** layer does not check the url to figure out what to render, it checks the `currentFolder` state

What this means is that you stop thinking about your UI as a reflection of the URLs, because it does not matter. What matters is the state you want to put your application in. A URL is just a way to trigger some state, it being setting what components to render, what filters to set, what item in a list to highlight etc.

First of all this allows you to trigger a url change by just changing the "url" state inside your state store. It also allows you to define what a url-change actually means. It does not have to be changing out components, it could be highlighting something in a list or trigger some animation.

## How does it work?
reactive-router is a wrapper around [pagejs](https://visionmedia.github.io/page.js/), a neat little routing library built by **visionmedia**.

```js
import ReactiveRouter from 'reactive-router';
import state from './state.js';

// state can be a store, controller, actions or whatever is responsible
// for changing the state of your app. This example is with a state store

// Actions like these can be a lot more generic, but it is just to show you
const homeRouted = function (context) {
  state.set('url', context.path);
  state.set('currentPage', 'home');
};

const messageRouted = function (context) {
  state.set('url', context.path);
  state.set('currentPage', 'messages');
  state.set('currentMessage', context.params.id);
};

const errorRouted = function (context) {
  state.set('url', context.path);
  state.set('currentPage', 'error');
};

/*
  ROUTER
  The way you define routes is changed. Pass one object to define all routes. 
  Second argument is any Page JS options
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
  // or silently set, will not trigger the callback
  router.setSilent(state.url);
});
```

## Why listen to state changes and set the url?
If you are familiar with React, you can compare this to an input. Even though the input/router is what caused the change, we want to store the state (value/url) and bring it right back to the input/router. The reason is that now we can manually change the input/router value/url inside our state store and it will be reflected in the UI, as you can see an example of with the `setError` action. To change a url you can trigger your own "change url" signal, or just change the url normally.

#### Handle nesting
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

#### Trigger a route
```js
const Comp = React.createClass({
  render() {
    return (
      <a href="/messages/123">Open message 123</a>
    );
  }
});
```

#### Trigger route with state change
Now you can change the route from within your actions/controller and the router will react to that.
```js
import ajax from './state.js';
import state from './state.js';

const someAction = function () {
  ajax.post('/something')
    .resolve(function (data) {
      state.set('data', data);
      state.set('url', '/data');
    })
    .catch(function (error) {
      state.set('error', error);
      state.set('url', '/error');
    });
};
```
