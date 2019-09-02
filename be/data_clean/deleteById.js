(async function() {
  const { Client } = require('@elastic/elasticsearch');
  const _ = require('lodash');
  const util = require('util');
  let delList = [];

  let es = new Client({
    node: 'http://localhost:9200',
    maxRetries: 1,
    requestTimeout: 3000,
    sniffOnStart: true
  });
  let size = delList.length;
  for (let i = 0; i < size; i++) {
    let id = delList[i];
    let ack = await es.delete({
      index: "dream",
      type: "_doc",
      id
    });
    console.log(ack);
  }

})();