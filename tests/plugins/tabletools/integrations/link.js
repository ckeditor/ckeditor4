/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: link,toolbar,table,tabletools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			autoParagraph: false
		}
	};

	function fixHtml( html ) {
		html = html.replace( /\t/g, '' );

		return bender.tools.fixHtml( html );
	}

	function getRangesForCells( editor, cellsIndexes ) {
		var ranges = [],
			cells = editor.editable().find( 'td, th' ),
			range,
			cell,
			i;

		for ( i = 0; i < cellsIndexes.length; i++ ) {
			range = editor.createRange();
			cell = cells.getItem( cellsIndexes[ i ] );

			range.setStartBefore( cell );
			range.setEndAfter( cell );

			ranges.push( range );
		}

		return ranges;
	}

	var table = CKEDITOR.document.getById( 'table' ).findOne( 'table' ),
		linkedTable = CKEDITOR.document.getById( 'table-with-links' ).findOne( 'table' ),
		editedLinkedTable = CKEDITOR.document.getById( 'table-with-links-edited' ).findOne( 'table' );

	bender.test( {
		'test create link': function() {
			var editor = this.editor,
				bot = this.editorBot,
				ranges;

			bot.setData( table.getOuterHtml(), function() {
				ranges = getRangesForCells( editor, [ 1, 2 ] );

				editor.getSelection().selectRanges( ranges );

				bot.dialog( 'link', function( dialog ) {
					dialog.setValueOf( 'info', 'url', 'ckeditor.com' );
					dialog.getButton( 'ok' ).click();

					assert.areEqual( fixHtml( linkedTable.getOuterHtml() ), bot.getData( true ) );
				} );
			} );
		},

		'test edit link (text selected)': function() {
			var editor = this.editor,
				bot = this.editorBot,
				ranges;

			bot.setData( linkedTable.getOuterHtml(), function() {
				ranges = getRangesForCells( editor, [ 1, 2 ] );

				editor.getSelection().selectRanges( ranges );

				bot.dialog( 'link', function( dialog ) {
					dialog.setValueOf( 'info', 'url', 'http://cksource.com' );
					dialog.getButton( 'ok' ).click();

					assert.areSame( fixHtml( editedLinkedTable.getOuterHtml() ), bot.getData( true ) );
				} );
			} );
		},

		'test unlink command': function() {
			var editor = this.editor,
				unlink = editor.getCommand( 'unlink' ),
				bot = this.editorBot,
				ranges;

			bot.setData( linkedTable.getOuterHtml(), function() {
				ranges = getRangesForCells( editor, [ 1, 2 ] );

				editor.getSelection().selectRanges( ranges );
				assert.isTrue( unlink.state == CKEDITOR.TRISTATE_OFF, 'unlink is enabled' );

				editor.execCommand( 'unlink' );
				assert.areSame( fixHtml( table.getOuterHtml() ), bot.getData( true ), 'links are removed' );
			} );
		},

		'test getSelectedLink for table selection': function() {
			var editor = this.editor,
				bot = this.editorBot,
				ranges,
				links,
				selectedLinks,
				i;

			bot.setData( linkedTable.getOuterHtml(), function() {
				links = editor.editable().find( 'a' );
				ranges = getRangesForCells( editor, [ 1, 2 ] );

				editor.getSelection().selectRanges( ranges );
				selectedLinks = CKEDITOR.plugins.link.getSelectedLink( editor, true );

				assert.areSame( links.count(), selectedLinks.length, 'All links found' );

				for ( i = 0; i < links.count(); i++ ) {
					assert.isTrue( links.getItem( i ).equals( selectedLinks[ i ] ),
						'The correct links is selected' );
				}
			} );
		}
	} );
} )();
