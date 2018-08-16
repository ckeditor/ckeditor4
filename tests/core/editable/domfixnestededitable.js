/* bender-tags: editor,autoparagraphing */

( function() {
	'use strict';

	bender.editors = {
		editor1: {
			name: 'editor1'
		}
	};

	bender.test( {
		// (https://dev.ckeditor.com/ticket/12162)
		'test autoparagraphing in nested editable': function() {
			var editor = this.editors.editor1,
				editable = editor.editable(),
				expected =
					'<p>foo@</p>' +
					'<div contenteditable="false">' +
						'<div contenteditable="true">' +
							'<p>^hello@</p>' +
						'</div>' +
					'</div>',
				htmlMatchingOpts = {
					compareSelection: true,
					normalizeSelection: true
				};

			bender.tools.selection.setWithHtml( editor,
				'<p>f[o]o</p>' +
				'<div contenteditable="false">' +
					'<div contenteditable="true">' +
						'hello' +
					'</div>' +
				'</div>' );

			var nestedEditable = editable.findOne( 'div[contenteditable="true"]' ),
				sel = editor.getSelection(),
				range = editor.createRange();

			nestedEditable.focus();
			range.setStart( nestedEditable.getFirst(), 0 );
			range.setEnd( nestedEditable.getFirst(), 0 );
			sel.selectRanges( [ range ] );

			assert.isInnerHtmlMatching( expected, bender.tools.selection.getWithHtml( editor ),
				htmlMatchingOpts, 'Paragraph should be added.' );
		}
	} );
} )();
