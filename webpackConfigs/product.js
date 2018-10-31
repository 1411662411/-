/**
 * Created by caozheng on 2016/12/22.
 */

/**
 * 引入node内置模块
 */
import path from 'path';


/**
 * 引入webpack
 * 引用webpack plugins
 */
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import ManifestPlugin from 'webpack-manifest-plugin';
import ChunkManifestPlugin from 'chunk-manifest-webpack-plugin';
import WebpackChunkHash from 'webpack-chunk-hash'
import { commonConfig } from './base';

/**
 * 引入配置项
 */
import project, {
    options,
} from '../package';
const {
    dist,
    /*@type string 输出路径 */
    port,
    /*@type number 端口号 */
    https,
    /*@type boolean 是否启用https协议（默认true）*/
} = options;


const config = ({
    env,
    __dirname,
}) => webpackMerge(commonConfig({ env, __dirname }), {
    output: {
        path: __dirname,
        filename: `${dist}/js/[name].[chunkhash].js`,
        chunkFilename: `${dist}/js/[name].[chunkhash].js`,
        publicPath: '//statictianwu.joyowo.com/',
    },
    // devtool: 'source-map',
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new WebpackChunkHash(),
        new ChunkManifestPlugin({
            filename: `${dist}/chunk-manifest.json`,
            manifestVariable: "webpackManifest",
            inlineManifest: true
        }),
        new ManifestPlugin({
            fileName: `${dist}/md5-manifest.json`,
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                screw_ie8: false,
                warnings: false /* 不显示js规范的警告、提示 */
            },
            mangle: { screw_ie8: false },
            output: { screw_ie8: false },
            //  Preserve copyright comments in the output. By
            // default this works like Google Closure, keeping
            // JSDoc-style comments that contain "@license" or
            // "@preserve". You can optionally pass one of the
            // following arguments to this flag:
            // - "all" to keep all comments
            // - a valid JS regexp (needs to start with a
            // slash) to keep only comments that match.
            // Note that currently not *all* comments can be
            // kept when compression is on, because of dead
            // code removal or cascading statements into
            // sequences.

            /**
             * 上面的介绍是指，这个comments的选项是保留一些类似 "@license" or "@preserve" 这种版权的注释，
             * 可选参数有2种， 一种是 字符串 'all'，保留所有注释。
             * 另一种是 可以是正则表达式
             * 这里我去掉了所有注释使用了 空字符串 '';
             */
            comments: 'all'
        }),
    ]
});
export default config;