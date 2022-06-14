const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password user can post a text fragment
  test('authenticated users post a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send('test fragment')
      .set('Content-type', 'text/plain')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  // Using a valid username/password user can post a text fragment
  test('authenticated users post a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send('test fragment')
      .set('Content-type', 'invalid type')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(500);
  });
});
