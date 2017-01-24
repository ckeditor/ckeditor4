/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,dialog,tabletools,clipboard,toolbar */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	function _addPasteListener( editor, callback ) {
		// Since currently tabletools cancel afterPaste event, we need to do some setTimeout trickery.
		editor.once( 'paste', function() {
			setTimeout( function() {
				resume( function() {
					if ( callback ) {
						callback();
					}
				} );
			}, 100 );
		}, null, null, 1 );
	}

	function createPasteTest( selectedTable, pastedTable ) {
		return function( editor, bot ) {
			bender.tools.testInputOut( selectedTable, function( source, expected ) {
				bot.setHtmlWithSelection( source );

				_addPasteListener( editor, function() {
					bender.assert.beautified.html( expected, bot.editor.getData() );
				} );

				bender.tools.emulatePaste( editor, CKEDITOR.document.getById( pastedTable ).getOuterHtml() );

				wait();
			} );
		};
	}

	var tests = {
			'test paste 2x1 table into nested 2x1 table': createPasteTest( 'nested-2x1-2x1', 'paste-2x1' ),
			'test paste 2x2 table into nested 2x1 table': createPasteTest( 'nested-2x1-2x2', 'paste-2x2' ),
			'test paste 1x1 table into nested 2x1 table': createPasteTest( 'nested-2x1-1x1', 'paste-1x1' ),
			'test paste 2x1 table into partially selected nested 2x1 table': createPasteTest( 'nested-2x1-2x1-partially', 'paste-2x1' ),
			'test paste 2x2 table into partially selected nested 2x1 table': createPasteTest( 'nested-2x1-2x2-partially', 'paste-2x2' ),
			'test paste 1x1 table into partially selected nested 2x1 table': createPasteTest( 'nested-2x1-1x1-partially', 'paste-1x1' )
		};

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );
} )();
