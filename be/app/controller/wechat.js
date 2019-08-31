(function() {
  const Controller = require('egg').Controller;
  const wechat = require('co-wechat');
  const _ = require('lodash');

  class DreamAnalyzer extends Controller {
    async wx() {
      let es = this.ctx.app.esClient();
      const config = {
        token: 'c1z5m9',
        appid: 'wx78b1370c631699d9',
        encodingAESKey: 'aZWNnoBUozDikJ9YFj880D97wkzmaw2cFKn0JpuCf06'
      };
      let wxCfg = this.config.wechat || { "debug": false };

      function getQuery(query) {
        query = query || {};
        let base_query = {
          "index": "dream",
          "from": 0,
          "size": 10,
          "sort": [],
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
        // 默认使用query_string,后续可能会扩展更多语法
        if (!_.isEmpty(query.q)) {
          base_query.body.query.bool.must = [{
            "query_string": {
              "query": query.q,
              "fields": ["text"],
              "default_operator": "AND",
              "minimum_should_match": '75%'
            }
          }];
        }
        // console.log('base_query:',base_query);
        return base_query;
      }

      function getType(type) {
        let map = {
          "general": "通俗",
          "psychology": "古籍",
          "psychology": "心理"
        };
        let name = map[type];
        if (name) {
          return name;
        } else {
          return '通俗';
        }
      }
      let reg = /(www\.zgjm\.org|zgjm\.org|https?\:\/\/|\/|\\)/gim;

      function rmTerms(text) {
        return text.replace(reg, "");
      }

      function resultHandle(result) {
        // console.log(JSON.stringify(result, null, 2));
        let tmp = {
          "general": [],
          "traditional": [],
          "psychology": []
        };
        let replyStr = '';
        if (!_.isEmpty(result.body.hits) && result.body.hits.hits.length > 0) {
          _.each(result.body.hits.hits, function(v, k, l) {
            tmp[v._source.tag].push(rmTerms(v._source.text));
          });
          replyStr = `[通俗说]:\n${tmp.general.join('\n')}\n`;
          if (!_.isEmpty(tmp.traditional)) {
            replyStr += `[典籍记]:\n${tmp.traditional.join('\n')}\n`;
          }
          if (!_.isEmpty(tmp.psychology)) {
            replyStr += `[心理学]:\n${tmp.psychology.join('\n')}\n`;
          }

        } else {
          replyStr = '本条内容未找到相关解释,请换个关键词重试吧';
        }
        return replyStr;
        // console.log(JSON.stringify(ret, null, 2));
      }
      async function handle(wxMsg, ctx) {

        /*
          wxMsg 格式为:
          {
            ToUserName: 'gh_7f52e5c68d22',
            FromUserName: 'o-UsPuNo7LOoC5j37gQWbfgDdFX4',
            CreateTime: '1567263413',
            MsgType: 'text',
            Content: '来自微信的消息',
            MsgId: '22437815873804424'
          }
        */
        // console.log('微信消息为: ', wxMsg);
        try {
          let result = await es.search(getQuery({ "q": wxMsg.Content }));
          // console.log('查询结果: ', JSON.stringify(result, null, 2));
          let replyMsg = resultHandle(result);
          return { type: "text", content: replyMsg };
        } catch (e) {
          console.log('查询失败; ', e);
          // this.ctx.body = '查询服务暂时不可用,可通知管理员: chzhm159@163.com 多谢';
          return { type: "text", content: '查询服务暂时不可用,可通知管理员: chzhm159@163.com 多谢' };
        }

        return { type: "text", content: '数据暂未对接,功能还在继续开发中' };
      }
      // console.log('wx.debug=',wxCfg.debug);
      await wechat(config, wxCfg.debug).middleware(handle)(this.ctx);
    };

    async rest() {
      this.ctx.body = `success`;
    }
  }

  module.exports = DreamAnalyzer;
})();