/* bender-tags: editor */
/* bender-ckeditor-plugins: table, wysiwygarea, toolbar */

( function() {
	'use strict';

	var config = { removePlugins: 'tableselection' };

	bender.editors = {
		classic: {
			config: config
		},
		inline: {
			creator: 'inline',
			config: config
		}
	};

	var selectionContainer = CKEDITOR.document.findOne( '#selection-container' );

	var tests = {
		// (#3136)
		'test ranges are restored when editor is focused': function( editor, bot ) {
			// Only Firefox has native table selection.
			if ( !CKEDITOR.env.gecko ) {
				assert.ignore();
			}

			var content = CKEDITOR.document.findOne( '#content' ).getHtml();

			bot.setData( content, function() {
				var ranges = getRangesContainingEachCell( editor ),
					selection = editor.getSelection();

				editor.focus();
				selection.selectRanges( ranges );

				assert.areSame( ranges.length, selection.getRanges().length, 'ranges selected' );

				selectionContainer.focus();

				editor.focus();

				// Make sure we are comparing real selection.
				var newRanges = editor.getSelection( true ).getRanges();

				assert.areSame( ranges.length, newRanges.length, 'ranges count' );

				CKEDITOR.tools.array.forEach( ranges, function( range, index ) {
					var newRange = newRanges[ index ];

					assertRange( range, newRange );
				} );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );

	function getRangesContainingEachCell( editor ) {
		var cells = editor.editable().find( 'td' ).toArray();

		return CKEDITOR.tools.array.map( cells, getRangeContainingElement( editor ) );
	}

	function getRangeContainingElement( editor ) {
		return function( element ) {
			var range = editor.createRange();

			range.setStartBefore( element );
			range.setEndAfter( element );

			return range;
		};
	}

	function assertRange( expected, actual ) {
		assert.areSame( expected.startOffset, actual.startOffset, 'startOffset shouldn\'t change' );
		assert.areSame( expected.endOffset, actual.endOffset, 'endOffset shouldn\'t change' );
		assert.isTrue( expected.startContainer.equals( actual.startContainer ), 'startContainer shouldn\'t change' );
		assert.isTrue( expected.endContainer.equals( actual.endContainer ), 'endContainer shouldn\'t change' );
	}
} )();
