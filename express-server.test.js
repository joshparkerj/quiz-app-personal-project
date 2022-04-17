const axios = require('axios');
const expressServer = require('./express-server');

beforeAll(() => {
  expressServer.listen(8090);
});

afterAll(() => {
  expressServer.close();
});

it('gets a category', async () => {
  const res = await axios.get('http://localhost:8090/create-game/anime/15');

  expect(res.status).toBe(200); // ok
});

it('returns all stats', async () => {
  const res = await axios.get('http://localhost:8090/api/allstats');
  expect(res.status).toBe(200); // ok
});
