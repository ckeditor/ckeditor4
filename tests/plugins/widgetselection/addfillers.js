/* bender-tags: 4.6.1, tc, 11064, widgetselection */
/* bender-ckeditor-plugins: widgetselection */
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
			this.widgetselection.addFillers( editor.editable() );

			assert.isInnerHtmlMatching( '<p>This ^is text</p>', bender.tools.selection.getWithHtml( editor ), this.compareOptions );
		},

		'test content with non-editable at the beginning': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p contenteditable="false">Non-editable</p><p>This {}is text</p>' );
			this.widgetselection.addFillers( editor.editable() );

			assert.isInnerHtmlMatching( this.fillerHtml() + '<p contenteditable="false">Non-editable</p>' + this.pHtml( true ),
				bender.tools.selection.getWithHtml( editor ), this.compareOptions );
		},

		'test content with non-editable at the end': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>This {}is text</p><p contenteditable="false">Non-editable</p>' );
			this.widgetselection.addFillers( editor.editable() );

			assert.isInnerHtmlMatching( this.pHtml() + '<p contenteditable="false">Non-editable</p>' + this.fillerHtml( true ),
				bender.tools.selection.getWithHtml( editor ), this.compareOptions );
		},

		'test content with non-editable at the beginning and end': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p contenteditable="false">Non-editable</p><p>This {}is text</p><p contenteditable="false">Non-editable</p>' );
			this.widgetselection.addFillers( editor.editable() );

			assert.isInnerHtmlMatching(
				this.fillerHtml() + '<p contenteditable="false">Non-editable</p><p>This is text</p><p contenteditable="false">Non-editable</p>' + this.fillerHtml( true ),
				bender.tools.selection.getWithHtml( editor ), this.compareOptions );
		}
	} );
} )();
