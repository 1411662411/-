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
import ChunkManifestPlugin  from 'chunk-manifest-webpack-plugin';
import WebpackChunkHash from 'webpack-chunk-hash';
import { commonConfig } from './base';

/**
 * 引入配置项
 */
import project, {
    options,
} from '../package';
const {
    dist, /*@type string 输出路径 */
    port, /*@type number 端口号 */
    https, /*@type boolean 是否启用https协议（默认true）*/
} = options;

const config = ({
    env,
    __dirname,
}) => webpackMerge(commonConfig({env, __dirname}), {
        output: {
            path: __dirname,
            filename: `${dist}/js/[name].[chunkhash].js`,
            chunkFilename: `${dist}/js/[name].[chunkhash].js`,
            publicPath: '//testdev.joyomm.com/',
        },
        devtool: 'cheap-module-source-map',
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
        ]
    });
export default config; 
