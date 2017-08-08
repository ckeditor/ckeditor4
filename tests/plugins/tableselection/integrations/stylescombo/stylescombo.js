/* bender-tags: tableselection, font */
/* bender-ckeditor-plugins: stylescombo, tableselection */
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
		'test same styles in multiple cells': function( editor, bot ) {
			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'same-styles' ).getValue() );

			assertComboValue( editor, 'Styles', 'Subtitle' );
		},

		'test different styles in multiple cells': function( editor, bot ) {
			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'different-styles' ).getValue() );

			assertComboValue( editor, 'Styles', '' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	tableSelectionHelpers.ignoreUnsupportedEnvironment( tests );

	bender.test( tests );
} )();
