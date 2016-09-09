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


var server = http.createServer(function (req, res) {
    co(function*() {

        if (req.url.startsWith('/?text')) {
            let text = url.parse(req.url, true).query.text;
            try {

                let img = qr.image(text, {size: 10,ec_level:'H'});
                let arrQR = yield streamToArray(img);
                let buffers = arrQR.map(function(o) {
                    return o instanceof Buffer ? o : new Buffer(o);
                });
                let bufferQR = Buffer.concat(buffers);
                let iconBuffer = yield sharp(path.join(__dirname,'img/05.jpg')).resize(57,57).toBuffer();
                let compositStream = sharp(bufferQR).overlayWith(iconBuffer);

                res.writeHead(200, {'Content-Type': 'image/png'});
                compositStream.pipe(res);
            } catch (e) {
                console.log(e);
                res.writeHead(414, {'Content-Type': 'text/html'});
                res.end('<h1>414 Request-URI Too Large' + text + '</h1>');
            }
        }
    });
});
server.listen(9999);
console.log('listen 9999...');