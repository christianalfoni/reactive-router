import Controller from 'cerebral';
import Model from 'cerebral-immutable-store';

import route from './../index.js';

const model = Model({
  url: '/',
  messageId: null
});

const services = {
  route: route
};

const controller = Controller(model, services);

export default controller;
