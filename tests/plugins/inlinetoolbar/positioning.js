/* bender-tags: inlinetoolbar */
/* bender-ckeditor-plugins: toolbar,link,inlinetoolbar */

( function() {
	'use strict';
	bender.editors = {
		editor1: {
			name: 'editor1',
			creator: 'replace',
			config: {
				extraAllowedContent: 'span[id];p{height}',
				height: 200
			}
		},
		divarea: {
			name: 'divarea',
			creator: 'replace',
			config: {
				extraPlugins: 'divarea',
				extraAllowedContent: 'span[id];p{height}',
				height: 200
			}
		}
	};

	var tests = {
		'test divaera - out of view - bottom center': function( editor ) {
			if ( editor.name == 'divarea' ) {
				// divarea tests are failing, it's an upstream issue from balloonpanel (#1064).
				assert.ignore();
			}

			var inlineToolbar = new CKEDITOR.ui.inlineToolbarView( editor, {
				width: 100,
				height: 200
			} ),
				markerElement = editor.editable().findOne( '#marker' ),
				frame = editor.editable().isInline() ? editor.editable().getClientRect() : editor.window.getFrame().getClientRect(),
				elementFrame = markerElement.getClientRect(),
				inlineToobarRect;
			inlineToolbar.create( markerElement );
			inlineToobarRect = inlineToolbar.parts.panel.getClientRect();

			assert.areEqual( ( frame.left + elementFrame.left + elementFrame.width / 2 - 50 ).toFixed( 2 ), inlineToobarRect.left.toFixed( 2 ), 'left align' );
			//We have to add 1px because of border
			assert.areEqual( ( inlineToobarRect.top + inlineToolbar.height + inlineToolbar.triangleHeight + 1 ).toFixed( 2 ),
				( frame.top + frame.height ).toFixed( 2 ), 'top align' );
			inlineToolbar.destroy();
			inlineToolbar = null;
		},

		'test divaera - out of view - hcenter top': function( editor ) {
			if ( editor.name == 'divarea' ) {
				// divarea tests are failing, it's an upstream issue from balloonpanel (#1064).
				assert.ignore();
			}

			var inlineToolbar = new CKEDITOR.ui.inlineToolbarView( editor, {
				width: 100,
				height: 200
			} ),
				markerElement = editor.editable().findOne( '#marker' ),
				frame = editor.editable().isInline() ? editor.editable().getClientRect() : editor.window.getFrame().getClientRect(),
				elementFrame = markerElement.getClientRect(),
				inlineToobarRect;
			markerElement.getParent().getNext().scrollIntoView( true );
			inlineToolbar.create( markerElement );
			inlineToobarRect = inlineToolbar.parts.panel.getClientRect();

			assert.areEqual( ( frame.left + elementFrame.left + elementFrame.width / 2 - 50 ).toFixed( 2 ), inlineToobarRect.left.toFixed( 2 ), 'left align' );
			assert.areEqual( frame.top.toFixed( 2 ), ( inlineToobarRect.top - inlineToolbar.triangleHeight ).toFixed( 2 ), 'top align' );
			inlineToolbar.destroy();
			inlineToolbar = null;
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
