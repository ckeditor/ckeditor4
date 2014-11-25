/* bender-tags: editor,unit,pastefromword */
/* bender-ckeditor-plugins: clipboard,pastefromword,ajax */
/* global assertPasteEvent */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: 'ol li p'
		}
	};

	var compat = bender.tools.compatHtml,
		engineName = CKEDITOR.env.webkit ? 'webkit' :
			CKEDITOR.env.ie ? 'ie' :
			CKEDITOR.env.gecko ? 'gecko' :
			null;

	function testWordFilter( editor ) {
		return function( input, output ) {
			assertPasteEvent(
				editor, { dataValue: input },
				function( data, msg ) {
					// Pass through data processor to filter the output from garbage which is produced
					// by pastefromword plugin for this case.
					assert.areSame( compat( output ), compat( editor.dataProcessor.toHtml( data.dataValue ) ), msg );
				},
				'tc1', true
			);
		};
	}

	bender.test( {
		'test tc1 - word2010': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc1_word2010_' + engineName + '.html', testWordFilter( this.editor ) );
		}
	} );
} )();