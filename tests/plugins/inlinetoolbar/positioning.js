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

	var parentFrame = window.frameElement,
		originalHeight = parentFrame && parentFrame.style.height;
	function makeExpectedLeft( data ) {
		if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 9 ) {
			return data.toFixed( 0 ) + '.00';
		} else {
			return data.toFixed( 2 );
		}
	}

	var tests = {
		setUp: function() {
			// In IE8 tests are run in very small window which breaks positioning assertions and tests fails (#1076).
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}
			if ( parentFrame ) {
				parentFrame.style.height = '900px';
			}
		},

		tearDown: function() {
			if ( parentFrame ) {
				parentFrame.style.height = originalHeight;
			}
		},

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
				inlineToolbarRect;

			inlineToolbar.create( markerElement );
			inlineToolbarRect = inlineToolbar.parts.panel.getClientRect();

			var expectedLeft = makeExpectedLeft( frame.left + elementFrame.left + elementFrame.width / 2 - 50 );
			assert.areEqual( expectedLeft, inlineToolbarRect.left.toFixed( 2 ), 'left align' );
			// We have to add 1px because of border.
			assert.areEqual( ( inlineToolbarRect.top + inlineToolbar.height + inlineToolbar.triangleHeight + 1 ).toFixed( 2 ),
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
				inlineToolbarRect;

			markerElement.getParent().getNext().scrollIntoView( true );
			inlineToolbar.create( markerElement );
			inlineToolbarRect = inlineToolbar.parts.panel.getClientRect();

			var expectedLeft = makeExpectedLeft( frame.left + elementFrame.left + elementFrame.width / 2 - 50 );
			assert.areEqual( expectedLeft, inlineToolbarRect.left.toFixed( 2 ), 'left align' );
			assert.areEqual( frame.top.toFixed( 2 ), ( inlineToolbarRect.top - inlineToolbar.triangleHeight ).toFixed( 2 ), 'top align' );
			inlineToolbar.destroy();
			inlineToolbar = null;
		},

		'test panel adds cke_inlinetoolbar class': function( editor ) {
			var inlineToolbar = new CKEDITOR.ui.inlineToolbarView( editor, {
				width: 100,
				height: 200
			} ),
				markerElement = editor.editable().findOne( '#marker' );
			inlineToolbar.create( markerElement );

			assert.isTrue( inlineToolbar.parts.panel.hasClass( 'cke_inlinetoolbar' ), 'Panel has a cke_inlinetoolbar class' );
			assert.isTrue( inlineToolbar.parts.panel.hasClass( 'cke_balloon' ), 'Class cke_balloon class was not removed' );
			inlineToolbar.destroy();
			inlineToolbar = null;
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
