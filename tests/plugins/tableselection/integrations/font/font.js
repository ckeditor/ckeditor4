/* bender-tags: tableselection, font */
/* bender-ckeditor-plugins: font, tableselection */
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
		'test same font size in multiple cells': function( editor, bot ) {
			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'same-size' ).getValue() );

			assertComboValue( editor, 'FontSize', '20' );
		},

		'test different font size in multiple cells': function( editor, bot ) {
			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'different-size' ).getValue() );

			assertComboValue( editor, 'FontSize', '' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	tableSelectionHelpers.ignoreUnsupportedEnvironment( tests );

	bender.test( tests );
} )();
