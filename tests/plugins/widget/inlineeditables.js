/* bender-tags: widget */

( function() {
	'use strict';

	CKEDITOR.dtd.$editable.span = 1;

	CKEDITOR.plugins.add( 'spanwidget', {
		requires: 'widget',
		init: function( editor )	{
			editor.widgets.add( 'spanwidget', {
				editables: {
					content: {
						selector: 'span'
					}
				},
				upcast: function( element ) {
					return element.name == 'span';
				}
			} );
		}
	} );

	bender.editor = {
		config: {
			extraAllowedContent: 'span',
			extraPlugins: 'basicstyles,sourcearea,spanwidget'
		}
	};

	bender.test( {
		// #698
		'test switching to source mode after bolding text in an inline editable': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editorBot.setData( '<strong><span>lorem</span></strong>', function() {
				var textNode = editor.editable().findOne( 'span' ).getFirst().getFirst(),
					rng = editor.createRange();

				editor.focus();

				// Select the `m`.
				rng.setStart( textNode, 4 );
				rng.setEnd( textNode, 5 );
				editor.getSelection().selectRanges( [ rng ] );

				editor.execCommand( 'bold' );
				editor.setMode( 'source' );

				// Just pass the test if nothing threw before.
				assert.pass();
			} );
		}
	} );

} )();
