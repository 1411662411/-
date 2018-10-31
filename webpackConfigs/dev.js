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
import { commonConfig } from './base';
const config = ({
    env,
    __dirname,
}) => webpackMerge(commonConfig({env, __dirname}), {
        output: {
            path: __dirname,
            publicPath: '//127.0.0.1/',
        },
        devtool: 'cheap-module-source-map',
        plugins: [
            new webpack.NamedModulesPlugin(),
        ]
    });
export default config;