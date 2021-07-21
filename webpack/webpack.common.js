const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const gitRevisionPlugin = new GitRevisionPlugin({ branch: true }); // 'rev-parse HEAD' is default command to find latest commit

console.log("Commit Hash for this build: ", gitRevisionPlugin.commithash());
console.log("Branch for this build: ", gitRevisionPlugin.branch());
console.log("GA_TRACKING_ID", process.env.GA_TRACKING_ID);

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: {
        app: ['react-hot-loader/patch', "./index.js"]
    },
    output: {
        // https://webpack.js.org/guides/caching/
        publicPath: "/",
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "../public"),
        clean: true
    },
    context: path.resolve(__dirname, "../src"),
    resolve: {
        extensions: [".js", ".jsx"],
        modules: ["node_modules", path.resolve(__dirname, "../src/_scss")],
        fallback: {
            buffer: require.resolve('buffer/'),
            stream: require.resolve('stream-browserify')
        }
    },
    optimization: {
        moduleIds: 'deterministic'
    },
    module: {
        noParse: /(mapbox-gl)\.js$/,
        rules: [
            {
                test: /\.js$|jsx$/,
                exclude: /node_modules\.*/,
                loader: "babel-loader",
                options: {
                    plugins: [
                        isDevelopment && require.resolve('react-refresh/babel')
                    ].filter(Boolean)
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { url: false, sourceMap: true } },
                    'postcss-loader',
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                includePaths: ["./src/_scss", "./node_modules"]
                            }
                        }
                    }
                ]
            },
            {
                include: /\.(eot|ttf|woff|woff2|png|svg|ico|gif|jpg|pdf|webp)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            },
            {
                test: /\.(json)$/,
                type: 'javascript/auto',
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../src/index.ejs"),
            chunksSortMode: "none",
            templateParameters: {
                GA_TRACKING_ID: process.env.GA_TRACKING_ID || '',
                USE_GTM: (
                    process.env.ENV === 'qat' ||
                    process.env.ENV === 'sandbox'
                ),
                GTM_ID: process.env.GTM_ID || ''
            }
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        }),
        // new CopyWebpackPlugin([
        //     {
        //         from: '*.xml',
        //         to: path.resolve(__dirname, "../public"),
        //         context: path.resolve(__dirname, '../')
        //     },
        //     {
        //         from: 'robots.txt',
        //         to: path.resolve(__dirname, "../public"),
        //         context: path.resolve(__dirname, '../')
        //     },
        //     {
        //         from: 'redirect-config.json',
        //         to: path.resolve(__dirname, "../public"),
        //         context: path.resolve(__dirname, '../')
        //     }
        // ]),
        new webpack.DefinePlugin({
            'process.env': {
                ENV: process.env.ENV
                    ? JSON.stringify(process.env.ENV)
                    : JSON.stringify('qat')
            }
        }),
        isDevelopment && new webpack.HotModuleReplacementPlugin(),
        isDevelopment && new ReactRefreshWebpackPlugin()
    ].filter(Boolean)
};
