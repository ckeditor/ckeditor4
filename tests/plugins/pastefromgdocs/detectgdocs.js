/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: pastetools, pastefromgdocs */

( function() {
	'use strict';

	// Ignored due to lack of support for mobiles (#3451).
	if ( bender.tools.env.mobile ) {
		bender.ignore();
	}

	bender.editor = {
		config: {
			removePlugins: 'pastefromword'
		}
	};

	var tests = {
		'test detecting GDocs content': function() {
			var gDocsHandler = this.editor.pasteTools.handlers[ 0 ];

			test( '<span id="docs-internal-guid-whatever">Test</span>' );
			test( '<whatever id=docs-internal-guid-' );

			function test( value ) {
				assert.isTrue( gDocsHandler.canHandle( { data: { dataValue: value } } ), value );
			}
		}
	};

	bender.test( tests );
} )();
