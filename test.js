const express = require('express');
const axiosTest = require('./');

describe('axiosTest', () => {
  test('takes a function', () => {
    return axiosTest(function(req, res) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('hello world');
    })
      .get('/')
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.data).toEqual('hello world');
      });
  });

  test('takes an app', () => {
    const app = express();
    app.get('/hello', (req, res) => res.send('Hello World!'));

    return axiosTest(app.listen())
      .get('/hello')
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.data).toEqual('Hello World!');
      });
  });

  test('takes an app starts calls `listen` if not already listening', () => {
    const app = express();
    app.get('/listen', (req, res) => res.send('listen'));

    return axiosTest(app)
      .get('/listen')
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.data).toEqual('listen');
      });
  });
});
