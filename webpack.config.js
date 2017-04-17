/**
 * 
 * @authors Suven
 * @date    2017-03-13 16:47:57
 */

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
	// devtool: 'cheap-module-eval-source-map',
	entry: {
		app: [
			'webpack-hot-middleware/client',
			'./src/app'
		],
		vendors: ['react', 'react-dom', 'react-router','antd']
	},
	output: {
		path: path.resolve(__dirname, "static"),
		publicPath : '/static/',
		filename: '[name].js'
	},

	devServer:{
		// contentBase: path.join(__dirname, 'static'),
		compress: true,
		port: 8787
	},

	module: {
		loaders: [{
			test: /\.(jsx|js)?$/,
			include: [
				path.resolve(__dirname, 'src')
			],
			loaders: ['react-hot-loader', 'babel-loader'],
		},
		{
            test: /\.css$/,
            // loader:  ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]' })
            loader: 'style-loader!css-loader'
        },{ 
			test: /\.scss$/,
			include: [
				path.resolve(__dirname, 'src'),
			],
			loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!sass-loader' })
		},
		{
	        test: /\.(jpg|jpeg|png|gif|svg)$/i,
	        loaders: [
	            'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
	            'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
	        ]
	    }]
	},

	resolve: {
		extensions: ['.js', '.jsx', '.scss', '.css']
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendors.js' }),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			__DEV__: true
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new ExtractTextPlugin( "styles.css" ),
		new webpack.optimize.UglifyJsPlugin( {compress: {warnings: false}} )
	]
}