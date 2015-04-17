/* bender-tags: widget */
/* bender-ckeditor-plugins: embed,toolbar */
/* bender-include: ../widget/_helpers/tools.js, ../embedbase/_helpers/tools.js */
/* global embedTools, widgetTestsTools */

'use strict';

bender.editors = {
	classic: {
		name: 'editor_classic',
		creator: 'replace'
	}
};

embedTools.mockJsonp();

var tcs = {};

widgetTestsTools.addTests( tcs, {
	name: 'basic',
	widgetName: 'embed',
	extraPlugins: 'embed',
	initialInstancesNumber: 1,
	newData: [
		[ 'info', 'url', 'http://xxx' ]
	],
	newWidgetPattern: '<div data-oembed-url="http://xxx"><p>url:http%3A%2F%2Fxxx</p></div>'
} );

bender.test( tcs );