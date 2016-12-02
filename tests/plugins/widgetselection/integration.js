/* bender-tags: 4.6.1, tc, 11064, widgetselection */
/* bender-ckeditor-plugins: wysiwygarea, widgetselection */
/* bender-include: _helpers/tools.js */
/* global htmlWithSelectionHelper */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {

		init: function() {
			this.widgetselection = CKEDITOR.plugins.widgetselection;
			this.compareOptions = {
				fixStyles: true,
				compareSelection: true,
				normalizeSelection: true
			};

			this.pHtml = htmlWithSelectionHelper.pHtml;
			this.fillerHtml = htmlWithSelectionHelper.fillerHtml;
		},

		setUp: function() {
			if ( !CKEDITOR.env.webkit ) {
				assert.ignore();
			}

			this.widgetselection.startFiller = null;
			this.widgetselection.endFiller = null;
		},

		'test content without non-editables': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>This {}is text</p>' );
			this.fireSelectAll( editor );

			wait( function() {
				assert.isInnerHtmlMatching( '<p>This ^is text</p>', bender.tools.selection.getWithHtml( editor ), this.compareOptions );
			}, 5 );
		},

		'test content with non-editable at the beginning': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p contenteditable="false">NE</p><p>This {}is text</p>' );
			this.fireSelectAll( editor );

			wait( function() {
				assert.isInnerHtmlMatching( this.fillerHtml() + '<p contenteditable="false">NE</p>' + this.pHtml( true ),
					bender.tools.selection.getWithHtml( editor ), this.compareOptions, 'Filler was added.' );

				this.fireSelectionCheck( editor, 2 );

				wait( function() {
					assert.isInnerHtmlMatching( '<p contenteditable="false">NE</p><p>^This is text</p>',
						bender.tools.selection.getWithHtml( editor ), this.compareOptions, 'Filler was removed.' );
				}, 5 );
			}, 5 );
		},

		'test content with non-editable at the end': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>This {}is text</p><p contenteditable="false">NE</p>' );
			this.fireSelectAll( editor );

			wait( function() {
				assert.isInnerHtmlMatching( this.pHtml() + '<p contenteditable="false">NE</p>' + this.fillerHtml( true ),
					bender.tools.selection.getWithHtml( editor ), this.compareOptions, 'Filler was added.' );

				this.fireSelectionCheck( editor, 0 );

				wait( function() {
					assert.isInnerHtmlMatching( '<p>^This is text</p><p contenteditable="false">NE</p>',
						bender.tools.selection.getWithHtml( editor ), this.compareOptions, 'Filler was removed.' );
				}, 5 );
			}, 5 );
		},

		'test content with non-editable at the beginning and end': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p contenteditable="false">NE1</p><p>This {}is text</p><p contenteditable="false">NE2</p>' );
			this.fireSelectAll( editor );

			wait( function() {
				assert.isInnerHtmlMatching(
					this.fillerHtml() + '<p contenteditable="false">NE1</p><p>This is text</p><p contenteditable="false">NE2</p>' + this.fillerHtml( true ),
					bender.tools.selection.getWithHtml( editor ), this.compareOptions, 'Filler was added.' );

				this.fireSelectionCheck( editor, 2 );

				wait( function() {
					assert.isInnerHtmlMatching( '<p contenteditable="false">NE1</p><p>^This is text</p><p contenteditable="false">NE2</p>',
						bender.tools.selection.getWithHtml( editor ), this.compareOptions, 'Filler was removed.' );
				}, 5 );
			}, 5 );
		},

		'test content with only one non-editable': function() {
			if ( CKEDITOR.env.safari ) {
				// Selection like [<p contenteditable="false">Non-editable</p><p>This is text</p>] is not achievable
				// in Safari programatically with use of ranges.
				assert.ignore();
			}

			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p contenteditable="false">NE</p>' );
			this.fireSelectAll( editor );

			wait( function() {
				assert.isInnerHtmlMatching( this.fillerHtml() + '<p contenteditable="false">NE</p>' + this.fillerHtml( true ),
					bender.tools.selection.getWithHtml( editor ), this.compareOptions, 'Filler was added.' );

				this.fireSelectionCheck( editor, 1 );

				wait( function() {
					assert.isInnerHtmlMatching( '<p contenteditable="false">^NE</p>',
						bender.tools.selection.getWithHtml( editor ), this.compareOptions, 'Filler was removed.' );
				}, 5 );
			}, 5 );
		},

		'test content with two non-editables': function() {
			if ( CKEDITOR.env.safari ) {
				// Selection like [<p contenteditable="false">Non-editable</p><p>This is text</p>] is not achievable
				// in Safari programatically with use of ranges.
				assert.ignore();
			}

			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p contenteditable="false">NE1</p><p contenteditable="false">NE2</p>' );
			this.fireSelectAll( editor );

			wait( function() {
				assert.isInnerHtmlMatching(
					this.fillerHtml() + '<p contenteditable="false">NE1</p><p contenteditable="false">NE2</p>' + this.fillerHtml( true ),
					bender.tools.selection.getWithHtml( editor ), this.compareOptions, 'Filler was added.' );

				this.fireSelectionCheck( editor, 2 );

				wait( function() {
					assert.isInnerHtmlMatching( '<p contenteditable="false">NE1</p><p contenteditable="false">^NE2</p>',
						bender.tools.selection.getWithHtml( editor ), this.compareOptions, 'Filler was removed.' );
				}, 5 );
			}, 5 );
		},

		'tests updating filler references on undo flow': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p contenteditable="false">NE</p><p>Text1</p>' );
			this.fireSelectAll( editor );

			wait( function() {
				assert.isInnerHtmlMatching( this.fillerHtml() + '<p contenteditable="false">NE</p>' + this.pHtml( true, 'Text1' ),
					bender.tools.selection.getWithHtml( editor ), this.compareOptions, 'Filler was added.' );

				var filler = editor.editable().findOne( 'div[data-cke-filler-webkit=start]' );
				assert.isNotNull( filler, 'Filler available via find.' );

				var newFiller = this.widgetselection.createFiller();
				newFiller.replace( filler );

				this.fireSelectionCheck( editor );

				wait( function() {
					assert.isTrue( newFiller.equals( this.widgetselection.startFiller ), 'Filler reference was updated.' );
				}, 5 );
			}, 5 );
		},

		fireSelectAll: function( editor ) {
			editor.document.fire( 'keydown', new CKEDITOR.dom.event( {
				keyCode: 65,
				metaKey: true,
				ctrlKey: true
			} ) );
		},

		fireSelectionCheck: function( editor, moveSelectionToElement ) {
			if ( moveSelectionToElement != null ) {
				var range = editor.createRange();
				range.setStartAt( editor.editable().getChild( moveSelectionToElement ), CKEDITOR.POSITION_AFTER_START );
				editor.getSelection().selectRanges( [ range ] );
			}
			editor.fire( 'selectionCheck', new CKEDITOR.dom.event( { editor: editor } ) );
		}
	} );
} )();
