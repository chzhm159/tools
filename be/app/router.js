(function() {
  module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    // 此路由应对普通http请求
    router.get('/wechat', controller.wechat.rest);
    // 此接口对应微信服务器的请求
    router.post('/wechat', controller.wechat.wx);
  };
})();