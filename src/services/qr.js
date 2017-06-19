/**
 * Created by zppro on 17-6-19.
 */
import qrBuilder from '../components/qr-builder';
const qrService = {
    init: function (routerUrl, initOptions) {
        this.routerUrl = routerUrl;
        initOptions = initOptions || {};
        var self = this;

        this.logger4j =  initOptions.log4j.getLogger(initOptions.log_name || ('svc_' + this.file.substr(__filename.lastIndexOf('/') + 1)));
        if (this.logger4j) {
            this.logger4j.info(__filename + " loaded!");
        }

        this.actions = [
            {
                method: 'qr',
                verb: 'get',
                url: this.routerUrl + "/qr",
                handler: function (app, options) {
                    return async(ctx, next) => {
                        try {
                            var query = ctx.query;
                            let qrStream = await qrBuilder.getQRStream(query.text, query.ei);
                            qrStream.pipe(ctx.response);
                        } catch (e) {
                            app.combinedLogger.log(self.logger, ex);
                            this.body = app.wrapper.res.error(e);
                        }
                        await next;
                    };
                }
            }
        ];
        return this;
    }
}

export default qrService.init();
