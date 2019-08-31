(function() {
  const { Client } = require('@elastic/elasticsearch');
  const _ = require('lodash');
  let esInsts = null;

  module.exports = {
  	// this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
    esClient() {
    	if(_.isEmpty(esInsts)){
    		// console.log('es 默认配置: ',this.config.esConfig);
    		esInsts = new Client(this.config.esConfig);
    	}
      return esInsts;
    },
    createESInstances(opt) {
      opt = opt || {};
      let tmpCfg = {};
      _.extend(_.extend(tmpCfg,this.config.esConfig),opt);
      return new Client(opt);
    }
  };
})();