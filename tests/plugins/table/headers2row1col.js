/* bender-tags: editor */
/* bender-ckeditor-plugins: table*/
/* bender-include: ./_helpers/headersCorrectness.js */
/* global assertHeadersCorrectnesssAfterManipulation */

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

		'2 rows, 1 col, none -> none': assertHeadersCorrectnesssAfterManipulation( 'none', 'none', 'none' ),

		'2 rows, 1 col, none -> col': assertHeadersCorrectnesssAfterManipulation( 'none', 'col', 'col' ),

		'2 rows, 1 col, none -> row': assertHeadersCorrectnesssAfterManipulation( 'none', 'row', 'row' ),

		'2 rows, 1 col, none -> both': assertHeadersCorrectnesssAfterManipulation( 'none', 'both', 'both' ),

		'2 rows, 1 col, col -> none': assertHeadersCorrectnesssAfterManipulation( 'col', 'none', 'none' ),

		'2 rows, 1 col, col -> col': assertHeadersCorrectnesssAfterManipulation( 'col', 'col', 'col' ),

		'2 rows, 1 col, col -> row': assertHeadersCorrectnesssAfterManipulation( 'col', 'row', 'row' ),

		'2 rows, 1 col, col -> both': assertHeadersCorrectnesssAfterManipulation( 'col', 'both', 'both' ),

		'2 rows, 1 col, row -> none': assertHeadersCorrectnesssAfterManipulation( 'row', 'none', 'none' ),

		'2 rows, 1 col, row -> col': assertHeadersCorrectnesssAfterManipulation( 'row', 'col', 'col' ),

		'2 rows, 1 col, row -> row': assertHeadersCorrectnesssAfterManipulation( 'row', 'row', 'row' ),

		'2 rows, 1 col, row -> both': assertHeadersCorrectnesssAfterManipulation( 'row', 'both', 'both' ),

		'2 rows, 1 col, both -> none': assertHeadersCorrectnesssAfterManipulation( 'both', 'none', 'none' ),

		'2 rows, 1 col, both -> col': assertHeadersCorrectnesssAfterManipulation( 'both', 'col', 'col' ),

		'2 rows, 1 col, both -> row': assertHeadersCorrectnesssAfterManipulation( 'both', 'row', 'row' ),

		'2 rows, 1 col, both -> both': assertHeadersCorrectnesssAfterManipulation( 'both', 'both', 'both' )
	} );

} )();
