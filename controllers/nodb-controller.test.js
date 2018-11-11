const nc = require('./nodb-controller');

const response = [];

const send = message => {
  response.push(message);
  return message;
}

const sendFile = message => {
  response.push(message);
  return message;
}

const res = {
  send: send,
  sendFile: sendFile
}

describe('get health', () => {
  it('sends the response seemingly ok', () => {
    nc.getHealth({},res,{});
    expect(response[response.length-1]).toBe('seemingly ok');
  })
})

describe('get quip', () => {
  it('sends a response starting with are you sure', () => {
    nc.getQuip({},res,{});
    expect(response[response.length-1].split(' ')[0]).toBe('are');
    expect(response[response.length-1].split(' ')[1]).toBe('you');
    expect(response[response.length-1].split(' ')[2]).toBe('sure');
  })
})

describe('get react', () => {
  it('sends a file', () => {
    nc.getReact({},res,{});
    expect(response[response.length-1]).toBeDefined();
  })
})
