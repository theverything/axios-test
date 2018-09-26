# axios-test

[![Build Status](https://travis-ci.org/theverything/axios-test.svg?branch=master)](https://travis-ci.org/theverything/axios-test)
[![Coverage Status](https://coveralls.io/repos/github/theverything/axios-test/badge.svg?branch=master)](https://coveralls.io/github/theverything/axios-test?branch=master)
[![npm version](https://badge.fury.io/js/axios-test.svg)](https://badge.fury.io/js/axios-test)

Kinda like super-test but with axios

## Usuage

```javascript
// app.js
const express = require('express');
const app = express();

app.get('/hello', (req, res) => res.send('Hello World!'));

module.exports = app;

// test.js
const axiosTest = require('axios-test');
const { expectStatus, expectData } = require('axios-test/expect');
const app = require('./app');

return axiosTest(app.listen())
  .get('/hello')
  .expectStatus(200)
  .expectData('Hello World!')
  .then(resp => {
    // do what you want with the response
  });
```

All response errors are resolved rather than rejected.

```javascript
// app.js
const express = require('express');
const app = express();

app.get('/hello', (req, res) => res.send('Hello World!'));

module.exports = app;

// test.js
const axiosTest = require('axios-test');
const { expectStatus } = require('axios-test/expect');
const app = require('./app');

return axiosTest(app.listen())
  .get('/nope')
  .expectStatus(404)
  .then();
```

## License

Copyright 2018 Jeffrey Horn

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
