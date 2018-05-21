/* bender-tags: editor, tools */

( function() {
	'use strict';
	bender.editor = {
		name: 'classic'
	};

	bender.test( {
		'test getting absolute rect': function() {
			var editor = this.editorBot.editor,
				container = CKEDITOR.document.findOne( '#test_container' ).getClientRect( true ),
				offset = {
					x: container.left - 99,
					y: container.top - 99
				},
				rect = {
					bottom: 10,
					height: 10,
					left: 0,
					right: 10,
					top: 0,
					width: 10,
					x: 0,
					y: 0
				},
				absoluteRect = CKEDITOR.tools.getAbsoluteRectPosition( editor.window, rect ),
				key,
				expected;

			if ( CKEDITOR.env.ie ) {
				delete rect.x;
				delete rect.y;
			}
			assertRect();

			window.scrollBy( 0, 100 );
			absoluteRect = CKEDITOR.tools.getAbsoluteRectPosition( editor.window, rect );
			assertRect();

			function assertRect() {
				for ( key in rect ) {
					if ( key in { left: '', right: '', x: '' } ) {
						expected = rect[ key ] + 100 + offset.x;
					} else if ( key in { top: '', bottom: '', y: '' } ) {
						expected = rect[ key ] + 100 + offset.y;
					} else {
						expected = rect[ key ];
					}
					assert.areEqual( expected, absoluteRect[ key ], 'Rect[ ' + key + ' ]' );
				}
			}
		}
	} );
} )();
