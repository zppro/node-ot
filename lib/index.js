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
var getEI = function getEI(eiUrl) {

    return new Promise(function (reslove, reject) {
        var urlObj = _url2.default.parse(eiUrl, true);
        var req = _http2.default.request({
            hostname: urlObj.host,
            port: urlObj.port || 80,
            path: urlObj.pathname
        }, function (res) {
            var body = '';
            res.setEncoding('binary');
            res.on('end', function () {
                reslove(new Buffer(body, 'binary'));
            });
            res.on('data', function (chunk) {
                if (res.statusCode == 200) {
                    body += chunk;
                }
            });
        });
        req.on('error', function (e) {
            reject(e.message);
        });
        req.end();
    });
};

var server = _http2.default.createServer(function (req, res) {
    (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
        var query, img, arrQR, buffers, bufferQR, qrStream, qrInfo, iconStream, iconBuffer, eiBuffer, compositStream;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        query = _url2.default.parse(req.url, true).query;

                        if (!query.text) {
                            _context.next = 36;
                            break;
                        }

                        _context.prev = 2;

                        res.writeHead(200, { 'Content-Type': 'image/png' });
                        img = _qrImage2.default.image(query.text, { size: 10, ec_level: 'H' });
                        _context.next = 7;
                        return (0, _streamToArray2.default)(img);

                    case 7:
                        arrQR = _context.sent;
                        buffers = arrQR.map(function (o) {
                            return o instanceof Buffer ? o : new Buffer(o);
                        });
                        bufferQR = Buffer.concat(buffers);
                        qrStream = (0, _sharp2.default)(bufferQR);
                        _context.next = 13;
                        return qrStream.metadata();

                    case 13:
                        qrInfo = _context.sent;
                        iconStream = void 0, iconBuffer = void 0;

                        if (!query.ei) {
                            _context.next = 22;
                            break;
                        }

                        _context.next = 18;
                        return getEI(query.ei);

                    case 18:
                        eiBuffer = _context.sent;

                        iconStream = (0, _sharp2.default)(eiBuffer);
                        _context.next = 23;
                        break;

                    case 22:
                        iconStream = (0, _sharp2.default)(_path2.default.join(__dirname, 'img/05.jpg'));

                    case 23:
                        _context.next = 25;
                        return iconStream.resize(Math.round(qrInfo.width / 5), Math.round(qrInfo.height / 5)).background({ r: 255, g: 255, b: 255, a: 1 }).extend(2).toBuffer();

                    case 25:
                        iconBuffer = _context.sent;
                        compositStream = qrStream.overlayWith(iconBuffer);


                        compositStream.pipe(res);
                        _context.next = 36;
                        break;

                    case 30:
                        _context.prev = 30;
                        _context.t0 = _context['catch'](2);

                        console.log(_context.t0);
                        console.dir(_context.t0);
                        res.writeHead(414, { 'Content-Type': 'text/html' });
                        res.end('<h1>414 error:' + _context.t0 + '</h1>');

                    case 36:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[2, 30]]);
    }));
});
server.listen(9999);
console.log('listen 9999...');