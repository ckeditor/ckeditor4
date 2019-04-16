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
		_should: {
			ignore: {
				// (#2881), (#2996).
				'2 rows, 1 col, none -> both': true,
				'2 rows, 1 col, row -> both': true,
				'2 rows, 1 col, both -> col': true
			}
		},

		'2 rows, 1 col, none -> none': testHeadersManipulation( 'none', 'none', 'none' ),

		'2 rows, 1 col, none -> col': testHeadersManipulation( 'none', 'col', 'col' ),

		'2 rows, 1 col, none -> row': testHeadersManipulation( 'none', 'row', 'row' ),

		'2 rows, 1 col, none -> both': testHeadersManipulation( 'none', 'both', 'both' ),

		'2 rows, 1 col, col -> none': testHeadersManipulation( 'col', 'none', 'none' ),

		'2 rows, 1 col, col -> col': testHeadersManipulation( 'col', 'col', 'col' ),

		'2 rows, 1 col, col -> row': testHeadersManipulation( 'col', 'row', 'row' ),

		'2 rows, 1 col, col -> both': testHeadersManipulation( 'col', 'both', 'both' ),

		'2 rows, 1 col, row -> none': testHeadersManipulation( 'row', 'none', 'none' ),

		'2 rows, 1 col, row -> col': testHeadersManipulation( 'row', 'col', 'col' ),

		'2 rows, 1 col, row -> row': testHeadersManipulation( 'row', 'row', 'row' ),

		'2 rows, 1 col, row -> both': testHeadersManipulation( 'row', 'both', 'both' ),

		'2 rows, 1 col, both -> none': testHeadersManipulation( 'both', 'none', 'none' ),

		'2 rows, 1 col, both -> col': testHeadersManipulation( 'both', 'col', 'col' ),

		'2 rows, 1 col, both -> row': testHeadersManipulation( 'both', 'row', 'row' ),

		'2 rows, 1 col, both -> both': testHeadersManipulation( 'both', 'both', 'both' )
	} );

} )();
