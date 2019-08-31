(function() {
  module.exports = () => {
    return async function notFoundHandler(ctx, next) {
      await next();
      if (ctx.status === 404 && !ctx.body) {
        if (ctx.acceptJSON) {
          ctx.body = { error: '没有此页面' };
        } else {
          ctx.body = '<h1>没有此页面</h1>';
        }
      }
    };
  };
})()