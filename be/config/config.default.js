exports.cluster = {
  listen: {
    port: 7001,
    workers:2,
    daemon:true,
    hostname: '127.0.0.1',
    title:"eggjs-dream-dev"
  }
}

exports.keys = "dmrea";

exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.tpl': 'nunjucks',
  },
};
exports.middleware = ['page404'];

exports.esConfig = {
  node: 'http://localhost:9200',
  maxRetries: 3,
  requestTimeout: 60000,
  sniffOnStart: true
};

exports.security = {
  csrf: {
    refererWhiteList: [],       // referer white list
  },
}

