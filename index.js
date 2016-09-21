const axios = require('axios');
const http = require('http');
const { resolve } = require('url');

module.exports = function axiosTest(app) {
  if (typeof app === 'function') {
    app = http.createServer(app);
  }

  const server = (app.address && app.address()) ? app : app.listen(0);
  const port = server.address().port;
  const host = `http://127.0.0.1:${port}/`;

  function handleError(error) {
    server.close();
    return Promise.reject(error);
  }

  const instance = axios.create();

  instance.interceptors.request.use(
    (config) => {
      const { url } = config;

      return Object.assign({}, config, { url: resolve(host, url) });
    },
    handleError
  );

  instance.interceptors.response.use(
    (response) => {
      server.close();
      return Promise.resolve(response);
    },
    handleError
  );

  return instance;
}
