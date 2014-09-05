/* bender-tags: editor,unit,autoparagraphing */
/* bender-ckeditor-plugins: enterkey */

( function () {
	'use strict';

	var doc = CKEDITOR.document;

	// This group of tests plays upon the framed content.
	bender.test( {
		// Initialize the editor instance.
		'async:init' : function() {
			var that = this;

			bender.tools.setUpEditors( {
				"editor1": {
					name: "editor1"
				},
				"editor2": {
					name: "editor2",
					config: {
						autoParagraph: false
					}
				}
			}, function( editors, bots ) {
				that.editors = editors;

				// Allow editor creation to complete.
				setTimeout( function() { that.callback(); }, 0 );
			} );
		},

		setupEditor : function( data, callback ) {
			var tc = this, editor = tc.editors.editor1;
			editor.setData( data, function() {
				CKEDITOR.document.getBody().focus();
				editor.focus();
				setTimeout( function() { tc.resume( callback ); }, 200 );
			} );
			tc.wait();
		},

		// (#12162)
		testDomFixNestedEditable: function() {
			var tc = this,
				editor = this.editors.editor1,
				editable = editor.editable(),
				expected = [
					'<p>foo</p>',
					'<div contenteditable="false">',
						'<div contenteditable="true">',
							'<p>[]hello<br></p>',
						'</div>',
					'</div>'
				].join( '' );

			bender.tools.selection.setWithHtml( editor, [
				'<p>foo</p>',
				'<div contenteditable="false">',
					'<div contenteditable="true">',
						'h[e]llo',
					'</div>',
				'</div>'
			].join( '' ) );

			var widget = editable.findOne( 'div[contenteditable="true"]' ),
			sel = editor.getSelection(),
			range = sel.getRanges()[ 0 ],
			firstElement = sel.getStartElement(),
			currentPath = new CKEDITOR.dom.elementPath( firstElement, editor.editable() );

			range.setStart( widget, 0 );
			range.setEnd( widget, 0 );
			sel.selectRanges( [ range ] );

			editor.fire( 'selectionChange', {
				selection : sel,
				path : currentPath,
				element : firstElement
			} );

			assert.areEqual( expected, bender.tools.selection.getWithHtml( editor ), 'Paragraph should be added.' );
		}
	} );
} )();