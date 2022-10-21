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
		'2 rows, 2 cols, none -> none': testHeadersManipulation( 'none', 'none' ),

		'2 rows, 2 cols, none -> col': testHeadersManipulation( 'none', 'col' ),

		'2 rows, 2 cols, none -> row': testHeadersManipulation( 'none', 'row' ),

		'2 rows, 2 cols, none -> both': testHeadersManipulation( 'none', 'both' ),

		'2 rows, 2 cols, col -> none': testHeadersManipulation( 'col', 'none' ),

		'2 rows, 2 cols, col -> col': testHeadersManipulation( 'col', 'col' ),

		'2 rows, 2 cols, col -> row': testHeadersManipulation( 'col', 'row' ),

		'2 rows, 2 cols, col -> both': testHeadersManipulation( 'col', 'both' ),

		'2 rows, 2 cols, row -> none': testHeadersManipulation( 'row', 'none' ),

		'2 rows, 2 cols, row -> col': testHeadersManipulation( 'row', 'col' ),

		'2 rows, 2 cols, row -> row': testHeadersManipulation( 'row', 'row' ),

		'2 rows, 2 cols, row -> both': testHeadersManipulation( 'row', 'both' ),

		'2 rows, 2 cols, both -> none': testHeadersManipulation( 'both', 'none' ),

		'2 rows, 2 cols, both -> col': testHeadersManipulation( 'both', 'col' ),

		'2 rows, 2 cols, both -> row': testHeadersManipulation( 'both', 'row' ),

		'2 rows, 2 cols, both -> both': testHeadersManipulation( 'both', 'both' )
	} );

} )();
