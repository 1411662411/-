/**
 * author zhanghaiyang
 * date  2017/03/06
 * email 403724532@qq.com
 */
import { resolve } from 'path';
import glob from 'glob';
const pathResolve = (path) => {
    return resolve(__dirname, path);
}

const getCommon = () => {
    let files = glob.sync('src/{businessComponents,components}/**/*.{tsx,ts}');
    files = files.map((value) => pathResolve(`../${value}`));
    return files;
}

export default {
    // polyfill: pathResolve('../node_modules/babel-polyfill/dist/polyfill'),
    load: pathResolve('../src/load'),
    index: pathResolve('../src/index'),
    common: [...getCommon()],
};