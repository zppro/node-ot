/**
 * Created by zppro on 17-12-26.
 */
import log4js from 'log4js';
import ttsBuilder from '../components/tts-baidu';


const ttsService = {
  init: function (routerUrl, initOptions) {

    this.routerUrl = routerUrl;
    initOptions = initOptions || {};
    // console.log(`this.routerUrl:${this.routerUrl}`)
    let self = this;

    this.logger4js = log4js.getLogger(initOptions.log_name || ('svc_' + __filename.substr(__filename.lastIndexOf('/') + 1)));
    this.logger4js.info(__filename + " loaded!");

    ttsBuilder.init();

    this.actions = [
      {
        method: 'bd',
        verb: 'get',
        url: this.routerUrl + '/bd',
        handler: function (app, options) {
          return async (ctx, next) => {
            try {
              ctx.body = await ttsBuilder.generate(ctx.query.text);
            } catch (e) {
              app.combinedLogger.log(self.logger4js, e);
              ctx.body = app.wrapper.res.error(e);
            }
            await next;
          };
        }
      }
    ];
    return this;
  }
}

export default ttsService;
