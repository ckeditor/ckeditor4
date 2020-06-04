/* bender-tags: tableselection, link */
/* bender-ckeditor-plugins: link,tableselection */
/* bender-include: ../../_helpers/tableselection.js */
/* global tableSelectionHelpers */

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

	var getRangesForCells = tableSelectionHelpers.getRangesForCells,
		table = CKEDITOR.document.getById( 'table' ).findOne( 'table' ),
		editedLinkedTable = CKEDITOR.document.getById( 'table-with-link-edited' ).findOne( 'table' ),
		multiLinkedTable = CKEDITOR.document.getById( 'table-with-links' ).findOne( 'table' ),
		editedMultiLinkedTable = CKEDITOR.document.getById( 'table-with-links-edited' ).findOne( 'table' ),
		anchoredTable = CKEDITOR.document.getById( 'table-with-anchor' ).findOne( 'table' ),
		multiAnchoredTable = CKEDITOR.document.getById( 'table-with-anchors' ).findOne( 'table' ),
		editedAnchoredTable = CKEDITOR.document.getById( 'table-with-anchors-edited' ).findOne( 'table' ),
		removedAnchoredTable = CKEDITOR.document.getById( 'table-with-anchors-removed' ).findOne( 'table' );

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},
		'test create link': function() {
			var editor = this.editor,
				bot = this.editorBot,
				ranges;

			bot.setData( table.getOuterHtml(), function() {
				ranges = getRangesForCells( editor, [ 1 ] );

				editor.getSelection().selectRanges( ranges );

				bot.dialog( 'link', function( dialog ) {
					var displayTextField = dialog.getContentElement( 'info', 'linkDisplayText' )
						.getElement().getParent().getParent();

					assert.isTrue( displayTextField.isVisible(), '"Display Text" field visibility' );

					dialog.setValueOf( 'info', 'url', 'cksource.com' );
					dialog.getButton( 'ok' ).click();

					assert.beautified.html( editedLinkedTable.getOuterHtml(), bot.getData() );
				} );
			} );
		},

		'test create link on multiple cells': function() {
			var editor = this.editor,
				bot = this.editorBot,
				ranges;

			bot.setData( table.getOuterHtml(), function() {
				ranges = getRangesForCells( editor, [ 1, 2 ] );

				editor.getSelection().selectRanges( ranges );

				bot.dialog( 'link', function( dialog ) {
					var displayTextField = dialog.getContentElement( 'info', 'linkDisplayText' )
						.getElement().getParent().getParent();

					assert.isFalse( displayTextField.isVisible(), '"Display Text" field is hidden' );

					dialog.setValueOf( 'info', 'url', 'ckeditor.com' );
					dialog.getButton( 'ok' ).click();

					assert.areEqual( fixHtml( multiLinkedTable.getOuterHtml() ), bot.getData( true ) );
				} );
			} );
		},

		'test edit link (text selected)': function() {
			var editor = this.editor,
				bot = this.editorBot,
				ranges;

			bot.setData( multiLinkedTable.getOuterHtml(), function() {
				ranges = getRangesForCells( editor, [ 1, 2 ] );

				editor.getSelection().selectRanges( ranges );

				bot.dialog( 'link', function( dialog ) {
					var displayTextField = dialog.getContentElement( 'info', 'linkDisplayText' )
						.getElement().getParent().getParent();

					assert.isFalse( displayTextField.isVisible(), '"Display Text" field is hidden' );

					dialog.setValueOf( 'info', 'url', 'http://cksource.com' );
					dialog.getButton( 'ok' ).click();

					assert.areSame( fixHtml( editedMultiLinkedTable.getOuterHtml() ), bot.getData( true ) );
				} );
			} );
		},

		// #tp2245
		'test get link info from the cell with <br> filler': function() {
			var editor = this.editor,
				bot = this.editorBot,
				protocol = 'https://',
				url = 'cksource.com',
				ranges;

			bot.setData( CKEDITOR.document.getById( 'table-with-br' ).getOuterHtml(), function() {
				ranges = getRangesForCells( editor, [ 0 ] );
				editor.getSelection().selectRanges( ranges );

				bot.dialog( 'link', function( dialog ) {
					assert.areSame( url, dialog.getValueOf( 'info', 'url' ), 'Correct URL is set.' );
					assert.areSame( protocol, dialog.getValueOf( 'info', 'protocol' ), 'Correct protocol is set.' );

					dialog.getButton( 'ok' ).click();
				} );
			} );
		},

		'test unlink command': function() {
			var editor = this.editor,
				unlink = editor.getCommand( 'unlink' ),
				bot = this.editorBot,
				ranges;

			bot.setData( multiLinkedTable.getOuterHtml(), function() {
				ranges = getRangesForCells( editor, [ 1, 2 ] );

				editor.getSelection().selectRanges( ranges );
				assert.isTrue( unlink.state == CKEDITOR.TRISTATE_OFF, 'unlink is enabled' );

				editor.execCommand( 'unlink' );
				assert.areSame( fixHtml( table.getOuterHtml() ), bot.getData( true ), 'links are removed' );
			} );
		},

		'test getSelectedLink for table selection (links)': function() {
			var editor = this.editor,
				bot = this.editorBot,
				ranges,
				links,
				selectedLinks,
				i;

			bot.setData( multiLinkedTable.getOuterHtml(), function() {
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
		},

		'test create anchor': function() {
			var editor = this.editor,
				bot = this.editorBot,
				ranges;

			bot.setData( table.getOuterHtml(), function() {
				ranges = getRangesForCells( editor, [ 1, 2 ] );

				editor.getSelection().selectRanges( ranges );

				bot.dialog( 'anchor', function( dialog ) {
					dialog.setValueOf( 'info', 'txtName', 'foo' );
					dialog.getButton( 'ok' ).click();

					assert.areEqual( fixHtml( anchoredTable.getOuterHtml() ), bot.getData( true ) );
				} );
			} );
		},

		'test edit anchor (text selected)': function() {
			var editor = this.editor,
				bot = this.editorBot,
				ranges;

			bot.setData( multiAnchoredTable.getOuterHtml(), function() {
				ranges = getRangesForCells( editor, [ 1, 2 ] );

				editor.getSelection().selectRanges( ranges );

				bot.dialog( 'anchor', function( dialog ) {
					dialog.setValueOf( 'info', 'txtName', 'baz' );
					dialog.getButton( 'ok' ).click();

					assert.areSame( fixHtml( editedAnchoredTable.getOuterHtml() ), bot.getData( true ) );
				} );
			} );
		},

		'test removeAnchor command': function() {
			var editor = this.editor,
				unlink = editor.getCommand( 'removeAnchor' ),
				bot = this.editorBot,
				ranges;

			bot.setData( multiAnchoredTable.getOuterHtml(), function() {
				ranges = getRangesForCells( editor, [ 1, 2 ] );

				editor.getSelection().selectRanges( ranges );
				assert.isTrue( unlink.state == CKEDITOR.TRISTATE_OFF, 'removeAnchor is enabled' );

				editor.execCommand( 'removeAnchor' );
				assert.areSame( fixHtml( removedAnchoredTable.getOuterHtml() ), bot.getData( true ),
					'anchors are removed' );
			} );
		},

		'test getSelectedLink for table selection (anchors)': function() {
			var editor = this.editor,
				bot = this.editorBot,
				ranges,
				links,
				selectedLinks,
				i;

			bot.setData( anchoredTable.getOuterHtml(), function() {
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
	};

	bender.test( tests );
} )();
