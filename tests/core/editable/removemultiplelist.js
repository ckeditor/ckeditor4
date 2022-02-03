/* bender-ckeditor-plugins: list,toolbar,table,format */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	var DELETE_KEY = 8,
		BACKSPACE_KEY = 46,
		tests = {
			'test fully selected lists are removed with the delete key': performInputOutputTest( 'multiple_full_list', DELETE_KEY ),
			'test fully selected lists are removed with the backspace key': performInputOutputTest( 'multiple_full_list', BACKSPACE_KEY ),

			'test fully mixed lists are removed with the delete key': performInputOutputTest( 'mixed_full_lists', DELETE_KEY ),
			'test fully mixed lists are removed with the backspace key': performInputOutputTest( 'mixed_full_lists', BACKSPACE_KEY ),

			'test multiple list with table is removed with the delete key': performInputOutputTest( 'lists_with_table', DELETE_KEY ),
			'test multiple list with table is removed with the backspace key': performInputOutputTest( 'lists_with_table', BACKSPACE_KEY ),

			'test fully multiple nested lists are removed with the delete key': performInputOutputTest( 'nested_full_lists', DELETE_KEY ),
			'test fully multiple nested lists are removed with the backspace key': performInputOutputTest( 'nested_full_lists', BACKSPACE_KEY ),

			'test whole of nested list inside another one is removed with the delete key': performInputOutputTest( 'only_nested_part_list', DELETE_KEY ),
			'test whole of nested list inside another one is removed with the backspace key': performInputOutputTest( 'only_nested_part_list', BACKSPACE_KEY ),

			'test last item with previous nested list is removed with the delete key': performInputOutputTest( 'nested_list', DELETE_KEY, CKEDITOR.env.ie && CKEDITOR.env.version < 9 ),
			'test last item with previous nested list is removed with the backspace key': performInputOutputTest( 'nested_list', BACKSPACE_KEY, CKEDITOR.env.ie && CKEDITOR.env.version < 9 ),

			'test part of multiple nested lists are removed with the delete key': performInputOutputTest( 'nested_part_lists', DELETE_KEY, CKEDITOR.env.ie && CKEDITOR.env.version < 9 ),
			'test part of multiple nested lists are removed with the backspace key': performInputOutputTest( 'nested_part_lists', BACKSPACE_KEY, CKEDITOR.env.ie && CKEDITOR.env.version < 9 ),

			'test part of multiple list is removed with the delete key': performInputOutputTest( 'multiple_part_list', DELETE_KEY, CKEDITOR.env.ie || CKEDITOR.env.gecko ),
			'test part of multiple list is removed with the backspace key': performInputOutputTest( 'multiple_part_list', BACKSPACE_KEY, CKEDITOR.env.ie || CKEDITOR.env.gecko ),

			'test part mixed lists is removed with the delete key': performInputOutputTest( 'mixed_part_lists', DELETE_KEY, CKEDITOR.env.ie || CKEDITOR.env.gecko ),
			'test part mixed lists is removed with the backspace key': performInputOutputTest( 'mixed_part_lists', BACKSPACE_KEY, CKEDITOR.env.ie || CKEDITOR.env.gecko ),

			// (#5068)
			'test fully selected lists without part of first list item are removed with the delete key': performInputOutputTest( 'without_first_item', DELETE_KEY, CKEDITOR.env.ie || CKEDITOR.env.gecko ),
			'test fully selected lists without part of first list item are removed with the backspace key': performInputOutputTest( 'without_first_item', BACKSPACE_KEY, CKEDITOR.env.ie || CKEDITOR.env.gecko )
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );
	bender.test( tests );

	function performInputOutputTest( templateName, keyCode, ignore ) {
		return function( editor, bot ) {
			if ( ignore ) {
				assert.ignore();
			}

			bender.tools.testInputOut( templateName, function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: keyCode } ) );

				bender.assert.beautified.html(
					expected,
					bot.htmlWithSelection(),
					'Failed to remove list on template ' + templateName + ' with key code ' + keyCode
				);
			} );
		};
	}

} )();
