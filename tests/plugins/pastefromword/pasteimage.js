/* bender-tags: editor,clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword */
/* bender-include: generated/_helpers/pfwTools.js */
/* global pfwTools */

( function() {
	'use strict';

	bender.editor = true;

	function testOutput( name, editor ) {
		bender.tools.testInputOut( name, function( input, output ) {
			bender.assert.beautified.html( output, CKEDITOR.cleanWord( input, editor ) , name );
		} );
	}

	CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( '/plugins/pastefromword/filter/default.js' ), function() {
		var tests = {
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
		};

		pfwTools.ignoreTestsOnMobiles( tests );

		bender.test( tests );
	}, null, true );
} )();
