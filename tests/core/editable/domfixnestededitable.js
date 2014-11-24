/* bender-tags: editor,unit,autoparagraphing */

( function() {
	'use strict';

	bender.test( {
		// Initialize the editor instance.
		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( {
				editor1: {
					name: 'editor1'
				}
			}, function( editors ) {
				that.editors = editors;
				that.callback();
			} );
		},

		// (#12162)
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
			range.setStart( nestedEditable, 0 );
			range.setEnd( nestedEditable, 0 );
			sel.selectRanges( [ range ] );

			assert.isInnerHtmlMatching( expected, bender.tools.selection.getWithHtml( editor ),
				htmlMatchingOpts, 'Paragraph should be added.' );
		}
	} );
} )();