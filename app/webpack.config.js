/**
 * create by fishYu on 2017-03-10
 */

var webpack = require('webpack');
var path = require('path');
var argv = require('yargs').argv;

var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
//production生产环境  development开发环境

var env = 'development';
var port = '8080';  //默认端口号
if(argv.env === 'develop'){
	env = 'development';
    port = argv.port;
}else if(argv.env === 'release'){
	env = 'production';
}

// 开发环境
var isDev = function () {
    return env.trim() === 'development';
};

// 生产环境
var isProd = function () {
    return env.trim() === 'production';
};
//获取时间戳
var urlArgs = (new Date()).getTime();
//以下为通用配置，在开发和发布环境通用  path: path.join(__dirname, 'dist'),
var common = {
    entry: {
        index: isProd() ? ['./src/index.jsx'] : [
            './src/index.jsx',
            'webpack-dev-server/client?http://localhost:' + port + '/',
            'webpack/hot/only-dev-server'
        ],
        vendor: [
            'react',
            'react-dom',
            'react-router',
            'react-router-redux',
            'react-redux',
            'redux',
            'redux-thunk'
        ]
    },
    output: {
        path: path.join(__dirname, '../jdweb-server/src/main/resources/static'),    //编译完的项目增加到该目录下
        filename: isProd() ? './js/[name].[chunkhash:8].js' : './js/[name].js',
        chunkFilename: isProd() ? './js/[name].chunk.[chunkhash:8].js' : './js/[name].chunk.js',
        publicPath: isProd() ? '' : '/dist/'
    },
    resolve: {
        modulesDirectories: ['node_modules', 'src'],
        extensions: ['', '.js', '.json', '.jsx', '.css', '.scss']
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.(png|jpg|jpeg|ico|gif)$/,
                loader: 'url-loader?limit=8192&name=[path][name].[ext]'
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)$/,  //由于路径始终不对，所以40kb之内的直接打包
                loader: 'url-loader?limit=40960&name=[path][name].[ext]'
            }
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify(env),//production development
                'DOMAIN_PATH' : JSON.stringify(''+argv.apiDomain)
			},
            
		}),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: isProd() ? './js/vendor.[chunkhash:8].js' : './js/vendor.js'
        }),
        new webpack.NoErrorsPlugin()
    ]
};

//开发模式下
/**
 *devServer: {
 *  historyApiFallback: true   配置路由browserHistory
 * }
 */
var dev = {
    devtool: 'inline-source-map',
    module: {
        loaders: [
            {
                test  : /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test  : /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader'
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin({ url: 'http://localhost:'+port})
    ],
    devServer: {
        historyApiFallback: true
    }
};

//发布模式下
var release = {
    module: {
        loaders: [
            {
                test  : /\.css$/, //导出CSS
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test  : /\.scss$/, //导出scss
                loader: ExtractTextPlugin.extract('style-loader', 'css!sass', '')
            }
        ],
    },
    plugins: [
        // new ExtractTextPlugin( "./css/style.css?rel="+urlArgs ),     //导出CSS
        new ExtractTextPlugin("./css/[name].[chunkhash:8].css"),     //导出CSS
        new webpack.optimize.UglifyJsPlugin({       //做JS压缩
            minimize: true,
            output: {
                comments: false,
            },
            compress: {
                warnings: false
            }
        }),
        new WebpackMd5Hash(),
        new HtmlWebpackPlugin({
            template: './template.html',    //由于不能删掉，对多余的加载JS文件，只能另外再添加一个template.html
            filename: 'index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: false
            },
            hash:true,
            cache:false
        })
    ]
};

if(argv.apiDomain + '' == 'devDomain'){
    release.plugins.push(
        new CopyWebpackPlugin( [{ 
            from: './mock', to: './mock' 
        },{from: './debug.js', to: './debug.js'}])     //npm run test 的时候拷贝 test测试数据
    );
}

if (env === 'production') {		//发布的时候
    module.exports = merge(common, release);
} else if (env === 'development') { //开发模式
    module.exports = merge(common, dev);
}

