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
				'1 row, 2 cols, none -> both': true,
				'1 row, 2 cols, row -> col': true,
				'1 row, 2 cols, both -> col': true
			}
		},

		'1 row, 2 cols, none -> none': testHeadersManipulation( 'none', 'none', 'none' ),

		'1 row, 2 cols, none -> col': testHeadersManipulation( 'none', 'col', 'col' ),

		'1 row, 2 cols, none -> row': testHeadersManipulation( 'none', 'row', 'row' ),

		'1 row, 2 cols, none -> both': testHeadersManipulation( 'none', 'both', 'both' ),

		'1 row, 2 cols, col -> none': testHeadersManipulation( 'col', 'none', 'none' ),

		'1 row, 2 cols, col -> col': testHeadersManipulation( 'col', 'col', 'col' ),

		'1 row, 2 cols, col -> row': testHeadersManipulation( 'col', 'row', 'row' ),

		'1 row, 2 cols, col -> both': testHeadersManipulation( 'col', 'both', 'both' ),

		'1 row, 2 cols, row -> none': testHeadersManipulation( 'row', 'none', 'none' ),

		'1 row, 2 cols, row -> col': testHeadersManipulation( 'row', 'col', 'col' ),

		'1 row, 2 cols, row -> row': testHeadersManipulation( 'row', 'row', 'row' ),

		'1 row, 2 cols, row -> both': testHeadersManipulation( 'row', 'both', 'both' ),

		'1 row, 2 cols, both -> none': testHeadersManipulation( 'both', 'none', 'none' ),

		'1 row, 2 cols, both -> col': testHeadersManipulation( 'both', 'col', 'col' ),

		'1 row, 2 cols, both -> row': testHeadersManipulation( 'both', 'row', 'row' ),

		'1 row, 2 cols, both -> both': testHeadersManipulation( 'both', 'both', 'both' )
	} );

} )();
