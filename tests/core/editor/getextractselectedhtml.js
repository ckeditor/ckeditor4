/* bender-tags: editor,unit */

'use strict';

bender.editors = {
	editor: {
		name: 'editor',
		creator: 'inline',
		config: {
			allowedContent: true
		}
	},

	editor2: {
		name: 'editor2',
		config: {
			extraPlugins: 'sourcearea'
		}
	}
};

var stubs = [];

bender.test( {
	'tearDown': function() {
		var stub;

		while ( stub = stubs.pop() ) {
			stub.restore();
		}
	},

	'test getSelectedHtml in source mode (#13118)': function() {
		var editor = this.editors.editor2;

		editor.setMode( 'source', function() {
			resume( function() {
				assert.isNull( editor.getSelectedHtml() );

				// Clean up after the test.
				editor.setMode( 'wysiwyg', resume );
				wait();
			} );
		} );

		wait();
	},

	'test getSelectedHtml': function() {
		var editor = this.editors.editor;
		bender.tools.selection.setWithHtml( editor, '<p>fo{ob}ar</p>' );

		var frag = editor.getSelectedHtml();

		assert.isInstanceOf( CKEDITOR.dom.documentFragment, frag );
		assert.areSame( 'ob', frag.getHtml() );
	},

	'test getSelectedHtml with toString option': function() {
		var editor = this.editors.editor;
		bender.tools.selection.setWithHtml( editor, '<p>fo{ob}ar</p>' );

		assert.areSame( 'ob', editor.getSelectedHtml( true ) );
	},

	'test getSelectedHtml with no ranges': function() {
		// Only on Firefox it may happens that selection has no ranges.
		if ( !CKEDITOR.env.gecko ) {
			assert.ignore();
		}

		sinon.stub( CKEDITOR.dom.selection.prototype, 'getRanges' ).returns( [] );
		stubs.push( CKEDITOR.dom.selection.prototype.getRanges );

		var editor = this.editors.editor,
			selectedHtml = editor.getSelectedHtml();

		assert.isNull( selectedHtml, 'There should be no error but null should be returns if selection contains no ranges' );
	},

	// #13568.
	'test getSelectedHtml with possible bogus br': function() {
		var editor = this.editors.editor,
			filler = CKEDITOR.env.needsBrFiller ? '<br />' : '';
		bender.tools.selection.setWithHtml( editor, '[<p>Foo bar' + filler + '</p>]' );

		assert.isInnerHtmlMatching( [ '<p>Foo bar@</p>', 'Foo bar' ], editor.getSelectedHtml( true ) );
	},

	'test extractSelectedHtml': function() {
		var editor = this.editors.editor;
		bender.tools.selection.setWithHtml( editor, '<p>fo{ob}ar</p>' );

		// We need to precisely check if selection was set, because
		// after the selected part of the DOM is extracted browser would
		// make a similar selection in similar place. This way we're distinguishing who made it.
		sinon.spy( CKEDITOR.dom.selection.prototype, 'selectRanges' );

		var frag = editor.extractSelectedHtml(),
			selectionWasSetOnce = CKEDITOR.dom.selection.prototype.selectRanges.calledOnce;

		CKEDITOR.dom.selection.prototype.selectRanges.restore();

		assert.areSame( 'ob', frag.getHtml(), 'extracted HTML' );
		assert.isTrue( selectionWasSetOnce, 'new selection has been set' );
		assert.isInnerHtmlMatching( '<p>fo^ar@</p>', bender.tools.selection.getWithHtml( editor ),
			{ compareSelection: true, normalizeSelection: true }, 'contents of the editor' );
	},

	'test extractSelectedHtml with toString option': function() {
		var editor = this.editors.editor;
		bender.tools.selection.setWithHtml( editor, '<p>fo{ob}ar</p>' );

		assert.areSame( 'ob', editor.extractSelectedHtml( true ) );
		assert.isInnerHtmlMatching( '<p>fo^ar@</p>', bender.tools.selection.getWithHtml( editor ),
			{ compareSelection: true, normalizeSelection: true }, 'contents of the editor' );
	},

	'test extractSelectedHtml with no ranges': function() {
		sinon.stub( CKEDITOR.dom.selection.prototype, 'getRanges' ).returns( [] );
		stubs.push( CKEDITOR.dom.selection.prototype.getRanges );

		var editor = this.editors.editor,
			selectedHtml = editor.getSelectedHtml();

		assert.isNull( selectedHtml, 'There should be no error but null should be returns if selection contains no ranges' );
	},

	// #13884.
	'test getSelectedHtml with multiple ranges': function() {
		if ( !CKEDITOR.env.gecko ) {
			assert.ignore();
		}

		var editor = this.editors.editor,
			input = '<p>' +
					'<table>' +
						'<tr>' +
							'<td>11</td>' +
							'<td>22</td>' +
						'</tr>' +
						'<tr>' +
							'<td>44</td>' +
							'<td>55</td>' +
						'</tr>' +
					'</table>' +
				'</p>',
				sel = editor.getSelection(),
				ranges = [],
				tableCells,
				curRange,
				i;

		bender.tools.selection.setWithHtml( editor, input );

		// Find cells in the first row.
		tableCells = editor.editable().find( 'tr:first-child td' );

		for ( i = 0; i < tableCells.count(); i++ ) {
			curRange = editor.createRange();
			curRange.setStartBefore( tableCells.getItem( i ) );
			curRange.setEndAfter( tableCells.getItem( i ) );
			ranges.push( curRange );
		}

		sel.selectRanges( ranges );

		assert.isInnerHtmlMatching( '<table><tbody><tr><td>11@</td><td>22</td></tr></tbody></table>', editor.getSelectedHtml( true ) );
	},

	// #13884.
	'test getSelectedHtml with partial table selection': function() {
		if ( !CKEDITOR.env.gecko ) {
			assert.ignore();
		}

		var editor = this.editors.editor,
			input = '<p>' +
					'<table>' +
						'<tr>' +
							'<td>11</td>' +
							'<td>22</td>' +
						'</tr>' +
						'<tr>' +
							'<td>44</td>' +
							'<td>55</td>' +
						'</tr>' +
					'</table>' +
				'</p>',
				sel = editor.getSelection(),
				ranges = [],
				tableCells,
				curRange,
				i;

		bender.tools.selection.setWithHtml( editor, input );

		// Find first cells in rows.
		tableCells = editor.editable().find( 'tr td:first-child' );

		for ( i = 0; i < tableCells.count(); i++ ) {
			curRange = editor.createRange();
			curRange.setStartBefore( tableCells.getItem( i ) );
			curRange.setEndAfter( tableCells.getItem( i ) );
			ranges.push( curRange );
		}

		sel.selectRanges( ranges );

		assert.isInnerHtmlMatching( '<table><tbody><tr><td>11@</td></tr><tr><td>44</td></tr></tbody></table>', editor.getSelectedHtml( true ) );
	},

	'test extractSelectedHtml with removeEmptyBlock': function() {
		var editor = this.editors.editor;
		bender.tools.selection.setWithHtml( editor, '<p>{foo}</p><p>bar</p>' );

		assert.areSame( 'foo', editor.extractSelectedHtml( true, true ) );

		// If removeEmptyBlock is set we do not care about the selection.
		assert.isInnerHtmlMatching( '<p>bar@</p>', editor.editable().getHtml(), 'contents of the editor' );
	},

	'test extractSelectedHtml should not fail when editor is blurred': function() {
		bender.editorBot.create( { name: 'nofocus' }, function( bot ) {
			var html = bot.editor.extractSelectedHtml( true );

			assert.isTrue( html == null || html === '', 'returned value should be null if selection does not exist or should be an empty string' );
		} );
	}
} );
