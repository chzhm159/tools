(function() {
  const wechat = require('co-wechat');

  const config = {
    token: 'c1z5m9',
    appid: 'wx78b1370c631699d9',
    encodingAESKey: 'aZWNnoBUozDikJ9YFj880D97wkzmaw2cFKn0JpuCf06'
  };

  module.exports = options => {
    return async function gzip(ctx, next) {
      await next();
    };
  };
})();