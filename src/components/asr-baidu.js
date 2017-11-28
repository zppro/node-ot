/**
 * Created by zppro on 17-11-27.
 */
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import utils, { responser, h } from 'cube-brick';

export const defaultOptions = {
  oAuth: {app_id: '10427930', api_key: 'lCw3DGO3MYeENm5lrGMbaHL7', secret_key: '36263bd51905fa46cfa16200624c7827'}
}

const asrBaidu = {
  init: function (options = defaultOptions) {
    if(!options.oAuth) {
      options.oAuth = defaultOptions.oAuth;
    }
    let AipSpeechClient = require("baidu-aip-sdk").speech;
    // const asr_APP_ID = options.oAuth.app_id, asr_API_KEY = options.oAuth.api_key, asr_SECRET_KEY = options.oAuth.secret_key;
    this.asr_client = new AipSpeechClient(options.oAuth.app_id, options.oAuth.api_key, options.oAuth.secret_key);
  },
  translate: async function (resourceUrl){
    if(!resourceUrl){
      return responser.error({message: `没有resourceUrl`});
    }

    //检查工具链
    let relativeDecoderRoot = 'node_modules/silk-v3-decoder-zppro';
    let converterSH = `${relativeDecoderRoot}/converter.sh`;
    if (!fs.existsSync(converterSH)) {
      return responser.error({message: `没有converter.sh`});
    }
    // console.log('resourceUrl:', resourceUrl);
    fse.ensureDir(path.resolve('assets'));
    const fileRet = await h.getRemoteResourceFile(resourceUrl, path.resolve('assets'));
    if (!fileRet.success) {
      return fileRet
    }

    const silk_file = fileRet.ret
    // console.log('file:', silk_file);
    // console.log('cwd:', process.cwd());
    let cwd_converter = path.join(process.cwd(), `/${relativeDecoderRoot}`);
    // console.log('cwd_converter:', cwd_converter);
    const {stdout, stderr} = await utils.execP(`sh ${cwd_converter}/converter.sh ${silk_file} wav`, {cwd: cwd_converter});
    // console.log('out>>>', stdout);
    // console.error('err>>>',stderr);

    // const a = await asrBuilder.getRemoteResourceBuffer(remoteResourceUrl)
    let wav_file = silk_file.substr(0, silk_file.lastIndexOf('.')) + '.wav'
    // console.log('wav_file:', wav_file);
    let voice = fs.readFileSync(wav_file);
    let voiceBuffer = new Buffer(voice);

    // 识别本地文件
    let ret = await this.asr_client.recognize(voiceBuffer, 'wav', 16000);
    console.log('<recognize>: ' + JSON.stringify(ret));
    return ret.err_no === 0 ? responser.ret(ret.result.length>0?ret.result[0]: '') : responser.error({code: ret.err_no, msg: ret.err_msg});
  }
}

export default asrBaidu;
