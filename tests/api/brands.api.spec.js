const { test, expect } = require('../../fixtures/test');
const api = require('../../data/api.json');
const env = require('../../config/env');
const { ApiClient } = require('../../utils/apiClient');
const { expectResponse } = require('../../utils/apiAssertions');
const { unique } = require('../../utils/dataFactory');

const brandPayload = (prefix) => {
  const id = unique();
  return { name: `${prefix} ${id}`, slug: `${prefix.toLowerCase().replace(/\s+/g, '-')}-${id}` };
};

// Create -> update -> patch -> delete on a brand owned by this run.
test.describe('API: brand lifecycle', () => {
  test.describe.configure({ mode: 'serial' });
  let brandId;
  let adminToken;
  const url = () => `${api.endpoints.brands}/${brandId}`;

  test.beforeAll(async ({ playwright }) => {
    const context = await playwright.request.newContext({ baseURL: env.apiUrl });
    const response = await new ApiClient(context).post(api.endpoints.login, { data: env.admin });
    expect(response.status, 'admin login for cleanup').toBe(200);
    adminToken = response.body.access_token;
    await context.dispose();
  });

  // Safety net: remove the brand if the DELETE test did not run or failed.
  test.afterAll(async ({ playwright }) => {
    if (!brandId) return;
    const context = await playwright.request.newContext({ baseURL: env.apiUrl });
    await new ApiClient(context).delete(url(), { token: adminToken });
    await context.dispose();
  });

  test('POST creates a brand', async ({ request }, testInfo) => {
    const payload = brandPayload(api.brand.namePrefix);
    const response = await new ApiClient(request, testInfo).post(api.endpoints.brands, { data: payload });
    expectResponse(response, { status: api.expected.create.status, schema: 'brand' });
    expect(response.body).toMatchObject(payload);
    brandId = response.body.id;
  });

  test('PUT replaces the brand', async ({ request }, testInfo) => {
    const client = new ApiClient(request, testInfo);
    const payload = brandPayload(api.brand.updatedPrefix);
    const response = await client.put(url(), { data: payload });
    expectResponse(response, { status: api.expected.update.status, schema: 'success' });
    expect((await client.get(url())).body).toMatchObject(payload);
  });

  test('PATCH changes only the name', async ({ request }, testInfo) => {
    const client = new ApiClient(request, testInfo);
    const { name } = brandPayload(api.brand.patchedPrefix);
    const response = await client.patch(url(), { data: { name } });
    expectResponse(response, { status: api.expected.patch.status, schema: 'success' });
    expect((await client.get(url())).body.name).toBe(name);
  });

  test('DELETE removes the brand', async ({ request }, testInfo) => {
    const client = new ApiClient(request, testInfo);
    const response = await client.delete(url(), { token: adminToken });
    expectResponse(response, { status: api.expected.delete.status });
    expect((await client.get(url())).status).toBe(api.expected.notFound.status);
    brandId = undefined;
  });
});

test.describe('API: negative', () => {
  test('GET unknown brand returns 404', async ({ request }, testInfo) => {
    const response = await new ApiClient(request, testInfo).get(`${api.endpoints.brands}/${api.expected.notFound.id}`);
    expectResponse(response, { status: api.expected.notFound.status });
    expect(response.body.message).toBeTruthy();
  });
});
