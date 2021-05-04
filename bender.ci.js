/* jshint browser: false, node: true */

'use strict';
var config = require( './bender' );

config.startBrowser = process.env.BROWSER || 'Chrome';
config.isTravis = true;
config.startBrowserOptions = {
	Chrome: {
		options: [
			[
				'--disable-background-networking',
				'--enable-features=NetworkService,NetworkServiceInProcess',
				'--disable-background-timer-throttling',
				'--disable-backgrounding-occluded-windows',
				'--disable-breakpad',
				'--disable-client-side-phishing-detection',
				'--disable-component-extensions-with-background-pages',
				'--disable-default-apps',
				'--disable-dev-shm-usage',
				'--disable-extensions',
				'--disable-features=Translate',
				'--disable-hang-monitor',
				'--disable-ipc-flooding-protection',
				'--disable-popup-blocking',
				'--disable-prompt-on-repost',
				'--disable-renderer-backgrounding',
				'--disable-sync',
				'--force-color-profile=srgb',
				'--metrics-recording-only',
				'--no-first-run',
				'--enable-automation',
				'--password-store=basic',
				'--use-mock-keychain',
				'--disable-gpu'
			]
		]
	},
	Firefox: {
		options: [ '-headless' ]
	}
};
config.captureTimeout = 60000;

module.exports = config;
