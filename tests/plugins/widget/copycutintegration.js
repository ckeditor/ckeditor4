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

			editable.fire( 'copy', new CKEDITOR.dom.event( {} ) );
			assert.pass();
		},

		'test cutting partially selected widget remain collapsed selection in editor': function() {
			var editor = this.editor,
				editable = this.editor.editable(),
				range = editor.createRange();

			range.setStart( editable.findOne( 'p' ).getFirst(), 3 );
			range.setEnd( editable.findOne( 'div' ), 0 );
			range.select();

			editable.once( 'cut', function() {
				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						assert.isInnerHtmlMatching(
							'<p>foo@</p><div data-widget="customwidget">Widget</div>',
							editor.getData()
						);

						assert.isTrue( editor.getSelection().isCollapsed() );
					} );
				} );
			} );

			editable.fire( 'cut', new CKEDITOR.dom.event( {} ) );
			wait();
		}
	} );
} )();
