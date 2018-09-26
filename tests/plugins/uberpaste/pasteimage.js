/* bender-tags: editor,clipboard,uberpaste */
/* bender-ckeditor-plugins: uberpaste */

( function() {
	'use strict';

	bender.editor = true;

	function testOutput( name, editor ) {
		bender.tools.testInputOut( name, function( input, output ) {
			bender.assert.beautified.html( output, CKEDITOR.cleanPaste( input, editor, 'word' ) , name );
		} );
	}

	CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( '/plugins/uberpaste/filter/default.js' ), function() {
		bender.test( {
			init: function() {
				this.isCustomDataTypesSupported = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported;
			},

			// (https://dev.ckeditor.com/ticket/16912)
			'test root image': function() {
				testOutput( this.isCustomDataTypesSupported ? 'root-image' : 'root-image-simple', this.editor );
			},

			'test nested image': function() {
				testOutput( this.isCustomDataTypesSupported ? 'nested-image' : 'nested-image-simple', this.editor );
			}
		} );
	}, null, true );
} )();
