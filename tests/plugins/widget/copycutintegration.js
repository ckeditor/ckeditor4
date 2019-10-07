/* bender-tags: widget, clipbaord */
/* bender-ui: collapsed */
/* bender-ckeditor-plugins: widget, undo, wysiwygarea, toolbar, clipboard */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'customwidget', {
		requires: 'widget',
		allowedContent: 'div',

		init: function( editor ) {
			editor.widgets.add( 'customwidget', {
				button: 'Add widget',
				template: '<div>Widget</div>'
			} );
		}
	} );

	bender.editor = {
		name: 'editor',
		startupData: '<p>foo bar</p><div data-widget="customwidget">Widget</div>',
		config: {
			extraAllowedContent: 'span',
			extraPlugins: 'customwidget',
			allowedContent: true
		}
	};

	bender.test( {
		'test widget not throw error during copy': function() {
			var editor = this.editor,
				editable = this.editor.editable(),
				range = editor.createRange();

			range.setStart( editable.findOne( 'p' ).getFirst(), 4 );
			range.setEnd( editable.findOne( 'div' ), 0 );
			range.select();

			editable.once( 'copy', function() {
				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						assert.pass();
					} );
				} );
			}, null, null, 10000 );

			editable.fire( 'copy', new CKEDITOR.dom.event( {} ) );
			wait();
		}
	} );
} )();
