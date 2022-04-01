const nc = require('./nodb-controller');

const response = [];

const send = (message) => {
  response.push(message);
  return message;
};

const sendFile = (message) => {
  response.push(message);
  return message;
};

const res = {
  send,
  sendFile,
};

describe('get react', () => {
  it('sends a file', () => {
    nc.getReact({}, res, {});
    expect(response[response.length - 1]).toBeDefined();
  });
});
