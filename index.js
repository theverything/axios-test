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
    this.expectedStatus = null;
    this.expectedData = null;
    this.method = null;
    this.args = null;
  }

  expectStatus(status) {
    this.expectedStatus = status;
    return this;
  }

  expectData(data) {
    this.expectedData = data;
    return this;
  }

  then(res, rej) {
    return this.instance[this.method](...this.args)
      .then(resp => expect(resp, this))
      .then(res, rej);
  }
}

module.exports = function axiosTest(app) {
  if (typeof app === 'function') {
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

  return new Proxy(new AxiosTest(instance), {
    get(target, name, receiver) {
      return name in target
        ? target[name]
        : function proxyFunc(...args) {
            target.method = name;
            target.args = args;
            return receiver;
          };
    },
  });
};
