/* bender-tags: editor,clipboard,pastefromword */
/* bender-ckeditor-plugins: pastetools, pastefromword */
/* bender-include: generated/_helpers/pfwTools.js, ../pastetools/_helpers/ptTools.js */
/* global ptTools */

( function() {
	'use strict';

	bender.editor = true;

	var tests = {
		// (https://dev.ckeditor.com/ticket/16912)
		'test root image': function() {
			var editor = this.editor,
				sampleName = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ? 'root-image' : 'root-image-simple',
				filterPaths = [
					CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js' ),
					CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'pastefromword' ) + 'filter/default.js' )
				];

			return ptTools.asyncLoadFilters( filterPaths, 'CKEDITOR.cleanWord' )
				.then( testOutput( sampleName, editor ) );
		},

		'test nested image': function() {
			var editor = this.editor,
				sampleName = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ? 'nested-image' : 'nested-image-simple',
				filterPaths = [
					CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js' ),
					CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'pastefromword' ) + 'filter/default.js' )
				];

			return ptTools.asyncLoadFilters( filterPaths, 'CKEDITOR.cleanWord' )
				.then( testOutput( sampleName, editor ) );
		}
	};

	ptTools.ignoreTestsOnMobiles( tests );

	tests = bender.tools.createAsyncTests( tests );
	bender.test( tests );

	function testOutput( name, editor ) {
		return function( filter ) {
			bender.tools.testInputOut( name, function( input, output ) {
				bender.assert.beautified.html( output, filter( input, editor ) , name );
			} );
		};
	}
} )();
