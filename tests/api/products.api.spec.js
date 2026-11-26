const { test, expect } = require('../../fixtures/test');
const api = require('../../data/api.json');
const { ApiClient } = require('../../utils/apiClient');
const { expectResponse } = require('../../utils/apiAssertions');

test.describe('API: products', () => {
  test('GET product list', async ({ request }, testInfo) => {
    const response = await new ApiClient(request, testInfo).get(api.endpoints.products);
    expectResponse(response, { status: api.expected.list.status, schema: 'productList' });
    expect(response.headers['cache-control']).toBeTruthy();
  });

  test('GET single product by id', async ({ request }, testInfo) => {
    const client = new ApiClient(request, testInfo);
    const list = await client.get(api.endpoints.products);
    const first = list.body.data[0];
    const response = await client.get(`${api.endpoints.products}/${first.id}`);
    expectResponse(response, { status: api.expected.item.status, schema: 'product' });
    expect(response.body).toMatchObject({ id: first.id, name: first.name });
  });
});
