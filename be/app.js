(function() {
  const fs = require('fs-extra');
  const path = require('path');

  const SOCKETFILE = path.resolve('/var/run/node-web-1.sock');

  async function startWebServer() {
    try {
      let socketfile = await fs.stat(SOCKETFILE);
      console.log('socketfile ', socketfile);
      if (socketfile) {
        await fs.unlink(SOCKETFILE);
      }
    } catch (err) {
      console.log('No leftover socket found.', err);
    }
  }
  startWebServer();

  
  class AppBootHook {
    constructor(app) {
      this.app = app;
    }
  }
  module.exports = AppBootHook;
})();