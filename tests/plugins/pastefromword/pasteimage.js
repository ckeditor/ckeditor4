/* bender-tags: editor,clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword */

( function() {
	'use strict';

	bender.editor = true;

	function testOutput( name, editor ) {
		bender.tools.testInputOut( name, function( input, output ) {
			bender.assert.beautified.html( output, CKEDITOR.cleanWord( input, editor ) , name );
		} );
	}

	CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( '/plugins/pastefromword/filter/default.js' ), function() {
		bender.test( {
			init: function() {
				this.isCustomDataTypesSupported = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported;
			},

			// (http://dev.ckeditor.com/ticket/16912)
			'test root image': function() {
				testOutput( this.isCustomDataTypesSupported ? 'root-image' : 'root-image-simple', this.editor );
			},

			'test nested image': function() {
				testOutput( this.isCustomDataTypesSupported ? 'nested-image' : 'nested-image-simple', this.editor );
			}
		} );
	}, null, true );
} )();
