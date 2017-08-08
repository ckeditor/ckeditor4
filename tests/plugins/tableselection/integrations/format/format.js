/* bender-tags: tableselection, font */
/* bender-ckeditor-plugins: format, tableselection */
/* bender-include: ../../_helpers/tableselection.js */
/* global tableSelectionHelpers */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		divarea: {
			extraPlugins: 'divarea'
		},
		inline: {
			creator: 'inline'
		}
	};

	function assertComboValue( editor, comboName, expectedValue ) {
		var combo = editor.ui.get( comboName );

		assert.areSame( expectedValue, combo.getValue(), 'Combo ' + comboName + ' has appropriate value' );
	}

	var tests = {
		'test same format in multiple cells': function( editor, bot ) {
			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'same-format' ).getValue() );

			assertComboValue( editor, 'Format', 'h3' );
		},

		'test different format in multiple cells': function( editor, bot ) {
			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'different-format' ).getValue() );

			assertComboValue( editor, 'Format', '' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	tableSelectionHelpers.ignoreUnsupportedEnvironment( tests );

	bender.test( tests );
} )();
