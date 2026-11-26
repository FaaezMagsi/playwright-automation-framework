// Wrapper around Playwright's APIRequestContext that times, logs and reports every call.
const logger = require('./logger');

class ApiClient {
  constructor(request, testInfo) {
    this.request = request;
    this.testInfo = testInfo;
  }

  async send(method, url, { data, token, params } = {}) {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const started = Date.now();
    const response = await this.request.fetch(url, { method, data, params, headers });
    const duration = Date.now() - started;
    const text = await response.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }
    logger.info(`API ${method} ${url} -> ${response.status()} (${duration} ms)`);

    if (this.testInfo) {
      const safe = JSON.stringify({ method, url, request: data, status: response.status(), duration, response: body }, (key, value) =>
        /password|token/i.test(key) ? '***' : value, 2);
      await this.testInfo.attach(`${method} ${url}`, { body: safe, contentType: 'application/json' });
    }
    return { status: response.status(), headers: response.headers(), body, duration };
  }

  get(url, options) { return this.send('GET', url, options); }
  post(url, options) { return this.send('POST', url, options); }
  put(url, options) { return this.send('PUT', url, options); }
  patch(url, options) { return this.send('PATCH', url, options); }
  delete(url, options) { return this.send('DELETE', url, options); }
}

module.exports = { ApiClient };
