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
				'2 rows, 2 cols, none -> both': true,
				'2 rows, 2 cols, row -> both': true,
				'2 rows, 2 cols, both -> col': true
			}
		},

		'2 rows, 2 cols, none -> none': assertHeadersCorrectnesssAfterManipulation( 'header-none', 'header-none', 'none' ),

		'2 rows, 2 cols, none -> col': assertHeadersCorrectnesssAfterManipulation( 'header-none', 'header-col', 'col' ),

		'2 rows, 2 cols, none -> row': assertHeadersCorrectnesssAfterManipulation( 'header-none', 'header-row', 'row' ),

		'2 rows, 2 cols, none -> both': assertHeadersCorrectnesssAfterManipulation( 'header-none', 'header-both', 'both' ),

		'2 rows, 2 cols, col -> none': assertHeadersCorrectnesssAfterManipulation( 'header-col', 'header-none', 'none' ),

		'2 rows, 2 cols, col -> col': assertHeadersCorrectnesssAfterManipulation( 'header-col', 'header-col', 'col' ),

		'2 rows, 2 cols, col -> row': assertHeadersCorrectnesssAfterManipulation( 'header-col', 'header-row', 'row' ),

		'2 rows, 2 cols, col -> both': assertHeadersCorrectnesssAfterManipulation( 'header-col', 'header-both', 'both' ),

		'2 rows, 2 cols, row -> none': assertHeadersCorrectnesssAfterManipulation( 'header-row', 'header-none', 'none' ),

		'2 rows, 2 cols, row -> col': assertHeadersCorrectnesssAfterManipulation( 'header-row', 'header-col', 'col' ),

		'2 rows, 2 cols, row -> row': assertHeadersCorrectnesssAfterManipulation( 'header-row', 'header-row', 'row' ),

		'2 rows, 2 cols, row -> both': assertHeadersCorrectnesssAfterManipulation( 'header-row', 'header-both', 'both' ),

		'2 rows, 2 cols, both -> none': assertHeadersCorrectnesssAfterManipulation( 'header-both', 'header-none', 'none' ),

		'2 rows, 2 cols, both -> col': assertHeadersCorrectnesssAfterManipulation( 'header-both', 'header-col', 'col' ),

		'2 rows, 2 cols, both -> row': assertHeadersCorrectnesssAfterManipulation( 'header-both', 'header-row', 'row' ),

		'2 rows, 2 cols, both -> both': assertHeadersCorrectnesssAfterManipulation( 'header-both', 'header-both', 'both' )
	} );

} )();
