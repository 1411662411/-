/**
 * author zhanghaiyang
 * date  2017/03/06
 * email 403724532@qq.com
 */

/**
 * 引入node内置模块
 */
import path from 'path';
import fs from 'fs';

/**
 * 引入webpack
 * 引用webpack plugins
 */
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const DllReferencePlugin = webpack.DllReferencePlugin;
const DefinePlugin = webpack.DefinePlugin;

/* 分离独立依赖的css文件 */
import ExtractTextPlugin from 'extract-text-webpack-plugin';
const extractCSS = new ExtractTextPlugin({
    filename: "[name].css",
    disable: false,
    allChunks: true,
});


/**
 * ip地址
 */
// import ip from 'ip';
// const host = ip.address();
/**
 * 引入配置项
 */
import project, {
    options,
} from '../package';
import entries from './entry';
import manifest from '../dist/dll-manifest';
import theme from '../theme';
const entriesKey = Object.keys(entries);

const {
    dist,
    /*@type string 输出路径 */
    port,
    /*@type number 端口号 */
    https,
    /*@type boolean 是否启用https协议（默认true）*/
} = options;

/**
 * 导出webpack配置项
 */
export const commonConfig = ({ env, __dirname }) => {
    const ROOTPATH = path.resolve(__dirname);
    return {
        entry: entries,
        output: {
            filename: `${dist}/js/[name].js`,
            // publicPath: 'https://127.0.0.1/',
        },
        resolve: {
            extensions: [
                '.js',
                '.jsx',
                '.ts',
                '.tsx',
                '.css',
                '.less',
                '.json',
                '.gif',
                '.html',
                '.png',
                '.webp',
                '.jpg',

            ],
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.(tsx|ts)/,
                    exclude: [
                        path.resolve(__dirname, "src/pages/")
                    ],
                    use: [
                        'ts-loader',
                    ]
                },
                {
                    test: /src(\\|\/)pages((\\|\/).*).(tsx|ts)/,
                    use: [
                        'bundle-loader?lazy',
                        'ts-loader',
                    ],
                },
                {
                    test: /\.(less)?$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`,
                    ],
                    // loader: 'style!css!less'
                },
                {
                    test: /.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                    ],
                },
                {
                    test: /\.(jpg|png|gif|jpeg)?$/,
                    loader: `url-loader?limit=20480&name=${dist}/images/[name].[hash:8].[ext]`,
                },
                // {
                //     test: /\.(png|jpg|gif)$/,
                //     use: [
                //         {
                //             loader: 'file-loader',
                //             options: {}
                //         }
                //     ]
                // },
                {
                    test: /\.(eot|woff(2)?|ttf|svg)?(@.+)*$/,
                    loader: `url-loader?limit=20480&name=${dist}/other/[name].[hash:8].[ext]`,
                }
            ],
        },
        plugins: [
            /**
             * DefinePlugin
             */
            new DefinePlugin({
                '__DEV__': env === 'dev' ? true : false,
                '__ALPHA__': env === 'alpha' ? true : false,
                '__TEST__': env === 'alpha' ? true : false,
                '__BGALPHA__': env === 'devbgalpha' ? true : false,
                '__BRANCHALPHA__': env === 'branchalpha' ? true : false,
                '__BETA__': env === 'beta' ? true : false,
                '__PRODUCT__': env === 'product' ? true : false,
            }),

            /**
             * DllReferencePlugin
             */
            new DllReferencePlugin({
                context: __dirname,
                manifest,
            }),

            /**
             * CommonsChunkPlugin
             */
            new CommonsChunkPlugin({
                name: 'common', // vendor libs + extracted manifest
                minChunks: 3,
                chunks: ['index'],
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "manifest",
                minChunks: Infinity,
                chunks: ['common'],
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "load",
                filename: `${dist}/js/load.js`,
                minChunks: Infinity,
                chunks: ['load'],
            }),
            new CopyWebpackPlugin([{
                from: __dirname + '/node_modules/babel-polyfill/dist/polyfill.js',
                to: `${dist}/js/`,
            }]),
            // 拷贝静态资源方便直接访问
            new CopyWebpackPlugin([{
                from: __dirname + '/assets',
                to: `${dist}/assets/`,
            }])
            // new webpack.optimize.CommonsChunkPlugin({
            //     name: "polyfill",
            //     filename: `${dist}/js/polyfill.js`,
            //     minChunks: Infinity,
            //     chunks: ['polyfill'],
            // }),

        ],
        devtool: 'cheap-module-source-map',
        devServer: {
            port,
            https,
            contentBase: ROOTPATH,
            compress: true,
            /* gizp */
            inline: false,
            quiet: false,
            stats: { colors: true },
            watchOptions: {
                aggregateTimeout: 300,
                poll: true,
            },
            disableHostCheck: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }
    }
};