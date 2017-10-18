/* bender-ckeditor-plugins: widget,toolbar,basicstyles,sourcearea*/

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		init: function() {
			CKEDITOR.dtd.$editable.span = 1;

			this.editor.widgets.add( 'spanwidget', {
				editables: {
					content: {
						selector: 'span'
					}
				},
				upcast: function( element ) {
					return element.name == 'span';
				}
			} );
		},

		// #698
		//
		// TODO: Back to this later.
		// This test is trying to reproduce steps introduced in original issue. It seems that the problem
		// occurs on real click only.
		'test widget modification': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bot.setData( '<p>lorem</p><strong><span>lorem ipsum</span></strong><p>lorem</p>', function() {
				wait( function() {
					var span = editor.editable().findOne( 'span.cke_widget_editable' ),
						range = editor.createRange();

					range.setStart( span.getChild( 0 ), 6 );
					range.endOffset = 11;

					editor.getSelection().selectRanges( [ range ] );

					editor.execCommand( 'bold' );
					editor.execCommand( 'source' );
				}, 2000 );
			} );
		}
	} );
} )();
