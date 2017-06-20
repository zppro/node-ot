/**
 * Created by zppro on 17-6-19.
 */
import http from 'http';
import url from 'url';

import qr from 'qr-image';
import sharp from 'sharp';
import streamToArray from 'stream-to-array';

import utils from './utils'

const _getRemoteImg = (eiUrl) => {

    return new Promise(function(reslove,reject){
        let urlObj = url.parse(eiUrl, true);
        var req = http.request({
            hostname: urlObj.host,
            port :urlObj.port || 80,
            path:urlObj.pathname
        },(res)=>{
            let body = '';
            res.setEncoding('binary');
            res.on('end',()=>{
                reslove(new Buffer(body,'binary'));
            });
            res.on('data',(chunk)=>{
                if(res.statusCode == 200){
                    body+= chunk;
                }
            });

        });
        req.on('error',(e)=>{
            reject(e.message);
        });
        req.end();

    });
};


const getQRStream = async(qrText, qrEI) => {
    if(utils.isObject(qrText)) {
        qrText = JSON.stringify(qrText);
    }
    if(utils.isObject(qrEI)) {
        qrEI = JSON.stringify(qrEI);
    }
    let img = qr.image(qrText, {size: 10,ec_level:'H'});
    let arrQR = await streamToArray(img);
    let buffers = arrQR.map(function(o) {
        return o instanceof Buffer ? o : new Buffer(o);
    });
    let bufferQR = Buffer.concat(buffers);
    let qrStream = sharp(bufferQR);

    if(qrEI){
        let iconStream,iconBuffer;
        let eiBuffer = await _getRemoteImg(qrEI);
        iconStream = sharp(eiBuffer);
        let qrInfo = await qrStream.metadata();
        iconBuffer = await iconStream
            .resize(Math.round(qrInfo.width/5),Math.round(qrInfo.height/5))
            .background({r:255,g:255,b:255,a:1})
            .extend(2)
            .toBuffer();
        //const rect = new Buffer(
        //    '<svg><rect x="0" y="0" width="100%" height="100%" rx="50" ry="50"/></svg>'
        //);
        return qrStream.overlayWith(iconBuffer);//.overlayWith(rect, { cutout: true });
    } else {
        return qrStream;
    }
};

export default {
    getQRStream: getQRStream
}