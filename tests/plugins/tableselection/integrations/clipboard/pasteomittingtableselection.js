/* bender-tags: tableselection, clipboard */
/* bender-ckeditor-plugins: undo,tableselection,blockquote,divarea */
/* bender-include: ../../_helpers/tableselection.js */
/* global createPasteTestCase */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		},
		divarea: {
			config: {
				extraPlugins: 'divarea'
			}
		}
	};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},

		// (#875)
		'test pasting after selecting all': createPasteTestCase( 'text', 'text-paste' ),

		'test pasting with part of blockquote selected': createPasteTestCase( 'inside-blockquote', 'text-paste' ),

		'test pasting with whole blockquote selected': createPasteTestCase( 'all-blockquote', 'text-paste' ),

		'test isBoundaryWithoutTable case': createPasteTestCase( 'boundary-without-table', 'text-paste' ),
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
