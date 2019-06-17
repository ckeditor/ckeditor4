/* bender-tags: tableselection, clipboard */
/* bender-ckeditor-plugins: undo,tableselection */
/* bender-ckeditor-remove-plugins: dialogadvtab */
/* bender-include: ../../_helpers/tableselection.js */
/* global createPasteTestCase */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},
		'test paste 2x1 table into nested 2x1 table': createPasteTestCase( 'nested-2x1-2x1', 'paste-2x1' ),
		'test paste 2x2 table into nested 2x1 table': createPasteTestCase( 'nested-2x1-2x2', 'paste-2x2' ),
		'test paste 1x1 table into nested 2x1 table': createPasteTestCase( 'nested-2x1-1x1', 'paste-1x1' ),
		'test paste 2x1 table into partially selected nested 2x1 table': createPasteTestCase( 'nested-2x1-2x1-partially', 'paste-2x1' ),
		'test paste 2x2 table into partially selected nested 2x1 table': createPasteTestCase( 'nested-2x1-2x2-partially', 'paste-2x2' ),
		'test paste 1x1 table into partially selected nested 2x1 table': createPasteTestCase( 'nested-2x1-1x1-partially', 'paste-1x1' ),
		'test paste 2x2 table into collapsed sel': createPasteTestCase( 'nested-2x1-2x2-caret', 'paste-2x2' ),
		'test paste 2x2 table into collapsed sel boundary': createPasteTestCase( 'nested-2x2-2x2-caret-boundary', 'paste-2x2' )
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
