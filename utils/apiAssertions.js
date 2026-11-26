const { expect } = require('@playwright/test');
const api = require('../data/api.json');
const { validateSchema } = require('./schemaValidator');

/** Checks status, headers, response time and (optionally) the JSON schema. */
function expectResponse(response, { status, schema }) {
  expect(response.status, JSON.stringify(response.body)).toBe(status);
  expect(response.duration, 'response time (ms)').toBeLessThan(api.maxResponseTimeMs);
  if (status !== 204) expect(response.headers['content-type']).toContain(api.contentType);
  if (schema) {
    const result = validateSchema(schema, response.body);
    expect(result.valid, result.errors).toBe(true);
  }
}

module.exports = { expectResponse };
