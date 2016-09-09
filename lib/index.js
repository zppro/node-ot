'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _qrImage = require('qr-image');

var _qrImage2 = _interopRequireDefault(_qrImage);

var _sharp = require('sharp');

var _sharp2 = _interopRequireDefault(_sharp);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _streamToArray = require('stream-to-array');

var _streamToArray2 = _interopRequireDefault(_streamToArray);

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//执行模块，特别是需要用到定义的全局变量给es5使用


/**
 * app Created by zppro on 16-8-31.
 * Target:入口
 */
var server = _http2.default.createServer(function (req, res) {
    (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
        var text, img, arrQR, buffers, bufferQR, qrStream, qrInfo, iconBuffer, compositStream;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!req.url.startsWith('/?text')) {
                            _context.next = 26;
                            break;
                        }

                        text = _url2.default.parse(req.url, true).query.text;
                        _context.prev = 2;
                        img = _qrImage2.default.image(text, { size: 10, ec_level: 'H' });
                        _context.next = 6;
                        return (0, _streamToArray2.default)(img);

                    case 6:
                        arrQR = _context.sent;
                        buffers = arrQR.map(function (o) {
                            return o instanceof Buffer ? o : new Buffer(o);
                        });
                        bufferQR = Buffer.concat(buffers);
                        qrStream = (0, _sharp2.default)(bufferQR);
                        _context.next = 12;
                        return qrStream.metadata();

                    case 12:
                        qrInfo = _context.sent;
                        _context.next = 15;
                        return (0, _sharp2.default)(_path2.default.join(__dirname, 'img/05.jpg')).resize(Math.round(qrInfo.width / 5), Math.round(qrInfo.height / 5)).toBuffer();

                    case 15:
                        iconBuffer = _context.sent;
                        compositStream = qrStream.overlayWith(iconBuffer);


                        res.writeHead(200, { 'Content-Type': 'image/png' });
                        compositStream.pipe(res);
                        _context.next = 26;
                        break;

                    case 21:
                        _context.prev = 21;
                        _context.t0 = _context['catch'](2);

                        console.log(_context.t0);
                        res.writeHead(414, { 'Content-Type': 'text/html' });
                        res.end('<h1>414 Request-URI Too Large' + text + '</h1>');

                    case 26:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[2, 21]]);
    }));
});
server.listen(9999);
console.log('listen 9999...');