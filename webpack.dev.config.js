
const path = require( 'path' );
const fs = require('fs');
// const TerserPlugin = require( 'terser-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )

const socket = "http://" + "localhost" + ":" + "8080";
//const socket = "https://" + "localhost" +  ":" + "8444";
/*

module
asset/resource
asset/inline
asset/
asset/source

css-loader => MiniCssExtractPlugin.loader

mkcert -CAROOT
mkcert filippo@example.com
mkcert -key-file key.pem -cert-file cert.pem example.com *.example.com
brew install mkcert
brew install nss # if you use Firefox


*/


module.exports = {
    
    entry: {
        'index':'./src/index.js',
        'index-mobile':'./src/index-mobile.js',
        'pixi-data':'./src/pixi-data.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve( __dirname, './dist' ),
        publicPath: '',
        //assetModuleFilename: 'images/[hash][ext][query]'
    },
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        //host: "192.168.1.123",
        port: 9000,
        static: {
            directory: path.resolve( __dirname, './dist' ),
        },
        devMiddleware: {
            index: 'index.html',
            writeToDisk: true,
        },
        proxy: {
            '/socket.io': {
               target: socket,
               ws: true
            },
          },

    },
    // devServer: {
    //     // host: "192.168.1.123",
    //     port: 443,
    //     static: {
    //         directory: path.resolve( __dirname, './dist' ),
    //     },
    //     devMiddleware: {
    //         index: 'index.html',
    //         writeToDisk: true,
    //     },
    //     https: true,
    //     https: {
    //         key: fs.readFileSync(`localhost+2-key.pem`),
    //         cert: fs.readFileSync(`localhost+2.pem`),
    //         ca: fs.readFileSync('rootCA.pem'),
    //         passphrase: '0937047859',
    //     },
    // },
    module: {
        rules:[
            {
                test: /\.(png|jpg|fnt)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'images/[name][ext]'
                },
                // parser: {
                //     dataUrlCondition: {
                //         maxSize: 3 * 1024,
                //     }
                // }
            },
            {
                test:/\.txt/,
                type: 'asset/source'
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/i,
                type: 'asset/source',
                // generator:
                // {
                //     filename: 'assets/shaders/[hash][ext]'
                // }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/env' ],
                        plugins: [ '@babel/plugin-proposal-class-properties' ]
                    }
                }
            },
            {
                test: /\.hbs$/,
                use: [
                    'handlebars-loader'
                ]
            }
        ]
    },
    plugins: [
        // new TerserPlugin(),
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['index'],
            title: 'Pixi 2D Web Template',
            // template: 'src/page-template.hbs',
            description: 'Test 2D Template',
            minify: false,
        }),
        new HtmlWebpackPlugin({
            filename: 'index-mobile.html',
            chunks: ['index-mobile'],
            title: 'Pixi 2D Mobile Web Template',
            // template: 'src/page-template.hbs',
            description: 'Test 2D Mobile Template',
            minify: false,
        }),
    ]


};