/* bender-tags: widget */
/* bender-ckeditor-plugins: embed,toolbar */
/* bender-include: ../widget/_helpers/tools.js, ../embedbase/_helpers/tools.js */
/* global embedTools, widgetTestsTools */

'use strict';

bender.editors = {
	classic: {
		name: 'editor_classic',
		creator: 'replace',
		config: {
			extraAllowedContent: 'div(a,b,c)'
		}
	}
};

var obj2Array = widgetTestsTools.obj2Array;
var classes2Array = widgetTestsTools.classes2Array;

embedTools.mockJsonp();

var tcs = {
	'test support for widget classes': function() {
		var bot = this.editorBots.classic,
			editor = bot.editor,
			data = '<div class="a b c" data-oembed-url="http://foo.jpg">' +
					'<img alt="image" src="//foo.jpg" style="max-width:100%;" />' +
				'</div>';

		bot.setData( data, function() {
			wait( function() {
				arrayAssert.itemsAreSame( [ 'a', 'b', 'c' ],
					classes2Array( obj2Array( editor.widgets.instances )[ 0 ].getClasses() ).sort(), 'classes transfered from data to widget.element' );

				assert.areSame( data, bot.getData( 1, 1 ), 'classes transfered from widget.element back to data' );
			}, 100 );
		} );
	}
};

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