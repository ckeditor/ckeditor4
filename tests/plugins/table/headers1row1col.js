/* bender-tags: editor */
/* bender-ckeditor-plugins: table */
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
				'1 row, 1 col, none -> both': true,
				'1 row, 1 col, row -> col': true,
				'1 row, 1 col, both -> col': true
			}
		},

		'1 row, 1 col, none -> none': assertHeadersCorrectnesssAfterManipulation( 'none', 'none', 'none' ),

		'1 row, 1 col, none -> col': assertHeadersCorrectnesssAfterManipulation( 'none', 'col', 'col' ),

		'1 row, 1 col, none -> row': assertHeadersCorrectnesssAfterManipulation( 'none', 'row', 'row' ),

		'1 row, 1 col, none -> both': assertHeadersCorrectnesssAfterManipulation( 'none', 'both', 'both' ),

		'1 row, 1 col, col -> none': assertHeadersCorrectnesssAfterManipulation( 'col', 'none', 'none' ),

		'1 row, 1 col, col -> col': assertHeadersCorrectnesssAfterManipulation( 'col', 'col', 'col' ),

		'1 row, 1 col, col -> row': assertHeadersCorrectnesssAfterManipulation( 'col', 'row', 'row' ),

		'1 row, 1 col, col -> both': assertHeadersCorrectnesssAfterManipulation( 'col', 'both', 'both' ),

		'1 row, 1 col, row -> none': assertHeadersCorrectnesssAfterManipulation( 'row', 'none', 'none' ),

		'1 row, 1 col, row -> col': assertHeadersCorrectnesssAfterManipulation( 'row', 'col', 'col' ),

		'1 row, 1 col, row -> row': assertHeadersCorrectnesssAfterManipulation( 'row', 'row', 'row' ),

		'1 row, 1 col, row -> both': assertHeadersCorrectnesssAfterManipulation( 'row', 'both', 'both' ),

		'1 row, 1 col, both -> none': assertHeadersCorrectnesssAfterManipulation( 'both', 'none', 'none' ),

		'1 row, 1 col, both -> col': assertHeadersCorrectnesssAfterManipulation( 'both', 'col', 'col' ),

		'1 row, 1 col, both -> row': assertHeadersCorrectnesssAfterManipulation( 'both', 'row', 'row' ),

		'1 row, 1 col, both -> both': assertHeadersCorrectnesssAfterManipulation( 'both', 'both', 'both' )
	} );

} )();
