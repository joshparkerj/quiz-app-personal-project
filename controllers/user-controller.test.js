const massive = require('massive');
const uc = require('./user-controller');

let db;

beforeAll(async () => {
  db = await massive();
});

describe('user-controller.js', () => {
  it('is defined', () => {
    expect(uc).toBeDefined();
  });

  it('can post user', async () => {
    uc.postUser(
      {
        app: {
          get: () => db,
        },
        body: {
          username: 'test',
          password: 'test',
        },
      },
      {
        status: () => ({ send: () => {} }),
      },
    );
  });
});
