/* bender-ckeditor-plugins: widgetselection,selectall */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		_should: {
			ignore: {
				'test selectall integration': !CKEDITOR.env.webkit
			}
		},

		init: function() {
			this.compareOptions = {
				fixStyles: true,
				compareSelection: true,
				normalizeSelection: true
			};
		},

		'test selectall integration': function() {
			var editor = this.editor,
				// Chrome/Safari will put the selection inside of a filler div.
				expected = '<div data-cke-filler-webkit="start" data-cke-temp="1" style="border:0px; ' +
					'display:block; height:0px; left:-9999px; margin:0px; opacity:0; overflow:hidden; ' +
					'padding:0px; position:absolute; top:0px; width:0px">[&nbsp;' +
					'</div><p contenteditable="false">Non-editable</p>' +
					'<p>This is text]</p>';

			this.editorBot.setHtmlWithSelection( '<p contenteditable="false">Non-editable</p><p>This ^is text</p>' );

			editor.execCommand( 'selectAll' );

			assert.isInnerHtmlMatching( expected, bender.tools.selection.getWithHtml( editor ), this.compareOptions );
		}
	} );
} )();
