/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKTester.fort.getProfile = function() {
	// Note : All paths specified below should refer to CKTester project root are generated automatically by fort tool. 
	return {
		cells: [
			[ '../dt/core/ajax', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/bootstrap', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/ckeditor', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/dom/document', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/dom/documentfragment', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/dom/element', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/dom/node', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/dom/range', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/dom/text', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/dom/walker', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/dom/window', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/editor', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/env', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/event', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/htmlparser/fragment', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/htmlparser/htmlparser', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/plugins', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/scriptloader', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/tools', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/core/xml', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/plugins/domiterator/domiterator', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/plugins/htmldataprocessor/htmldataprocessor', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/plugins/jquery/jquery', [ 'editor', 'unit', 'jquery' ] ],
			[ '../dt/plugins/link/link', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/plugins/list/list', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/plugins/selection/selection', [ 'editor', 'unit', 'stable' ] ],
			[ '../dt/plugins/styles/styles', [ 'editor', 'unit', 'stable' ] ],
			[ '../tt/3009/3009', [ 'editor', 'unit', 'all' ] ],
			[ '../tt/3978/3978', [ 'editor', 'unit', 'all' ] ],
			[ '../tt/4048/4048', [ 'editor', 'unit', 'all' ] ],
			[ '../tt/4219/4219', [ 'editor', 'unit', 'all' ] ],
			[ '../tt/4227/4227', [ 'editor', 'unit', 'all' ] ]
			],

		cellResolvers: [
			function( cell )
			{
			var tags = cell.tags,
				env = cell.environment;

			// Inject CKEditor source.
			if ( ( tags.indexOf( 'editor' ) != -1 ) && ( tags.indexOf( 'editor-ondemand' ) == -1 ) )
				env.push( '${CKEDITOR_ROOT}/ckeditor_source.js' );
			else if ( tags.indexOf( 'editor-ondemand' ) )
				env.push( '${CKEDITOR_ROOT}/ckeditor_basic_source.js' );

			// Inject CKEditor unit test library.
			if ( tags.indexOf( 'unit' ) != -1 )
				env.push( '${CKEDITOR_ROOT}/_source/core/test.js' );

			if ( tags.indexOf( 'jquery' ) != -1 )
				env.push( 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js' );

			if ( tags.indexOf( 'jquery-form' ) != -1 )
				env.push( 'http://malsup.com/jquery/form/jquery.form.js' );
		}
		]
	};
};
