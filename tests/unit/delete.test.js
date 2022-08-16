const request = require('supertest');

const app = require('../../src/app');

describe('Delete /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password user can post a text fragment
  test('authenticated users deletes a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send('test fragment')
      .set('Content-type', 'text/markdown')
      .auth('user1@email.com', 'password1');
    var id = JSON.parse(res.text).fragment.id;
    const res2 = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);

    const res3 = await request(app).get(`/v1/fragments/${id}`).auth('user2@email.com', 'password2');

    expect(res3.statusCode).toBe(500);
  });
});
