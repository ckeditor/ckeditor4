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
		_should: {
			ignore: {
				// (#2881), (#2996).
				'1 row, 1 col, none -> both': true,
				'1 row, 1 col, row -> col': true,
				'1 row, 1 col, both -> col': true
			}
		},

		'1 row, 1 col, none -> none': testHeadersManipulation( 'none', 'none', 'none' ),

		'1 row, 1 col, none -> col': testHeadersManipulation( 'none', 'col', 'col' ),

		'1 row, 1 col, none -> row': testHeadersManipulation( 'none', 'row', 'row' ),

		'1 row, 1 col, none -> both': testHeadersManipulation( 'none', 'both', 'both' ),

		'1 row, 1 col, col -> none': testHeadersManipulation( 'col', 'none', 'none' ),

		'1 row, 1 col, col -> col': testHeadersManipulation( 'col', 'col', 'col' ),

		'1 row, 1 col, col -> row': testHeadersManipulation( 'col', 'row', 'row' ),

		'1 row, 1 col, col -> both': testHeadersManipulation( 'col', 'both', 'both' ),

		'1 row, 1 col, row -> none': testHeadersManipulation( 'row', 'none', 'none' ),

		'1 row, 1 col, row -> col': testHeadersManipulation( 'row', 'col', 'col' ),

		'1 row, 1 col, row -> row': testHeadersManipulation( 'row', 'row', 'row' ),

		'1 row, 1 col, row -> both': testHeadersManipulation( 'row', 'both', 'both' ),

		'1 row, 1 col, both -> none': testHeadersManipulation( 'both', 'none', 'none' ),

		'1 row, 1 col, both -> col': testHeadersManipulation( 'both', 'col', 'col' ),

		'1 row, 1 col, both -> row': testHeadersManipulation( 'both', 'row', 'row' ),

		'1 row, 1 col, both -> both': testHeadersManipulation( 'both', 'both', 'both' )
	} );

} )();
