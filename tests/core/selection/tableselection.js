/* bender-tags: editor */
/* bender-ckeditor-plugins: table, wysiwygarea, toolbar */

( function() {
	'use strict';

	bender.editor = {
		name: 'editor',
		creator: 'inline',
		config: {
			removePlugins: 'tableselection'
		}
	};

	var selectionContainer = CKEDITOR.document.findOne( '#selection-container' );

	bender.test( {
		'test ranges are restored when editor is focused': function() {
			// Only Firefox has native table selection.
			if ( !CKEDITOR.env.gecko ) {
				assert.ignore();
			}

			var bot = this.editorBot,
				editor = bot.editor,
				ranges = getRangesContainingEachCell( editor ),
				selection = editor.getSelection();

			selection.selectRanges( ranges );

			assert.areSame( ranges.length, selection.getRanges().length, 'ranges selected' );

			selectionContainer.focus();

			editor.focus();

			var newRanges = selection.getRanges();

			assert.areSame( ranges.length, newRanges.length, 'ranges count' );

			CKEDITOR.tools.array.forEach( ranges, function( range, index ) {
				var newRange = newRanges[ index ];

				assertRange( range, newRange );
			} );
		}
	} );

	function getRangesContainingEachCell( editor ) {
		var cells = editor.editable().find( 'td' ).toArray();

		return CKEDITOR.tools.array.map( cells, getRangeContainingElement( editor ) );
	}

	function getRangeContainingElement( editor ) {
		return function( element ) {
			var range = editor.createRange();

			range.setStartBefore( element );
			range.setEndBefore( element );

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
