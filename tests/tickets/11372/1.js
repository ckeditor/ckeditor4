/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: widget,entities */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	var fixHtml = widgetTestsTools.fixHtml;

	bender.test( {
		'test entities in nested editable': function() {
			var editor = this.editor,
				data = '<div data-widget="testentities" id="w1"><p id="foo">&lt;&gt;&amp;&nbsp;&aring;&auml;&ouml;</p></div>';

			editor.widgets.add( 'testentities', {
				editables: {
					foo: {
						selector: '#foo'
					}
				}
			} );

			this.editorBot.setData( data, function() {
				assert.areSame( fixHtml( data ), fixHtml( editor.getData() ), 'Entities preserved correctly in nested editable.' );
			} );
		}
	} );
} )();