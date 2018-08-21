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
			// Test is unstable on Firefox, because context menu is showing asynchronously after 'contextMenu' event.
			// Adding longer timeout like 200ms still doesn't guarantee that test will pass on Firefox.
			if ( CKEDITOR.env.gecko ) {
				assert.ignore();
			}

			var range = new CKEDITOR.dom.range( editor.document ),
				selectionRect,
				frame = CKEDITOR.document.getWindow().getFrame();

			// Context menu uses frame height to calculate if it fits inside and bender dashboard puts tests in frame with 70px height.
			frame.setStyle( 'height', '500px' );

			range.setStart( editor.editable().getFirst(), 0 );
			range.select();

			selectionRect = range.getClientRects( true ).pop();
			editor.once( 'panelShow', function( evt ) {
				setTimeout( function() {
					resume( function() {
						var element = evt.data.element,
							elementRect = element.getClientRect( true );

						// Edge and IE have values differing by small factor, let's ignore that, because it's not important for context menu positioning.
						assert.isNumberInRange( elementRect.left, selectionRect.right - 0.1, selectionRect.left + 0.1 );
						assert.isNumberInRange( elementRect.top, selectionRect.bottom - 0.1, selectionRect.bottom + 0.1 );

						frame.removeStyle( 'height' );
					} );
				} );
			} );

			editor.execCommand( 'contextMenu' );
			wait();
		}
	};


	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );

} )();
