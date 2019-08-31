(function() {
  module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    router.get('/wechat', controller.wechat.search);
    router.post('/wechat', controller.wechat.search);
  };
})();