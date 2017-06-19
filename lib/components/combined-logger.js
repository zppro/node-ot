/**
 * Created by zppro on 17-6-19.
 */

const combinedLogger = {
    log: function (logger) {
        var paramArray = Array.prototype.slice.call(arguments, 1);
        console.log.apply(null, paramArray);
        logger.debug.apply(logger, paramArray)
    },
    error: function (logger) {
        var paramArray = Array.prototype.slice.call(arguments, 1);
        console.log.apply(null, paramArray);
        logger.error.apply(logger, paramArray)
    }
}

export default combinedLogger;