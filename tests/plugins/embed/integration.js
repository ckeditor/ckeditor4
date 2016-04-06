/* bender-tags: widget */
/* bender-ckeditor-plugins: embed,toolbar,stylescombo */
/* bender-include: ../widget/_helpers/tools.js, ../embedbase/_helpers/tools.js */
/* global embedTools, widgetTestsTools */

'use strict';

bender.editors = {
	classic: {
		name: 'editor_classic',
		creator: 'replace',
		config: {
			extraAllowedContent: 'div(a,b,c)',
			removePlugins: 'div',
			stylesSet: [
				{ name: 'Foo media', type: 'widget', widget: 'embed', attributes: { 'class': 'foo' } },
				{ name: 'Bar media', type: 'widget', widget: 'embed', attributes: { 'class': 'bar' } }
			]
		}
	}
};

var obj2Array = widgetTestsTools.obj2Array;
var classes2Array = widgetTestsTools.classes2Array;

embedTools.mockJsonp();

var tcs = {
	'test support for widget classes - from extraAC': function() {
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
	},

	'test support for widget classes - from stylesSet': function() {
		var bot = this.editorBots.classic,
			editor = bot.editor,
			data = '<div class="bar foo" data-oembed-url="http://foo.jpg">' +
					'<img alt="image" src="//foo.jpg" style="max-width:100%;" />' +
				'</div>';

		assert.isTrue( editor.filter.check( 'div[data-oembed-url](foo)' ), 'class from a stylesSet is registered' );
		assert.isTrue( editor.filter.check( 'div[data-oembed-url](foo)', false, true ), 'class from a stylesSet is registered - strict check' );
		assert.isFalse( editor.filter.check( 'div(foo)', false, true ), 'registered rules are precise - data-oembed-url must exist' );

		bot.setData( data, function() {
			arrayAssert.itemsAreSame( [ 'bar', 'foo' ],
				classes2Array( obj2Array( editor.widgets.instances )[ 0 ].getClasses() ).sort(), 'classes transfered from data to widget.element' );

			assert.areSame( data, bot.getData( 1, 1 ), 'classes transfered from widget.element back to data' );
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
