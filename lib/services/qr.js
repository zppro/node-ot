'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _qrBuilder = require('../components/qr-builder');

var _qrBuilder2 = _interopRequireDefault(_qrBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Created by zppro on 17-6-19.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */


var qrService = {
    init: function init(routerUrl, initOptions) {
        this.routerUrl = routerUrl;
        initOptions = initOptions || {};
        var self = this;

        this.logger4j = initOptions.log4j.getLogger(initOptions.log_name || 'svc_' + this.file.substr(__filename.lastIndexOf('/') + 1));
        if (this.logger4j) {
            this.logger4j.info(__filename + " loaded!");
        }

        this.actions = [{
            method: 'qr',
            verb: 'get',
            url: this.routerUrl + "/qr",
            handler: function handler(app, options) {
                var _this = this;

                return function () {
                    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
                        var query, qrStream;
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        _context.prev = 0;
                                        query = ctx.query;
                                        _context.next = 4;
                                        return _qrBuilder2.default.getQRStream(query.text, query.ei);

                                    case 4:
                                        qrStream = _context.sent;

                                        qrStream.pipe(ctx.response);
                                        _context.next = 12;
                                        break;

                                    case 8:
                                        _context.prev = 8;
                                        _context.t0 = _context['catch'](0);

                                        app.combinedLogger.log(self.logger, ex);
                                        _this.body = app.wrapper.res.error(_context.t0);

                                    case 12:
                                        _context.next = 14;
                                        return next;

                                    case 14:
                                    case 'end':
                                        return _context.stop();
                                }
                            }
                        }, _callee, _this, [[0, 8]]);
                    }));

                    return function (_x, _x2) {
                        return _ref.apply(this, arguments);
                    };
                }();
            }
        }];
        return this;
    }
};

exports.default = qrService.init();