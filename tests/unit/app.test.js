// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the resource does not exist it should show 404 not found
  test('not found', () => request(app).get('/doesnotexists/fragments').expect(404));
});
