/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: pastetools, pastefromgdocs */

( function() {
	'use strict';

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
