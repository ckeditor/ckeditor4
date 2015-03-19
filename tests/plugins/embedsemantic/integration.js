/* bender-ckeditor-plugins: embedsemantic,toolbar */
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
	widgetName: 'embedSemantic',
	extraPlugins: 'embedsemantic',
	initialInstancesNumber: 1,
	newData: [
		[ 'info', 'url', 'http://xxx' ]
	],
	newWidgetPattern: '<oembed>http://xxx</oembed>'
} );

bender.test( tcs );