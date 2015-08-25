import Controller from 'cerebral';
import Model from 'cerebral-immutable-store';

import addressbar from 'addressbar';

const model = Model({
  url: '/foo',
  messageId: null
});

const services = {
  addressbar: addressbar
};

const controller = Controller(model, services);

export default controller;
