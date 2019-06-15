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
			// Test with inline editor fails because of the #549 issue.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 && editor.editable().isInline() ) {
				assert.ignore();
			}

			var range = new CKEDITOR.dom.range( editor.document ),
				selectionRect,
				frame = CKEDITOR.document.getWindow().getFrame();

			// Context menu uses frame height to calculate if it fits inside and bender dashboard puts tests in frame with 70px height.
			if ( frame ) {
				frame.setStyle( 'height', '500px' );
			}

			range.setStart( editor.editable().getFirst(), 0 );
			range.select();

			selectionRect = range.getClientRects().pop();

			var stub = sinon.stub( editor.contextMenu, 'open' );

			editor.execCommand( 'contextMenu' );

			assert.areSame( 1, stub.callCount );
			assert.areSame( editor.document.getBody().getParent(), stub.args[ 0 ][ 0 ] );
			assert.isNull( stub.args[ 0 ][ 1 ] );
			assert.areSame( selectionRect.left, stub.args[ 0 ][ 2 ] );
			assert.areSame( selectionRect.bottom, stub.args[ 0 ][ 3 ] );

			stub.restore();
		}
	};


	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests ) );

} )();
