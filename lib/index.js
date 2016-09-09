/**
 * app Created by zppro on 16-8-31.
 * Target:入口
 */
'use strict';

var GetEmbedded = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url) {
        var image;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        image = (0, _sharp2.default)(url);


                        console.log('GetEmbedded:' + url);
                        console.log(image);
                        _context.next = 5;
                        return image.toBuffer();

                    case 5:
                        return _context.abrupt('return', _context.sent);

                    case 6:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function GetEmbedded(_x) {
        return _ref.apply(this, arguments);
    };
}();

var _qrImage = require('qr-image');

var _qrImage2 = _interopRequireDefault(_qrImage);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _sharp = require('sharp');

var _sharp2 = _interopRequireDefault(_sharp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var addlogo = function addlogo(bitmap) {
    console.log('start add logo');

    console.log('end add logo');
};

var server = _http2.default.createServer(function (req, res) {
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