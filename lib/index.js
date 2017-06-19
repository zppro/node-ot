'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _thunkify = require('thunkify');

var _thunkify2 = _interopRequireDefault(_thunkify);

var _log4js = require('log4js');

var _log4js2 = _interopRequireDefault(_log4js);

require('babel-polyfill');

var _lazyLoader = require('./components/lazy-loader');

var _lazyLoader2 = _interopRequireDefault(_lazyLoader);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koaBody = require('koa-body');

var _koaBody2 = _interopRequireDefault(_koaBody);

var _koaXmlBody = require('koa-xml-body');

var _koaXmlBody2 = _interopRequireDefault(_koaXmlBody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * app Created by zppro on 16-8-31.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Target:入口
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */
//执行模块，特别是需要用到定义的全局变量给es5使用

var app = new _koa2.default();
var router = new _koaRouter2.default();
var koaBody = (0, _koaBody2.default)();
var xmlBodyParser = (0, _koaXmlBody2.default)();

app.conf = {
    isProduction: process.env.NODE_ENV == 'production',
    dir: {
        root: __dirname,
        log: _path2.default.join(__dirname, 'logs'),
        service: _path2.default.join(__dirname, 'services'),
        components: _path2.default.join(__dirname, 'components')
    },
    port: 9999
};

app.wrapper = {
    cb: _thunkify2.default,
    res: {
        default: function _default(msg) {
            return { success: true, code: 0, msg: msg };
        },
        error: function error(err) {
            return { success: false, code: err.code, msg: err.message };
        },
        ret: function ret(_ret, msg) {
            return { success: true, code: 0, msg: msg, ret: _ret };
        },
        rows: function rows(_rows, msg) {
            return { success: true, code: 0, msg: msg, rows: _rows };
        }
    }
};

_asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
    var serviceNames, configAppenders, svr;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:

                    console.log('register router...');
                    console.log('configure services...');
                    _context3.next = 4;
                    return app.wrapper.cb(_fsExtra2.default.readdir)(app.conf.dir.service);

                case 4:
                    _context3.t0 = function (o) {
                        return o.substr(0, o.indexOf('.'));
                    };

                    serviceNames = _context3.sent.map(_context3.t0);


                    console.log('configure logs...');
                    configAppenders = [];

                    configAppenders = _.union(configAppenders, _.map(serviceNames, function (o) {
                        var getLogConfig = require('./services/' + o).getLogConfig;
                        if (getLogConfig && typeof getLogConfig === 'function') {
                            return require('./services/' + o).getLogConfig(app);
                        } else {
                            var logName = 'svc_' + o + '.js';
                            return {
                                type: 'dateFile',
                                filename: _path2.default.join(app.conf.dir.log, logName),
                                pattern: '-yyyy-MM-dd.log',
                                alwaysIncludePattern: true,
                                category: logName
                            };
                        }
                    }));

                    _log4js2.default.configure({
                        appenders: [serviceNames.map(function () {
                            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(o) {
                                var svc, getLogConfig, logName;
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.next = 2;
                                                return _lazyLoader2.default.es6import('./services/{o}');

                                            case 2:
                                                svc = _context.sent;
                                                getLogConfig = svc.getLogConfig;

                                                if (!(getLogConfig && typeof getLogConfig === 'function')) {
                                                    _context.next = 8;
                                                    break;
                                                }

                                                return _context.abrupt('return', svc.getLogConfig(app));

                                            case 8:
                                                logName = 'svc_' + o + '.js';
                                                return _context.abrupt('return', {
                                                    type: 'dateFile',
                                                    filename: _path2.default.join(app.conf.dir.log, logName),
                                                    pattern: '-yyyy-MM-dd.log',
                                                    alwaysIncludePattern: true,
                                                    category: logName
                                                });

                                            case 10:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, undefined);
                            }));

                            return function (_x) {
                                return _ref2.apply(this, arguments);
                            };
                        }())]
                    });

                    console.log('register routers:');
                    _.each(serviceNames, function () {
                        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(o) {
                            var service_module;
                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                while (1) {
                                    switch (_context2.prev = _context2.next) {
                                        case 0:
                                            _context2.next = 2;
                                            return _lazyLoader2.default.es6import('./services/{o}');

                                        case 2:
                                            service_module = _context2.sent;

                                            service_module.actions.map(function (action) {
                                                var bodyParser = void 0;
                                                if (app.conf.bodyParser.xml.findIndex(function (o) {
                                                    return action.url.startsWith(o);
                                                }) == -1) {
                                                    // router.use(action.url, koaBody);
                                                    bodyParser = koaBody;
                                                } else {
                                                    bodyParser = xmlBodyParser({
                                                        encoding: 'utf8', // lib will detect it from `content-type`
                                                        onerror: function onerror(err, ctx) {
                                                            console.log(err);
                                                            // ctx.throw(err.status, err.message);
                                                        }
                                                    });
                                                    console.log('xmlBodyParser use to ' + action.url);
                                                }
                                                _koaRouter2.default.prototype[action.verb].apply(router, [service_module.name + "_" + action.method, action.url, bodyParser, action.handler(app)]);
                                            });

                                        case 4:
                                        case 'end':
                                            return _context2.stop();
                                    }
                                }
                            }, _callee2, undefined);
                        }));

                        return function (_x2) {
                            return _ref3.apply(this, arguments);
                        };
                    }());

                    app.use(router.routes()).use(router.allowedMethods());

                    svr = app.listen(app.conf.port);

                    // const svr = http.createServer(function (req, res) {
                    //     co(function*() {
                    //
                    //         try {
                    //             let query = url.parse(req.url, true).query;
                    //             if (query.text) {
                    //                 res.writeHead(200, {'Content-Type': 'image/png'});
                    //                 let qrStream = yield qrBuilder.getQRStream(query.text, query.ei);
                    //                 qrStream.pipe(res);
                    //
                    //             }
                    //         } catch (e) {
                    //             console.log(e);
                    //             console.dir(e);
                    //             res.writeHead(414, {'Content-Type': 'text/html'});
                    //             res.end('<h1>414 error:' + e + '</h1>');
                    //         }
                    //     });
                    // });

                    svr.listen(app.conf.port);

                    console.log('listen ' + app.conf.port + '...');

                case 16:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _callee3, undefined);
}))();