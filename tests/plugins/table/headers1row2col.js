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
				'1 row, 2 cols, none -> both': true,
				'1 row, 2 cols, row -> col': true,
				'1 row, 2 cols, both -> col': true
			}
		},

		'1 row, 2 cols, none -> none': assertHeadersCorrectnesssAfterManipulation( 'none', 'none', 'none' ),

		'1 row, 2 cols, none -> col': assertHeadersCorrectnesssAfterManipulation( 'none', 'col', 'col' ),

		'1 row, 2 cols, none -> row': assertHeadersCorrectnesssAfterManipulation( 'none', 'row', 'row' ),

		'1 row, 2 cols, none -> both': assertHeadersCorrectnesssAfterManipulation( 'none', 'both', 'both' ),

		'1 row, 2 cols, col -> none': assertHeadersCorrectnesssAfterManipulation( 'col', 'none', 'none' ),

		'1 row, 2 cols, col -> col': assertHeadersCorrectnesssAfterManipulation( 'col', 'col', 'col' ),

		'1 row, 2 cols, col -> row': assertHeadersCorrectnesssAfterManipulation( 'col', 'row', 'row' ),

		'1 row, 2 cols, col -> both': assertHeadersCorrectnesssAfterManipulation( 'col', 'both', 'both' ),

		'1 row, 2 cols, row -> none': assertHeadersCorrectnesssAfterManipulation( 'row', 'none', 'none' ),

		'1 row, 2 cols, row -> col': assertHeadersCorrectnesssAfterManipulation( 'row', 'col', 'col' ),

		'1 row, 2 cols, row -> row': assertHeadersCorrectnesssAfterManipulation( 'row', 'row', 'row' ),

		'1 row, 2 cols, row -> both': assertHeadersCorrectnesssAfterManipulation( 'row', 'both', 'both' ),

		'1 row, 2 cols, both -> none': assertHeadersCorrectnesssAfterManipulation( 'both', 'none', 'none' ),

		'1 row, 2 cols, both -> col': assertHeadersCorrectnesssAfterManipulation( 'both', 'col', 'col' ),

		'1 row, 2 cols, both -> row': assertHeadersCorrectnesssAfterManipulation( 'both', 'row', 'row' ),

		'1 row, 2 cols, both -> both': assertHeadersCorrectnesssAfterManipulation( 'both', 'both', 'both' )
	} );

} )();
