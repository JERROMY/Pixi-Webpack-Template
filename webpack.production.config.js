
const path = require( 'path' );
// const TerserPlugin = require( 'terser-webpack-plugin' ); production is default
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
        'pixi-data':'./src/pixi-data.js',
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve( __dirname, './dist' ),
        publicPath: '',
        //assetModuleFilename: 'images/[hash][ext][query]'
    },
    devtool: 'inline-source-map',
    mode: 'production',
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 3000,
        }
    },
    module: {
        rules:[
            {
                test: /\.(png|jpg|fnt)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'images/[hash][ext]'
                },
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
                //     filename: 'assets/images/[hash][ext]'
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
        // new TerserPlugin(), production is default
        new MiniCssExtractPlugin({
            filename: 'main.[contenthash].css',
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: 'Pixi 2D Web Template',
            // template: 'src/page-template.hbs',
            description: 'Test 2D Template',
            minify: true,
        }),
    ]


};