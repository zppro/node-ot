/**
 * Created by zppro on 17-6-19.
 */
import log4js from 'log4js';
import asrBuilder from '../components/asr-baidu';

// import fs from 'fs';
// import path from 'path';
// import utils, { h } from 'cube-brick';
// var AipSpeechClient = require("baidu-aip-sdk").speech;

const asrService = {
  init: function (routerUrl, initOptions) {

    this.routerUrl = routerUrl;
    initOptions = initOptions || {};

    // console.log(`this.routerUrl:${this.routerUrl}`)

    let self = this;

    this.logger4js = log4js.getLogger(initOptions.log_name || ('svc_' + __filename.substr(__filename.lastIndexOf('/') + 1)));
    this.logger4js.info(__filename + " loaded!");

    asrBuilder.init();
    // let AipSpeechClient = require("baidu-aip-sdk").speech;
    // this.asr_client = new AipSpeechClient('10427930', 'lCw3DGO3MYeENm5lrGMbaHL7', '36263bd51905fa46cfa16200624c7827');

    this.actions = [
      {
        method: 'wx',
        verb: 'get',
        url: this.routerUrl + '/wx',
        handler: function (app, options) {
          return async (ctx, next) => {
            try {
              ctx.body = await asrBuilder.translate(ctx.query.r);


            } catch (e) {
              app.combinedLogger.log(self.logger4js, e);
              ctx.body = app.wrapper.res.error(e);
            }
            await next;
          };
        }
      },
      {
        method: 'asr',
        verb: 'get',
        url: this.routerUrl + '/asr',
        handler: function (app, options) {
          return async (ctx, next) => {
            try {

              // 检查工具链
              // let relativeDecoderRoot = 'node_modules/silk-v3-decoder-zppro';
              // let converterSH = `${relativeDecoderRoot}/converter.sh`;
              // if (!fs.existsSync(converterSH)) {
              //   ctx.body = app.wrapper.res.error({message: `没有converter.sh`});
              //   await next;
              //   return;
              // }
              //
              // let remoteResourceUrl = ctx.query.r || 'https://img2.okertrip.com/voice/wxfile/store_5e0528cd3fb960e4eb1ada3ca748f0be.silk';
              // console.log('remoteResourceUrl:', remoteResourceUrl);
              //
              // const fileRet = await h.getRemoteResourceFile(remoteResourceUrl, path.resolve('assets'));
              // if (!fileRet.success) {
              //   ctx.body = fileRet;
              //   await next;
              //   return;
              // }
              //
              // const silk_file = fileRet.ret
              // // console.log('file:', silk_file);
              // // console.log('cwd:', process.cwd());
              // let cwd_converter = path.join(process.cwd(), `/${relativeDecoderRoot}`);
              // // console.log('cwd_converter:', cwd_converter);
              // const {stdout, stderr} = await utils.execP(`sh ${cwd_converter}/converter.sh ${silk_file} wav`, {cwd: cwd_converter});
              // console.log('out>>>', stdout);
              // // console.error('err>>>',stderr);
              //
              // // const a = await asrBuilder.getRemoteResourceBuffer(remoteResourceUrl)
              // let wav_file = silk_file.substr(0, silk_file.lastIndexOf('.')) + '.wav'
              // console.log('wav_file:', wav_file);
              // let voice = fs.readFileSync(wav_file);
              // let voiceBuffer = new Buffer(voice);
              //
              // // 识别本地文件
              // let ret = await self.asr_client.recognize(voiceBuffer, 'wav', 16000);
              // console.log('<recognize>: ' + JSON.stringify(ret));
              // ctx.body = ret.err_no === 0 ? app.wrapper.res.ret(ret.result.length>0?ret.result[0]: '') : app.wrapper.res.error({code: ret.err_no, msg: ret.err_msg})

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

export default asrService;
