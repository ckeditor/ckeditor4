/* bender-tags: editor,unit,pastefromword */
/* bender-ckeditor-plugins: clipboard,pastefromword,ajax */
/* global assertPasteEvent */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	function compat( html ) {
		return bender.tools.compatHtml( html, 1, 1, 1, 1 );
	}

	function testWordFilter( editor, input, output ) {
		assertPasteEvent(
			editor, { dataValue: input },
			function( data, msg ) {
				assert.isMatching( output, compat( editor.dataProcessor.toHtml( data.dataValue ) ), msg );
			},
			'tc1', true
		);
	}

	bender.test( {
		'test paste table': function() {
			var output = compat( CKEDITOR.document.getById( 'outputHtml' ).getValue() );
			// For some reason Safari 7 changes the width.
			output = new RegExp( output.replace( /213/g, '(212|213)' ) );
			testWordFilter( this.editor, CKEDITOR.document.getById( 'inputHtml' ).getValue(), output );
		}
	} );
} )();