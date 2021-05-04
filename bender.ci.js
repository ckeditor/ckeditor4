/* jshint browser: false, node: true */

'use strict';
var config = require( './bender' );

config.startBrowser = process.env.BROWSER || 'Chrome';
config.isTravis = true;
config.startBrowserOptions = {
	Chrome: {
		options: [
			[
				'--headless',
				'--hide-scrollbars',
				'--mute-audio'
			]
		]
	},
	Firefox: {
		options: [ '-headless' ]
	}
};

module.exports = config;
