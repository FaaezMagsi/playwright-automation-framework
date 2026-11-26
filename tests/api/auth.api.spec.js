const { test, expect } = require('../../fixtures/test');
const api = require('../../data/api.json');
const { ApiClient } = require('../../utils/apiClient');
const { expectResponse } = require('../../utils/apiAssertions');

test.describe('API: authentication', () => {
  test('POST login returns a token', async ({ request, newUser }, testInfo) => {
    const client = new ApiClient(request, testInfo);
    const response = await client.post(api.endpoints.login, { data: { email: newUser.email, password: newUser.password } });
    expectResponse(response, { status: api.expected.login.status, schema: 'token' });
    expect(response.body.token_type).toBe(api.expected.login.tokenType);
  });
});
