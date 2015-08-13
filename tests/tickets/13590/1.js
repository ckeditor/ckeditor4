/* bender-tags: clipboard,pastefromword,11215,8780,9685,12740,13616 */
/* bender-ckeditor-plugins: clipboard,pastefromword,format,ajax,basicstyles,font */
/* bender-include: ../../plugins/clipboard/_helpers/pasting.js */
/* global assertPasteEvent */

( function() {
	'use strict';

	bender.editor = {
		config: {
			// Disable pasteFilter on Webkits (pasteFilter defaults semantic-text on Webkits).
			pasteFilter: null,
			pasteFromWordRemoveFontStyles: false,
			pasteFromWordRemoveStyles: false
		}
	};

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
		// #11215
		'test tc1 - Word Viewer': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc1_word_viewer_' + engineName + '.html', testWordFilter( this.editor ) );
		},

		// #8780, #9685
		'test tc2 - Word Viewer': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc2_word_viewer_' + engineName + '.html', testWordFilter( this.editor ) );
		},

		// #12762
		'test tc3 - Word Viewer': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc3_word_viewer_' + engineName + '.html', testWordFilter( this.editor ) );
		},

		// #12740 - "Minimum file to reproduce the problem."
		'test tc4 - Word Viewer': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc4_word_viewer_' + engineName + '.html', testWordFilter( this.editor ) );
		},

		// #12740 - "word file causing the error message"
		'test tc5 - Word Viewer': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc5_word_viewer_' + engineName + '.html', testWordFilter( this.editor ) );
		},

		// #13616
		'test tc6 - Word Viewer': function() {
			if ( !engineName )
				assert.ignore();

			bender.tools.testExternalInputOutput( '_assets/tc6_word_viewer_' + engineName + '.html', testWordFilter( this.editor ) );
		}

	} );
} )();
