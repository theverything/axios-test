const axios = require('axios');
const http = require('http');
const { resolve } = require('url');
const assert = require('assert');

function expectStatus(response, expected) {
  const actual = response.status;
  try {
    assert.strictEqual(actual, expected);
  } catch (error) {
    error.name = 'expectStatus';
    error.showDiff = true;

    throw error;
  }
}

function expectData(response, expected) {
  const actual = response.data;
  try {
    assert.deepStrictEqual(actual, expected);
  } catch (error) {
    error.name = 'expectData';
    error.showDiff = true;

    throw error;
  }
}

function expect(response, ctx) {
  if (ctx.expectedStatus) {
    expectStatus(response, ctx.expectedStatus);
  }

  if (ctx.expectedData) {
    expectData(response, ctx.expectedData);
  }

  return response;
}

class AxiosTest {
  constructor(instance) {
    this.instance = instance;
    this.req = null;
    this.expectedStatus = null;
    this.expectedData = null;
  }

  expectStatus(status) {
    this.expectedStatus = status;
    return this;
  }

  expectData(data) {
    this.expectedData = data;
    return this;
  }

  request(...args) {
    this.req = this.instance.request(...args);
    return this;
  }

  get(...args) {
    this.req = this.instance.get(...args);
    return this;
  }

  delete(...args) {
    this.req = this.instance.delete(...args);
    return this;
  }

  head(...args) {
    this.req = this.instance.head(...args);
    return this;
  }

  options(...args) {
    this.req = this.instance.options(...args);
    return this;
  }

  post(...args) {
    this.req = this.instance.post(...args);
    return this;
  }

  put(...args) {
    this.req = this.instance.put(...args);
    return this;
  }

  patch(...args) {
    this.req = this.instance.patch(...args);
    return this;
  }

  then(res, rej) {
    return this.req.then(resp => expect(resp, this)).then(res, rej);
  }
}

module.exports = function axiosTest(app) {
  if (typeof app === 'function') {
    // eslint-disable-next-line no-param-reassign
    app = http.createServer(app);
  }

  const server = app.address && app.address() ? app : app.listen(0);
  const { port } = server.address();
  const host = `http://127.0.0.1:${port}/`;

  function handleError(error) {
    server.close();

    // istanbul ignore else
    if (error.response) {
      return Promise.resolve(error.response);
    }

    // istanbul ignore next
    return Promise.reject(error);
  }

  const instance = axios.create();

  instance.interceptors.request.use(config => {
    const { url } = config;

    return Object.assign({}, config, { url: resolve(host, url) });
  }, handleError);

  instance.interceptors.response.use(response => {
    server.close();
    return Promise.resolve(response);
  }, handleError);

  return new AxiosTest(instance);
};
