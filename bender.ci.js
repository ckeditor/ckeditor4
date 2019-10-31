/* jshint browser: false, node: true */

'use strict';
var config = require( './bender' );

config.startBrowser = process.env.BROWSER || 'Chrome';
config.isTravis = true;
config.startBrowserOptions = {
	Chrome: '--headless --disable-gpu',
	Firefox: '-headless'
};
config.captureTimeout = 60000;

module.exports = config;
