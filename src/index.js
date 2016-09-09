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
import streamBuffers from 'stream-buffers';
import streamToArray from 'stream-to-array';


var server = http.createServer(function (req, res) {
    co(function*() {

        if (req.url.startsWith('/?text')) {
            let text = url.parse(req.url, true).query.text;
            try {

                var img = qr.image(text, {size: 10});

                let arrQR = yield streamToArray(img);
                let buffers = arrQR.map(function(o) {
                    return o instanceof Buffer ? o : new Buffer(o);
                });
                let bufferQR = Buffer.concat(buffers);

                let buffer = yield sharp(bufferQR).overlayWith(path.join(__dirname,'img/05.jpg')).toBuffer();

                let myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
                    frequency: 10,       // in milliseconds.
                    chunkSize: 2048     // in bytes.
                });

                myReadableStreamBuffer.put(buffer);
                res.writeHead(200, {'Content-Type': 'image/png'});
                myReadableStreamBuffer.pipe(res);
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