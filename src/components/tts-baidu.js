/**
 * Created by zppro on 17-12-26.
 */

import { responser } from 'cube-brick';
import utils from 'cube-brick';

export const defaultOptions = {
  oAuth: {app_id: '10583778', api_key: 'Ol6kuQXjTRruvi6cXU6gpTUS', secret_key: 'dgCBG2IIB5dGxg41srbW0hAuFlwOFgWK'}
}

const ttsBaidu = {
  init: function (options = defaultOptions) {
    if(!options.oAuth) {
      options.oAuth = defaultOptions.oAuth;
    }
    let AipSpeechClient = require("baidu-aip-sdk").speech;
    // const asr_APP_ID = options.oAuth.app_id, asr_API_KEY = options.oAuth.api_key, asr_SECRET_KEY = options.oAuth.secret_key;
    this.tts_client = new AipSpeechClient(options.oAuth.app_id, options.oAuth.api_key, options.oAuth.secret_key);
  },
  generate: async function (text) {
    if (!text) {
      return responser.error({message: `没有text`});
    }
    // 识别本地文件
    let ret = await this.tts_client.text2audio(text);
    // console.log('<text2audio>: ' + ret);
    let stream = utils.createReadStream(ret.data)
    return ret.err_no === undefined ? stream : responser.error({
      code: ret.err_no,
      msg: ret.err_msg
    });
  }
}

export default ttsBaidu;
