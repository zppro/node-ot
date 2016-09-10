/**
 * app Created by zppro on 16-8-31.
 * Target:入口
 */
import http from 'http';
import url from 'url';
import path from 'path';
import qr from 'qr-image';
import sharp from 'sharp';
import co from 'co';
import streamToArray from 'stream-to-array';
import 'babel-polyfill';//执行模块，特别是需要用到定义的全局变量给es5使用

const getEI = (eiUrl) => {

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


var server = http.createServer(function (req, res) {
    co(function*() {

        let query = url.parse(req.url, true).query;
        if (query.text) {
            try {
                res.writeHead(200, {'Content-Type': 'image/png'});
                let img = qr.image(query.text, {size: 10,ec_level:'H'});
                let arrQR = yield streamToArray(img);
                let buffers = arrQR.map(function(o) {
                    return o instanceof Buffer ? o : new Buffer(o);
                });
                let bufferQR = Buffer.concat(buffers);
                let qrStream = sharp(bufferQR);
                let qrInfo = yield qrStream.metadata();

                let iconStream,iconBuffer;
                if(query.ei){
                    let eiBuffer = yield getEI(query.ei);
                    iconStream = sharp(eiBuffer);
                }
                else{
                    iconStream = sharp(path.join(__dirname,'img/05.jpg'));
                }

                iconBuffer = yield iconStream
                    .resize(Math.round(qrInfo.width/5),Math.round(qrInfo.height/5))
                    .background({r:255,g:255,b:255,a:1})
                    .extend(2)
                    .toBuffer();
                let compositStream = qrStream.overlayWith(iconBuffer);

                compositStream.pipe(res);
            } catch (e) {
                console.log(e);
                res.writeHead(414, {'Content-Type': 'text/html'});
                res.end('<h1>414 Request-URI Too Large' + e.message + '</h1>');
            }
        }
    });
});
server.listen(9999);
console.log('listen 9999...');