const express = require('express');
const axiosTest = require('./');

describe('axiosTest', () => {
  test('takes a function', () =>
    axiosTest((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('hello world');
    })
      .get('/')
      .expectStatus(200)
      .expectData('hello world')
      .then());

  test('takes an app', () => {
    const app = express();
    app.get('/hello', (req, res) => res.send('hello world'));

    return axiosTest(app.listen())
      .get('/hello')
      .expectStatus(200)
      .expectData('hello world')
      .then();
  });

  test('takes an app starts calls `listen` if not already listening', () => {
    const app = express();
    app.get('/listen', (req, res) => res.send('listen'));

    return axiosTest(app)
      .get('/listen')
      .expectStatus(200)
      .expectData('listen');
  });

  test('resolves http errors', () => {
    const app = express();

    return axiosTest(app)
      .get('/nope')
      .expectStatus(404)
      .then();
  });

  ['get', 'delete', 'options', 'post', 'put', 'patch'].forEach(method => {
    test(`calls axios method ${method}`, () => {
      const app = express();
      app[method]('/foo', (req, res) => res.send('foo'));

      return axiosTest(app)
        [method]('/foo')
        .expectStatus(200)
        .expectData('foo')
        .then();
    });
  });

  test(`calls axios method request`, () => {
    const app = express();
    app.get('/foo', (req, res) => res.send('foo'));

    return axiosTest(app)
      .request({ method: 'get', url: '/foo' })
      .expectStatus(200)
      .expectData('foo')
      .then();
  });

  test(`calls axios method head`, () => {
    const app = express();
    app.head('/foo', (req, res) => res.send('foo'));

    return axiosTest(app)
      .head('/foo')
      .expectStatus(200)
      .expectData('')
      .then();
  });

  test(`returns the response if expectations succeed`, () => {
    const app = express();
    app.get('/foo', (req, res) => res.send('foo'));

    return expect(
      axiosTest(app)
        .get('/foo')
        .expectStatus(200)
        .expectData('foo'),
    ).resolves.toEqual(
      expect.objectContaining({
        config: expect.any(Object),
        data: expect.anything(),
        headers: expect.any(Object),
        request: expect.any(Object),
      }),
    );
  });

  test(`expectStatus throws if expectations fail`, () => {
    const app = express();
    app.get('/bar', (req, res) => res.send('foo'));

    return expect(
      axiosTest(app)
        .get('/foo')
        .expectStatus(200),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  test(`expectData throws if expectations fail`, () => {
    const app = express();
    app.get('/foo', (req, res) => res.send('foo'));

    return expect(
      axiosTest(app)
        .get('/foo')
        .expectData('bar'),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
