'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loaderPolyfill = require('es-module-loader/core/loader-polyfill.js');

var es6loader = new _loaderPolyfill.Loader(); /**
                                               * Created by zppro on 17-6-19.
                                               */


var lazyLoader = {
  require: require,
  es6import: es6loader.import
};

exports.default = lazyLoader;