
const path = require( 'path' );
// const TerserPlugin = require( 'terser-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )


/*

module
asset/resource
asset/inline
asset/
asset/source

css-loader => MiniCssExtractPlugin.loader

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
        port: 9000,
        static: {
            directory: path.resolve( __dirname, './dist' ),
        },
        devMiddleware: {
            index: 'index.html',
            writeToDisk: true,
        }
    },
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