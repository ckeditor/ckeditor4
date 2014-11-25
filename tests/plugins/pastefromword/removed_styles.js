/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: pastefromword */
/* global assertPasteEvent */

( function() {
	'use strict';

	bender.editor = {
		config: {
			pasteFromWordRemoveStyles: 1,
			pasteFromWordRemoveFontStyles: 1
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
		'test remove inline & font styles': function() {
			// Ignore this TC if basicstyles plugin is loaded (mode != DEV).
			if ( this.editor.plugins.basicstyles )
				assert.ignore();

			bender.tools.testInputOut( 'list_1', testWordFilter( this.editor ) );
		}
	} );
} )();