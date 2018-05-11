/* bender-tags: editor, tools */

( function() {
	'use strict';
	bender.editor = {
		name: 'classic'
	};

	bender.test( {
		'test getting absolute rect': function() {
			var editor = this.editorBot.editor,
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
					if ( !( key in { height: '', width: '' } ) ) {
						expected = rect[ key ] + 100;
					} else {
						expected = rect[ key ];
					}
					assert.areEqual( expected, absoluteRect[ key ], 'Rect[ ' + key + ' ]' );
				}
			}
		}
	} );
} )();
