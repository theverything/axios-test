const express = require('express');
const axiosTest = require('./');
const { expectStatus, expectData } = require('./expect');

describe('axiosTest', () => {
  test('takes a function', () =>
    axiosTest((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('hello world');
    })
      .get('/')
      .then(expectStatus(200))
      .then(expectData('hello world')));

  test('takes an app', () => {
    const app = express();
    app.get('/hello', (req, res) => res.send('Hello World!'));

    return axiosTest(app.listen())
      .get('/hello')
      .then(expectStatus(200))
      .then(expectData('Hello World!'));
  });

  test('takes an app starts calls `listen` if not already listening', () => {
    const app = express();
    app.get('/listen', (req, res) => res.send('listen'));

    return axiosTest(app)
      .get('/listen')
      .then(expectStatus(200))
      .then(expectData('listen'));
  });

  test('resolves http errors', () => {
    const app = express();

    return axiosTest(app)
      .get('/nope')
      .then(expectStatus(404));
  });
});

describe('assertion helpers', () => {
  describe('expectstatus', () => {
    test('assertion passes and returns response', () =>
      expect(Promise.resolve({ status: 200 }).then(expectStatus(200))).resolves.toEqual({ status: 200 }));
    test('assertion fails and throws error', () =>
      expect(Promise.resolve({ status: 200 }).then(expectStatus(404))).rejects.toThrow());
  });

  describe('expectData', () => {
    test('assertion passes and returns response', () =>
      expect(Promise.resolve({ data: { foo: 'bar' } }).then(expectData({ foo: 'bar' }))).resolves.toEqual({
        data: { foo: 'bar' },
      }));
    test('assertion fails and throws error', () =>
      expect(Promise.resolve({ data: { foo: 'bar' } }).then(expectData({ foo: 'wrong' }))).rejects.toThrow());
  });
});
