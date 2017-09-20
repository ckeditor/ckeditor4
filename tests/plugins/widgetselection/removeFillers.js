/* bender-tags: 4.6.1, trac11064, widgetselection */
/* bender-ckeditor-plugins: widgetselection */

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
		},

		setUp: function() {
			if ( !CKEDITOR.env.webkit ) {
				assert.ignore();
			}

			this.widgetselection.startFiller = null;
			this.widgetselection.endFiller = null;
		},

		'test content with helper at the end': function() {
			var editor = this.editor,
				editable = editor.editable();

			bender.tools.selection.setWithHtml( editor,
				'<p>This is text</p><p contenteditable="false">Non-editable</p><div data-cke-filler-webkit="end" data-cke-temp="1">^&nbsp;</div>' );

			this.widgetselection.endFiller = editable.findOne( 'div[data-cke-filler-webkit=end]' );
			this.widgetselection.removeFillers( editor.editable() );

			assert.isInnerHtmlMatching( '^<p>This is text</p><p contenteditable="false">Non-editable</p>',
				bender.tools.selection.getWithHtml( editor ), this.compareOptions );
		},

		'test content with helper at the beginning': function() {
			var editor = this.editor,
				editable = editor.editable();

			bender.tools.selection.setWithHtml( editor,
				'<div data-cke-filler-webkit="start" data-cke-temp="1">&nbsp;</div><p contenteditable="false">Non-editable</p><p>This {is text}</p>' );

			this.widgetselection.startFiller = editable.findOne( 'div[data-cke-filler-webkit=start]' );
			this.widgetselection.removeFillers( editor.editable() );

			assert.isInnerHtmlMatching( '<p contenteditable="false">Non-editable</p><p>This [is text]</p>',
				bender.tools.selection.getWithHtml( editor ), this.compareOptions );
		},

		'test content with helpers on the beginning and end': function() {
			var editor = this.editor,
				editable = editor.editable();

			bender.tools.selection.setWithHtml( editor, '<div data-cke-filler-webkit="start" data-cke-temp="1">&nbsp;</div>' +
				'<p>[This is text]</p><p contenteditable="false">Non-editable</p><div data-cke-filler-webkit="end" data-cke-temp="1">&nbsp;</div>' );

			this.widgetselection.startFiller = editable.findOne( 'div[data-cke-filler-webkit=start]' );
			this.widgetselection.endFiller = editable.findOne( 'div[data-cke-filler-webkit=end]' );
			this.widgetselection.removeFillers( editor.editable() );

			assert.isInnerHtmlMatching( '<p>[This is text]</p><p contenteditable="false">Non-editable</p>',
				bender.tools.selection.getWithHtml( editor ), this.compareOptions );
		},

		'test content without helpers': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p contenteditable="false">Non-editable</p><p>This {}is text</p>' );
			this.widgetselection.removeFillers( editor.editable() );

			assert.isInnerHtmlMatching( '<p contenteditable="false">Non-editable</p><p>This ^is text</p>',
				bender.tools.selection.getWithHtml( editor ), this.compareOptions );
		},

		'test content without helpers entirely selected': function() {
			if ( CKEDITOR.env.safari ) {
				// Selection like [<p contenteditable="false">Non-editable</p><p>This is text</p>] is not achievable
				// in Safari programatically with use of ranges.
				assert.ignore();
			}

			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '[<p contenteditable="false">Non-editable</p><p>This is text</p>]' );
			this.widgetselection.removeFillers( editor.editable() );

			assert.isInnerHtmlMatching( '[<p contenteditable="false">Non-editable</p><p>This is text</p>]',
				bender.tools.selection.getWithHtml( editor ), this.compareOptions );
		},

		'test content with helpers entirely selected': function() {
			var editor = this.editor,
				editable = editor.editable();

			bender.tools.selection.setWithHtml( editor,
				'[<p>This is text</p><p contenteditable="false">Non-editable</p><div data-cke-filler-webkit="end" data-cke-temp="1">&nbsp;</div>]' );

			this.widgetselection.startFiller = editable.findOne( 'div[data-cke-filler-webkit=start]' );
			this.widgetselection.endFiller = editable.findOne( 'div[data-cke-filler-webkit=end]' );
			this.widgetselection.removeFillers( editor.editable() );

			var expected = '[<p>This is text</p><p contenteditable="false">Non-editable</p><div data-cke-filler-webkit="end" data-cke-temp="1">&nbsp;</div>]';
			if ( CKEDITOR.env.safari ) {
				expected = '<p>[This is text</p><p contenteditable="false">Non-editable</p><div data-cke-filler-webkit="end" data-cke-temp="1">&nbsp;]</div>';
			}

			assert.isInnerHtmlMatching( expected, bender.tools.selection.getWithHtml( editor ), this.compareOptions );
		}
	} );
} )();
