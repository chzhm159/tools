(async function() {
  const { Client } = require('@elastic/elasticsearch');
  const _ = require('lodash');
  const util = require('util');

  let es = new Client({
    node: 'http://localhost:9200',
    maxRetries: 1,
    requestTimeout: 3000,
    sniffOnStart: true
  });

  let base_query = {
    "index": "dream",
    "from": 0,
    "size": 200,
    // "sort": [],
    "scroll": "1m",
    "body": {
      "query": {
        "bool": {
          "must": [{
            "match_all": {}
          }],
          "must_not": [],
          "should": []
        }
      }
    }
  };
  try {
    let scrollId = "";
    let delList = [];
    // let regex = /梦见(.{2,4})(周公解梦|心理学解梦)/;
    let regex = /原版周公解梦梦见(.){1,4}/gim;
    let num = 0;

    function isInvalidData(docs) {
      _.each(docs.hits, function(d, k) {
        num++;
        let test = regex.test(d._source.text);
        if (test) {
          console.log(num, ': 无效数据: ', d._source.text);
          delList.push(d._id);
        }
      });
    }
    let count = await es.count({ index: "dream" }); // 65771
    let total = count.body.count;
    let r1 = await es.search(base_query);
    let scrollID = r1.body._scroll_id;
    let taskSize = total / 100;
    console.log('总数据量为: ', total, ' 需要翻页: ', taskSize);
    isInvalidData(r1.body.hits);

    for (let i = 0; i <= taskSize; i++) {
      let r2 = await es.scroll({
        scrollId: scrollID,
        scroll: '1m'
      });
      isInvalidData(r2.body.hits);
    }
    console.log('总共需要删除的doc 为: ', delList);
  } catch (err) {
    console.log("异常", util.inspect(err, { "depth": 5 }));
  }
})();