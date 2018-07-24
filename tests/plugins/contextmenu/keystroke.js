/* bender-tags: editor, bug */
/* bender-ckeditor-plugins: clipboard,contextmenu */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			name: 'classic'
		},
		inline: {
			name: 'inline',
			creator: 'inline'
		}
	};

	var tests = {
		'test opening context menu with keystroke': function( editor ) {
			// Test is unstable on Firefox, because context menu is showing asynchronously and in Firefox its after 'contextMenu' event.
			// Adding longer timeout like 200ms still doesn't guarantee that test will pass on Firefox.
			if ( CKEDITOR.env.gecko ) {
				assert.ignore();
			}

			var range = new CKEDITOR.dom.range( editor.document ),
				selectionRect;

			range.setStart( editor.editable().getFirst(), 0 );

			range.select();

			selectionRect = range.getClientRects( true )[ 0 ];

			editor.once( 'panelShow', function( evt ) {
				setTimeout( function() {
					resume( function() {
						var element = evt.data.element,
							elementRect = element.getClientRect( true );

						// Edge and IE have values differing by small factor, letls ignore that, because it's not important for context menu positioning.
						assert.isNumberInRange( elementRect.left, selectionRect.right - 0.1, selectionRect.left + 0.1 );
						assert.isNumberInRange( elementRect.top, selectionRect.bottom - 0.1, selectionRect.bottom + 0.1 );
					} );
				} );
			} );

			editor.execCommand( 'contextMenu' );
			wait();
		}
	};


	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );

} )();
