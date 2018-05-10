/* bender-tags: editor,dom,range */
/* bender-ckeditor-plugins: image2,toolbar */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			name: 'classic',
			config: {
				allowedContent: true
			}
		},
		inline: {
			name: 'inline',
			creator: 'inline'
		}
	};

	var tests = {
		'test one widget rect': function( editor, bot ) {
			assertWidgetsRects( editor, bot, 1 );
		},
		'test two widget rects': function( editor, bot ) {
			assertWidgetsRects( editor, bot, 2 );
		},
		'test three widget rects': function( editor, bot ) {
			assertWidgetsRects( editor, bot, 3 );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );

	function assertWidgetsRects( editor, bot, widgetsCount ) {
		if ( widgetsCount > 1 && CKEDITOR.env.ie ) {
			// IE and Edge returns another rect for parent object more than one widget is selected.
			assert.ignore();
		}
		var data = '';

		for ( var i = widgetsCount; i > 0; i-- ) {
			data += '<img alt="x" id="x" src="_assets/foo.png" />';
		}

		bot.setData( data, function() {
			var range = editor.createRange(),
				rects,
				widgetWrappers;


			range.setStart( editor.editable().getFirst().getFirst(), 0 );
			range.setEnd( editor.editable().getFirst().getLast(), editor.editable().getFirst().getLast().getChildCount() );

			rects = range.getClientRects();
			assert.areEqual( widgetsCount, rects.length, 'Rect count' );

			widgetWrappers = editor.editable().find( '[data-widget]' );
			CKEDITOR.tools.array.forEach( widgetWrappers.$, function( item, index ) {
				var rect = new CKEDITOR.dom.element( item ).getClientRect();

				assert.isTrue( CKEDITOR.tools.objectCompare( rect, rects[ index ] ), 'Rect[ ' + index + ' ]' );
			} );
		} );
	}
} )();
