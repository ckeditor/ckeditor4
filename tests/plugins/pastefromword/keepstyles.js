/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: pastefromword,basicstyles,font,colorbutton */
/* global assertPasteEvent */

( function() {
	'use strict';

	bender.editor = {
		config: {
			pasteFromWordRemoveStyles: false,
			pasteFromWordRemoveFontStyles: false,
			// Disable pasteFilter on Webkits (pasteFilter defaults semantic-text on Webkits).
			pasteFilter: null
		}
	};

	var compact = bender.tools.compatHtml;

	function testWordFilter( editor ) {
		return function( input, output ) {
			assertPasteEvent( editor, {
				dataValue: compact( input, 1 )
			}, function( data ) {
				assert.areSame( compact( output ), compact( data.dataValue, 1 ) );
			}, 'tc1', true );
		};
	}

	bender.test( {
		'test transform inline & font styles': function() {
			bender.tools.testInputOut( 'list_1', testWordFilter( this.editor ) );
		}
	} );

} )();