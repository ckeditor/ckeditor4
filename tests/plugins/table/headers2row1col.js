/* bender-tags: editor */
/* bender-ckeditor-plugins: table*/
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
		'2 rows, 1 col, none -> none': testHeadersManipulation( 'none', 'none' ),

		'2 rows, 1 col, none -> col': testHeadersManipulation( 'none', 'col' ),

		'2 rows, 1 col, none -> row': testHeadersManipulation( 'none', 'row' ),

		'2 rows, 1 col, none -> both': testHeadersManipulation( 'none', 'both' ),

		'2 rows, 1 col, col -> none': testHeadersManipulation( 'col', 'none' ),

		'2 rows, 1 col, col -> col': testHeadersManipulation( 'col', 'col' ),

		'2 rows, 1 col, col -> row': testHeadersManipulation( 'col', 'row' ),

		'2 rows, 1 col, col -> both': testHeadersManipulation( 'col', 'both' ),

		'2 rows, 1 col, row -> none': testHeadersManipulation( 'row', 'none' ),

		'2 rows, 1 col, row -> col': testHeadersManipulation( 'row', 'col' ),

		'2 rows, 1 col, row -> row': testHeadersManipulation( 'row', 'row' ),

		'2 rows, 1 col, row -> both': testHeadersManipulation( 'row', 'both' ),

		'2 rows, 1 col, both -> none': testHeadersManipulation( 'both', 'none' ),

		'2 rows, 1 col, both -> col': testHeadersManipulation( 'both', 'col' ),

		'2 rows, 1 col, both -> row': testHeadersManipulation( 'both', 'row' ),

		'2 rows, 1 col, both -> both': testHeadersManipulation( 'both', 'both' )
	} );

} )();
