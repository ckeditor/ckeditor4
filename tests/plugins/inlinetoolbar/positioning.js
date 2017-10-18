/* bender-tags: inlinetoolbar */
/* bender-ckeditor-plugins: toolbar,link,inlinetoolbar */

/*
divarea test are failing, its upstream issue from balloonpanel. issue #1064
*/
( function() {
	'use strict';
	var createContent = function() {
		var rawData = '';
		for ( var i = 0; i < 80; i++ ) {
			rawData += '<p>This is the editor data.</p>';
			if ( i === 40 ) rawData +=  '<p>foo bar baz<span id="marker">bom</span></p>';
		}
		return rawData;
	};
	document.getElementById( 'editor1' ).innerHTML = createContent();
	document.getElementById( 'divarea' ).innerHTML = createContent();

	bender.editors = {
		editor1: {
			name: 'editor1',
			creator: 'replace',
			config: {
				extraAllowedContent: 'span[id]',
				height: 200,
				width: 600
			}
		},
		divarea: {
			name: 'divarea',
			creator: 'replace',
			config: {
				extraPlugins: 'divarea',
				extraAllowedContent: 'span[id]',
				height: 200,
				width: 600
			}
		}
	};

	var tests = {

		'test divaera - out of view - bottom center': function( editor ) {
			var inlineToolbar = new CKEDITOR.ui.inlineToolbarView( editor, {
				width: 100,
				height: 200
			} );
			var markerElement = editor.editable().findOne( '#marker' );
			var frame = editor.editable().isInline() ? editor.editable().getClientRect() : editor.window.getFrame().getClientRect();
			var elementFrame = markerElement.getClientRect();
			inlineToolbar.create( markerElement );
			var inlineToobarRect = inlineToolbar.parts.panel.getClientRect();
			assert.areEqual( frame.left + elementFrame.left + elementFrame.width / 2 - 50, inlineToobarRect.left, 'left align' );
			//We have to add 1px because of border
			assert.areEqual( inlineToobarRect.top + inlineToolbar.height + inlineToolbar.triangleHeight + 1,
				frame.top + frame.height, 'top align' );
			inlineToolbar.destroy();
			inlineToolbar = null;
		},

		'test divaera - out of view - hcenter top': function( editor ) {
			var inlineToolbar = new CKEDITOR.ui.inlineToolbarView( editor, {
				width: 100,
				height: 200
			} );
			var markerElement = editor.editable().findOne( '#marker' );
			var frame = editor.editable().isInline() ? editor.editable().getClientRect() : editor.window.getFrame().getClientRect();
			var elementFrame = markerElement.getClientRect();
			markerElement.getParent().getNext().scrollIntoView( true );
			inlineToolbar.create( markerElement );
			var inlineToobarRect = inlineToolbar.parts.panel.getClientRect();
			assert.areEqual( frame.left + elementFrame.left + elementFrame.width / 2 - 50, inlineToobarRect.left, 'left align' );
			assert.areEqual( frame.top, inlineToobarRect.top - inlineToolbar.triangleHeight, 'top align' );
			inlineToolbar.destroy();
			inlineToolbar = null;
		}
	};
	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
