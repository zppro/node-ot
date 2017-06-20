/**
 * Created by zppro on 17-6-20.
 */


const utils = {
    isString: (o) => {
        "use strict";
        return Object.prototype.toString.call(o) == '[object String]';
    },
    isObject: (o) => {
        return o === Object(o);
    }
}

export default utils