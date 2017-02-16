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
				fillerText = '&nbsp;',
				expected = '';

			if ( CKEDITOR.env.safari ) {
				// Safari will put the selection inside of filler div.
				fillerText = '[' + fillerText;
			} else {
				// And others will put it at the beginning.
				expected += '[';
			}

			expected = expected + '<div data-cke-filler-webkit="start" data-cke-temp="1" style="border:0px; ' +
				'display:block; height:0px; left:-9999px; margin:0px; opacity:0; overflow:hidden; ' +
				'padding:0px; position:absolute; top:0px; width:0px">' + fillerText +
				'</div><p contenteditable="false">Non-editable</p>';

			if ( CKEDITOR.env.safari ) {
				// Safari will put the selection inside of filler div.
				expected += '<p>This is text]</p>';
			} else {
				// And others will put it at the beginning.
				expected += '<p>This is text</p>]';
			}

			this.editorBot.setHtmlWithSelection( '<p contenteditable="false">Non-editable</p><p>This ^is text</p>' );

			editor.execCommand( 'selectAll' );

			assert.isInnerHtmlMatching( expected, bender.tools.selection.getWithHtml( editor ),
				this.compareOptions );
		}
	} );
} )();
