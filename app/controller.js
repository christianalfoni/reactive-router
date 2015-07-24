import Controller from 'cerebral-react-immutable-store';

const state = {
  url: '/foo',
  messageId: null
};

const defaultArgs = {

};

const controller = Controller(state, defaultArgs);

export default controller;
