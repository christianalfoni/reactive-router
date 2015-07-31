# reactive-router
A router that is controlled by your application state

> **The URL is like any other state**

Note that this project is **experimental**.

## What makes reactive-router different?
When MVC was moved to the frontend, the router was moved with it as a controller layer. The job of a controller is to take requests from the view and make changes to your model layer. The problem with using the controller as the controller layer is that not all requests for state changes are related to a route. Some of the state changes are done through the router and some of them are done directly to the model layer or through some other controller layer. This makes things very complex. You can [watch this video](https://www.youtube.com/watch?v=xCIv4-Q2dtA) to learn more about this statement.

The **reactive-router** has no intention of being a controller layer. It just listens to changes in your application state and sets the current url based on that. When urls are changed by the browser you can trigger a request to your controller layer, it being a FLUX dispatcher/action creator or some other type of controller layer.

## What does this give me?
The reactive-router is a small snippet of code. There is no complex logic to make routes match the layout of your page, fetching of data etc. That is not the job of the router. The job of the router is to listen for URL changes in your application state, and dispatch requests to the controller when that happens, or the browser changes the url. Now all the logic for application state and fetching data is contained in your controller layer, not shared with the router.

The reactive-router also gives you A LOT of flexibility. No longer your router controls how components/views should be composed, you decide what a route change means. It can be anything from filtering a list, to changing what component/view to display to whatever a URL should mean in your app.

## How does it work?

```js
import ReactiveRouter from 'reactive-router';

// Some state/store library
import state from './state.js';

// Some actions
const displayHomeAction = function (route) {
    state.set('url', route.url);
    state.set('currentView', 'home');
};

const displayMessagesAction = function (route) {
    state.set('url', route.url);
    state.set('currentView', 'message');
    state.set('isLoadingMessage', true);
    ajax.get('/messages/' + route.params.id).then(function (message) {
      state.set('currentMessage', message);
      state.set('isLoadingMessage', false);
    });
};

// Define the router
const router = ReactiveRouter({
  '/': displayHomeAction,
  '/messages/:id': displayMessageAction
});

// Listen to state changes and set the url
state.on('change', function (state) {
  router.set(state.get('url'));
});
```

## Why listen to state changes and set the url?
If you are familiar with React, you can compare this to an input. Even though the input/router is what caused the change, we want to store the state (value/url) and bring it right back to the input/router. The reason is that now we can manually change the input/router value/url inside our state store and it will be reflected in the UI.

*Example with React*
```js
import state from './state.js';

const changeUrl = function (url) {
  state.set('url', url);
};

const Comp = React.createClass({
  render() {
    return (
      <button onClick={() => changeUrl('/foo')}>Change url</button>
    );
  }
});
```
Now we are changing the URL of the application inside our state store, not from the router. The router is *reactive*, it reacts to the state change of the url. This allows you to change the current route inside the actions.
