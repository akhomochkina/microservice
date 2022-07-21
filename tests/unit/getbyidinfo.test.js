// tests/unit/getbyidinfo.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get fragment by id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send('test fragment')
      .set('Content-type', 'text/plain')
      .auth('user1@email.com', 'password1');
    var id = JSON.parse(res.text).fragment.id;
    const res2 = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
  });

  test('getting an error message when fragment id doe not exist', async () => {
    const res2 = await request(app)
      .get(`/v1/fragments/1/info`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(500);
  });
});
