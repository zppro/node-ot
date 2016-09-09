/**
 * app Created by zppro on 16-8-31.
 * Target:入口
 */
import http from 'http';
import url from 'url';
import path from 'path';
import path from 'path';
import qr from 'qr-image';
import sharp from 'sharp';

var server = http.default.createServer(function (req, res) {
    try {

        if (req.url.startsWith('/?text')) {
            var text = _url2.default.parse(req.url, true).query.text;
            try {
                console.log(text);
                var img = _qrImage2.default.image(text, { size: 20, customize: addlogo });

                console.log(1);
                var o = GetEmbedded(_path2.default.join(__dirname, 'img/logo-single.png'));

                console.log(3);
                console.log(o.then(function (a, b) {
                    console.log(a);
                    console.log(b);
                }));

                res.writeHead(200, { 'Content-Type': 'image/png' });
                img.pipe(res);
            } catch (e) {
                res.writeHead(414, { 'Content-Type': 'text/html' });
                res.end('<h1>414 Request-URI Too Large' + text + '</h1>');
            }
        }
    } catch (err) {
        res.end(err.toString());
    }
});
server.listen(9999);
console.log('listen 9999...');