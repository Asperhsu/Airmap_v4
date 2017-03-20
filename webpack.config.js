var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var outputPath = __dirname + "/assets/dist/";

module.exports = {
	devtool: "source-map",
	entry: {
		map: [
			__dirname + "/src/js/map-page",
			__dirname + "/src/js/navigator-handler",
		],
		list: __dirname + "/src/js/list-page",
		site: __dirname + "/src/js/site-page",
		widget: __dirname + "/src/js/widget-page",
		"vendor-common": ["jquery",  "moment"],
		"vendor-map": [
			"vue", "bootstrap-switch", "bootstrap-slider", 
			"js.cookie", "d3"
		],
	},
	output: {
		path: outputPath,
    	publicPath: "/js/",
    	filename: '[name].js',
	},
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel-loader?presets[]=es2015', exclude: /(node_modules|bower_components)/ },
			{ test: /\.json$/, loader: "json-loader" },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
		]
	},
	externals: {
        "jquery": "jQuery"
    },
	resolve: {
		root: [
			path.resolve('src'),
		]
	},
	plugins: [
	    new ExtractTextPlugin('[name].css'),
		new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-tw/),
	    new webpack.ProvidePlugin({
	        $: 'jquery',
	        jQuery: 'jquery',
	        'window.jQuery': 'jquery',
	        'root.jQuery': 'jquery',
	        'moment': 'moment',
	        'MapHandler': 'js/map-handler',
	    }),
	]
};