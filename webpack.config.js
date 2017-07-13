const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const path = require('path');

const autoprefixer = require('autoprefixer');
const pluginsText = new Date().toLocaleString() + '\n\r * built by `zhe-he`';


var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
pixi = path.join(phaserModule, 'build/custom/pixi.js'),
p2 = path.join(phaserModule, 'build/custom/p2.js');

const DIST = 'www';

var loaders = [
    {loader: 'css-loader'},
    {
        loader: 'postcss-loader',
        options: {
            config: {
                path: 'config/postcss.config.js'
            }
        }
    }
];
module.exports = {
    // 页面入口文件配置
    entry: {
        "vendor": ['whatwg-fetch','babel-polyfill','pixi','p2'],
        "main": 'js/main.js'
    },
    // 入口文件输出配置
    output: {
        // publicPath: '',
        path: path.resolve(__dirname, DIST),
        filename: 'js/[name].js',
        chunkFilename: 'js/chunk/_[id].js?[hash]'
    },
    // 插件项
    plugins: [
        /*new webpack.optimize.CommonsChunkPlugin({
            name: ["common","vendor"],
            minChunks: 2
        }),*/
        new ExtractTextPlugin('css/[name].css'),
        new CopyWebpackPlugin([
            {from: 'images/**/*'}
        ]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            favicon: 'images/favicon.ico',
            minify: {
                minimize: true,
                removeComments: true,
                collapseWhitespace: true
            },
            inject: "body",
            hash: true,
            chunks: ["vendor","main"],
            chunksSortMode: function (a, b) {
                var orders = ["vendor","main"];
                return orders.indexOf(a.names[0])-orders.indexOf(b.names[0]);
            }
        }),
    ],
    module: {
        rules: [
            {test: /\.html$/,exclude:/node_modules/,use: [{loader: 'html-loader'}]},
            { test: /pixi\.js/, loader: 'expose-loader?PIXI' },
            { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
            { test: /p2\.js/, loader: 'expose-loader?p2' },
            {
                test: /\.js$/,
                exclude:/(node_modules|libs)/,
                use: [
                    {
                        loader:'babel-loader',
                        options: {
                            presets: ["es2015","stage-0"],
                            plugins: ["transform-object-rest-spread"]
                        }
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                exclude:/(node_modules)/,
                include:/^js$/,
                use:[{ loader: 'ts-loader',options: { configFileName: "config/tsconfig.json" } }]
            },
            {
                test: /\.css$/,
                exclude:/node_modules|libs/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: loaders
                })
            },
            {
                test: /\.(scss|sass)$/,
                exclude:/node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: loaders.concat({loader: 'sass-loader'})
                })
            },
            {
                test: /\.less$/,
                exclude:/node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: loaders.concat({loader: 'less-loader'})
                })
            },
            {
                test: /\.vue$/,
                exclude:/node_modules/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            extractCSS: true,
                            preserveWhitespace: false,
                            postcss: [ autoprefixer({browsers: ['last 9 versions']}) ],
                            loaders: {
                                // 'ts': 'vue-ts-loader',
                                'js': 'babel-loader?presets[]=es2015&presets[]=stage-0&plugins[]=transform-object-rest-spread'
                                /*'css': ExtractTextPlugin.extract({
                                    use: 'css-loader',
                                    fallback: 'vue-style-loader'
                                })*/
                            }
                        }
                    }
                ]
            },
            {test: /\.(json|data)$/,exclude:/node_modules/,use: ['json-loader']},
            {test: /\.(txt|md)$/,exclude:/node_modules/,use: ['raw-loader']}        ]
    },
    // 其他配置
    resolve: {
        modules: [
            process.cwd(),
            "node_modules"
        ],
        extensions: ['.ts','.js','.vue'],
        alias: {
            "vue": "js/libs/vue.common.js",
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2
        }
    }
};


if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        mangle: false
    }),
    new webpack.BannerPlugin(pluginsText)
  ])
} else {
    module.exports.module.rules.unshift({
        test: /\.(js|vue)$/,
        exclude: /libs/,
        loader: "eslint-loader", 
        options: { 
            configFile:  path.resolve(__dirname, 'config/.eslintrc')
        },
        enforce: 'pre'
    })
}