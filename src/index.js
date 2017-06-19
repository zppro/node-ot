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

(async()=>{

    console.log('register router...');
    console.log('configure services...');

    let dirs = await app.wrapper.thunk2Await(fs.readdir)(app.conf.dir.services);

    let serviceNames = dirs.map((o) => {
        return o.substr(0, o.indexOf('.'))
    });

    console.log('configure logs...');
    // log4js.configure({
    //     appenders: [
    //         serviceNames.map((o)=>{
    //             // let svc = require('./services/' + o);
    //             let svc = lazyLoader.require(`./services/{o}`),
    //                 getLogConfig = svc.getLogConfig;
    //             if (getLogConfig && typeof getLogConfig === 'function') {
    //                 return svc.getLogConfig(app);
    //             } else {
    //                 var logName = 'svc_' + o + '.js';
    //                 return {
    //                     type: 'dateFile',
    //                     filename: path.join(app.conf.dir.log, logName),
    //                     pattern: '-yyyy-MM-dd.log',
    //                     alwaysIncludePattern: true,
    //                     category: logName
    //                 };
    //             }
    //         })
    //     ]
    // });
    //
    //
    // console.log('register routers:')
    // _.each(serviceNames, (o) => {
    //     let service_module = lazyLoader.require(`./services/{o}`);
    //     service_module.actions.map((action)=>{
    //         let bodyParser;
    //         if (app.conf.bodyParser.xml.findIndex(function (o) {
    //                 return action.url.startsWith(o);
    //             }) == -1) {
    //             // router.use(action.url, koaBody);
    //             bodyParser = koaBody;
    //         } else {
    //             bodyParser = xmlBodyParser({
    //                 encoding: 'utf8', // lib will detect it from `content-type`
    //                 onerror: (err, ctx) => {
    //                     console.log(err);
    //                     // ctx.throw(err.status, err.message);
    //                 }
    //             });
    //             console.log('xmlBodyParser use to ' + action.url);
    //         }
    //         Router.prototype[action.verb].apply(router, [service_module.name + "_" + action.method, action.url, bodyParser, action.handler(app)]);
    //     });
    // });
    //
    // app.use(router.routes())
    //     .use(router.allowedMethods());
    //
    // const svr = app.listen(app.conf.port);

const svr = http.createServer(function (req, res) {
    co(function*() {

        try {
            let query = url.parse(req.url, true).query;
            if (query.text) {
                res.writeHead(200, {'Content-Type': 'image/png'});
                let qrStream = yield qrBuilder.getQRStream(query.text, query.ei);
                qrStream.pipe(res);

            }
        } catch (e) {
            console.log(e);
            console.dir(e);
            res.writeHead(414, {'Content-Type': 'text/html'});
            res.end('<h1>414 error:' + e + '</h1>');
        }
    });
});
    svr.listen(app.conf.port);

    console.log('listen '+app.conf.port+'...');

})();


