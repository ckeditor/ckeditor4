/* bender-tags: editor */
/* bender-ckeditor-plugins: table */
/* bender-include: ./_helpers/testheadersmanipulation.js */
/* global testHeadersManipulation */

( function() {
	'use strict';

	bender.editors = {
		editor: {
			name: 'editor1'
		}
	};

	bender.test( {
		'1 row, 1 col, none -> none': testHeadersManipulation( 'none', 'none' ),

		'1 row, 1 col, none -> col': testHeadersManipulation( 'none', 'col' ),

		'1 row, 1 col, none -> row': testHeadersManipulation( 'none', 'row' ),

		'1 row, 1 col, none -> both': testHeadersManipulation( 'none', 'both' ),

		'1 row, 1 col, col -> none': testHeadersManipulation( 'col', 'none' ),

		'1 row, 1 col, col -> col': testHeadersManipulation( 'col', 'col' ),

		'1 row, 1 col, col -> row': testHeadersManipulation( 'col', 'row' ),

		'1 row, 1 col, col -> both': testHeadersManipulation( 'col', 'both' ),

		'1 row, 1 col, row -> none': testHeadersManipulation( 'row', 'none' ),

		'1 row, 1 col, row -> col': testHeadersManipulation( 'row', 'col' ),

		'1 row, 1 col, row -> row': testHeadersManipulation( 'row', 'row' ),

		'1 row, 1 col, row -> both': testHeadersManipulation( 'row', 'both' ),

		'1 row, 1 col, both -> none': testHeadersManipulation( 'both', 'none' ),

		'1 row, 1 col, both -> col': testHeadersManipulation( 'both', 'col' ),

		'1 row, 1 col, both -> row': testHeadersManipulation( 'both', 'row' ),

		'1 row, 1 col, both -> both': testHeadersManipulation( 'both', 'both' )
	} );

} )();
