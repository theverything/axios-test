const assert = require('assert');

module.exports = {
  expectStatus(expected) {
    return response => {
      const actual = response.status;
      try {
        assert.strictEqual(actual, expected);
      } catch (error) {
        error.name = 'Error';
        error.showDiff = true;

        return Promise.reject(error);
      }

      return response;
    };
  },
  expectData(expected) {
    return response => {
      const actual = response.data;
      try {
        assert.deepStrictEqual(actual, expected);
      } catch (error) {
        error.name = 'Error';
        error.showDiff = true;

        return Promise.reject(error);
      }

      return response;
    };
  },
};
