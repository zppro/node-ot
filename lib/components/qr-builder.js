'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _qrImage = require('qr-image');

var _qrImage2 = _interopRequireDefault(_qrImage);

var _sharp = require('sharp');

var _sharp2 = _interopRequireDefault(_sharp);

var _streamToArray = require('stream-to-array');

var _streamToArray2 = _interopRequireDefault(_streamToArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Created by zppro on 17-6-19.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */


var _getRemoteImg = function _getRemoteImg(eiUrl) {

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

var getQRStream = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(qrText, qrEI) {
        var img, arrQR, buffers, bufferQR, qrStream, iconStream, iconBuffer, eiBuffer, qrInfo;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        img = _qrImage2.default.image(qrText, { size: 10, ec_level: 'H' });
                        _context.next = 3;
                        return (0, _streamToArray2.default)(img);

                    case 3:
                        arrQR = _context.sent;
                        buffers = arrQR.map(function (o) {
                            return o instanceof Buffer ? o : new Buffer(o);
                        });
                        bufferQR = Buffer.concat(buffers);
                        qrStream = (0, _sharp2.default)(bufferQR);

                        if (!qrEI) {
                            _context.next = 22;
                            break;
                        }

                        iconStream = void 0, iconBuffer = void 0;
                        _context.next = 11;
                        return _getRemoteImg(qrEI);

                    case 11:
                        eiBuffer = _context.sent;

                        iconStream = (0, _sharp2.default)(eiBuffer);
                        _context.next = 15;
                        return qrStream.metadata();

                    case 15:
                        qrInfo = _context.sent;
                        _context.next = 18;
                        return iconStream.resize(Math.round(qrInfo.width / 5), Math.round(qrInfo.height / 5)).background({ r: 255, g: 255, b: 255, a: 1 }).extend(2).toBuffer();

                    case 18:
                        iconBuffer = _context.sent;
                        return _context.abrupt('return', qrStream.overlayWith(iconBuffer));

                    case 22:
                        return _context.abrupt('return', qrStream);

                    case 23:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getQRStream(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

exports.default = {
    getQRStream: getQRStream
};