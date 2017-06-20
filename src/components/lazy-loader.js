/**
 * Created by zppro on 17-6-19.
 */
import path from 'path'

const lazyLoader = {
    require: (m, base) => {
        if(base) {
            m = path.join(base, m);
        }
        return require(m);
    },
    dynamicImport: (m, base) => {
        if(base) {
            m = path.join(base, m);
        }
        return import(m);
    }
}

export default lazyLoader