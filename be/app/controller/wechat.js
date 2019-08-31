(function() {
  const Controller = require('egg').Controller;
  const wechat = require('co-wechat');

  class DreamAnalyzer extends Controller {
    async wx() {
      let es = this.ctx.app.esClient();
      const config = {
        token: 'c1z5m9',
        appid: 'wx78b1370c631699d9',
        encodingAESKey: 'aZWNnoBUozDikJ9YFj880D97wkzmaw2cFKn0JpuCf06'
      };
      let wxCfg = this.config.wechat || {"debug":false};

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
        try {
          let esClusterhealth = await es.cluster.health();
        } catch (e) {
          this.ctx.body = '查询服务暂时不可用,可通知管理员: chzhm159@163.com 多谢';
          return;
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