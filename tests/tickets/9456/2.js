/* bender-tags: editor,unit,pastefromword */
/* bender-ckeditor-plugins: clipboard,pastefromword,format,ajax,basicstyles */
/* global assertPasteEvent */

( function() {
	'use strict';

	bender.editor = true;

	var compat = bender.tools.compatHtml,
		engineName = CKEDITOR.env.webkit ? 'webkit' :
			CKEDITOR.env.ie ? 'ie' :
			CKEDITOR.env.gecko ? 'gecko' :
			null;

	function testWordFilter( editor ) {
		return function( input, output ) {
			assertPasteEvent( editor, { dataValue: input },
			function( data, msg ) {
				assert.areSame( compat( output ).toLowerCase(), compat( data.dataValue ).toLowerCase(), msg );
			}, 'tc1', true );
		};
	}

	bender.test( {
		'test tc1 - word2003': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc1_word2003_' + engineName + '.html', testWordFilter( this.editor ) );
		},
		'test tc1 - word2007': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc1_word2007_' + engineName + '.html', testWordFilter( this.editor ) );
		},
		'test tc1 - word2010': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc1_word2010_' + engineName + '.html', testWordFilter( this.editor ) );
		},

		'test tc2 - word2007': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc2_word2007_' + engineName + '.html', testWordFilter( this.editor ) );
		},
		'test tc2 - word2010': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc2_word2010_' + engineName + '.html', testWordFilter( this.editor ) );
		},

		'test tc3 - word2007': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc3_word2007_' + engineName + '.html', testWordFilter( this.editor ) );
		},
		'test tc3 - word2010': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc3_word2010_' + engineName + '.html', testWordFilter( this.editor ) );
		},

		'test tc4 - word2007': function() {
			if ( engineName != 'webkit' )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc4_word2007_' + engineName + '.html', testWordFilter( this.editor ) );
		}
	} );
} )();