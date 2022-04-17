const axios = require('axios');
const expressServer = require('./express-server');

beforeAll(() => {
  expressServer.listen(8090);
});

afterAll(() => {
  expressServer.close();
});

xit('creates a user', async () => {
  const res = await axios.post('http://localhost:8090/user', {
    username: 'test',
    password: 'test',
    email: 'test@email.co',
  });
  expect(res.status).toBe(201); // created
});

it('returns all stats', async () => {
  const res = await axios.get('http://localhost:8090/api/allstats');
  expect(res.status).toBe(200); // ok
});
