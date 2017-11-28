/**
 * app Created by zppro on 16-8-31.
 * Target:入口
 */
import http from 'http';
import url from 'url';
import path from 'path';
import co from 'co';
import fs from 'fs-extra';
import ofs from 'fs';
import thunkify from 'thunkify';
import thunkToPromise from 'thunk-to-promise';
import log4js from 'log4js';
import combinedLogger from './components/combined-logger'
import lazyLoader from './components/lazy-loader'

import Koa from 'koa';
import Router from 'koa-router';
import KoaBody from 'koa-body';
import XmlBodyParser from 'koa-xml-body';

import 'babel-polyfill';//执行模块，特别是需要用到定义的全局变量给es5使用

const app = new Koa();
const router = new Router();
const koaBody = KoaBody();
const xmlBodyParser = XmlBodyParser();

app.conf = {
    isProduction: process.env.NODE_ENV == 'production',
    dir: {
        root: __dirname,
        log: path.join(__dirname, 'logs'),
        services: path.join(__dirname, 'services'),
        components: path.join(__dirname, 'components')
    },
    bodyParser: {
        xml: [] //body需要xml解析
    },
    port: 9999
};

app.wrapper = {
    thunkify: thunkify,
    thunk2Await: function (fn) {
        return function() {
            return thunkToPromise(thunkify(fn).apply(null, Array.prototype.slice.call(arguments)));
        }
    },
    res: {
        default: function (msg) {
            return {success: true, code: 0, msg: msg};
        },
        error: function (err) {
            return {success: false, code: err.code, msg: err.message};
        },
        ret: function (ret, msg) {
            return {success: true, code: 0, msg: msg, ret: ret};
        },
        rows: function (rows, msg) {
            return {success: true, code: 0, msg: msg, rows: rows};
        }
    }
};

app.combinedLogger = combinedLogger;

(async()=> {

  console.log('register router...');
  console.log('configure services...');

  let serviceFiles = await app.wrapper.thunk2Await(fs.readdir)(app.conf.dir.services);

  let serviceNames = serviceFiles.filter((o) => o.substr(o.lastIndexOf('.')+1) === 'js').map((o) => {
    return o.substr(0, o.indexOf('.'))
  });

  console.log('configure logs...');
  log4js.configure({
    appenders: serviceNames.map((o) => {
      // let result = require("babel-core").transform("import('./components/qr-builder').then((qrBuilder) => {console.log(qrBuilder);});", {
      //     plugins: ["dynamic-import-node"]
      // });
      // console.log(result.code);
      // const qrBuilder = await lazyLoader.dynamicImport('./components/qr-builder', __dirname);
      // const utils = await lazyLoader.dynamicImport('../components/utils');
      // console.log(qrBuilder, utils);
      let svc = require(`${app.conf.dir.services}/${o}`).default, getLogConfig = svc.getLogConfig;
      if (getLogConfig && typeof getLogConfig === 'function') {
        return svc.getLogConfig(app);
      } else {
        var logName = `svc_${o}.js`;
        return {
          type: 'dateFile',
          filename: path.join(app.conf.dir.log, logName),
          pattern: '-yyyy-MM-dd.log',
          alwaysIncludePattern: true,
          category: logName
        };
      }
    })
  });


  console.log('register routers:')
  serviceNames.forEach((o) => {
    let svc = require(`${app.conf.dir.services}/${o}`).default;
    // console.log('--->svc', svc);
    let svc_module_name = o;
    if (o.includes('_')) {
      svc_module_name = o.split('_').join('/');
    }
    svc.init(`/services/${svc_module_name}`, {logName: `svc_${o}.js`});
    svc.actions.forEach((action) => {
      let bodyParser;
      if (app.conf.bodyParser.xml.findIndex(function (o) {
          return action.url.startsWith(o);
        }) == -1) {
        bodyParser = koaBody;
      } else {
        bodyParser = xmlBodyParser({
          encoding: 'utf8',
          onerror: (err, ctx) => {
            console.log(err);
          }
        });
        console.log('xmlBodyParser use to ' + action.url);
      }
      Router.prototype[action.verb].apply(router, [`${o}_${action.method}`, action.url, bodyParser, action.handler(app)]);
    });
  });

  console.log(router);

  app.use(router.routes()).use(router.allowedMethods());

  const svr = app.listen(app.conf.port);

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

})();


