/* bender-tags: editor,clipboard,pastefromword */
/* bender-ckeditor-plugins: pastetools, pastefromword */
/* bender-include: generated/_helpers/pfwTools.js */
/* global pfwTools */

( function() {
	'use strict';

	bender.editor = true;

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

	pfwTools.loadFilters( [
		CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js' ),
		CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'pastefromword' ) + 'filter/default.js' )
	], function() {
		bender.test( tests );
	} );

	function testOutput( name, editor ) {
		bender.tools.testInputOut( name, function( input, output ) {
			bender.assert.beautified.html( output, CKEDITOR.cleanWord( input, editor ) , name );
		} );
	}
} )();
