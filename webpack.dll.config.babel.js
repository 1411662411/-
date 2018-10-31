/**
 * Created by caozheng on 2017/1/3.
 */
import project, {
    options,
} from './package';
import webpack from 'webpack';
import path from 'path';
import theme from './theme';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
const extractCSS = new ExtractTextPlugin({
    filename: "[name].dll.css",
    disable: false,
    allChunks: true,
});

const {
    dist, /*@type string 输出路径 */
} = options;
// 公共库列表
const vendors = [
    'react',
    'react-dom',
    'react-dom/server',
    'react-router',
    'react-redux',
    'antd',
    'whatwg-fetch',
    'rc-queue-anim',
    'lodash',
    './src/css/global/global.less',
];

export default {
    entry: {
        bundle: vendors
    },
    output: {
        path: path.join(__dirname, dist),
        filename: '[name].js',
        library: '[name]_library'
    },
    module: {
        rules: [{
            test: /\.less/,
            loader: extractCSS.extract(
                ['css-loader?sourceMap', `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`]
            ),
            
        },{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        },]
    },
    plugins: [
        extractCSS,
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),
        new webpack.DllPlugin({
            path: `${dist}/dll-manifest.json`,
            name: '[name]_library',
            context: __dirname,
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
    ]
}
