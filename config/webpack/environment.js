const { environment } = require('@rails/webpacker')

/* ---- yarn add jquery/undersocre/backbone -> yarn.lock --- */
const webpack = require('webpack')
environment.plugins.append('Provide',
	new webpack.ProvidePlugin({
		$: 'jquery/src/jquery',
		jQuery: 'jquery/src/jquery',
		_: 'underscore',
		Backbone: 'backbone'
	})
)
/* ------------------------ */

module.exports = environment
