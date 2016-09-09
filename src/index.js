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

var server = http.createServer(function (req, res) {
    co(function*() {

        if (req.url.startsWith('/?text')) {
            let text = url.parse(req.url, true).query.text;
            try {

                var img = qr.image(text, {size: 10});

                let buffer = yield sharp(path.join(__dirname,'img/05.jpg')).toBuffer()

                

                res.writeHead(200, {'Content-Type': 'image/png'});
                img.pipe(res);
            } catch (e) {
                res.writeHead(414, {'Content-Type': 'text/html'});
                res.end('<h1>414 Request-URI Too Large' + text + '</h1>');
            }
        }
    });
});
server.listen(9999);
console.log('listen 9999...');