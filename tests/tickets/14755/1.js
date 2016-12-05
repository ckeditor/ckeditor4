/* bender-tags: 14755 */
/* bender-ckeditor-plugins: toolbar,list,table */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	var htmlMatchingOpts = {
		compareSelection: true,
		normalizeSelection: true,
		fixStyles: true
	};

	bender.test( {
		'test regular case': function() {
			var editor = this.editor;

			this.editorBot.setHtmlWithSelection( '<ol><li>[aaaaaaaaaaaaaaaa</li><li>&nbsp;]</li></ol>' );

			this.editorBot.dialog( 'table', function( dialog ) {
				assert.isTrue( true );
				dialog.getButton( 'ok' ).click();

				assert.isInnerHtmlMatching(
					// jscs:disable maximumLineLength
					'<ol><li><table border="1" cellpadding="1" cellspacing="1" style="width:500px"><tbody><tr><td>@</td><td>@</td></tr><tr><td>@</td><td>@</td></tr><tr><td>@</td><td>@</td></tr></tbody></table><p>^@</p></li></ol>',
					// jscs:enable maximumLineLength
					bender.tools.html.prepareInnerHtmlForComparison( bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts ).toLowerCase()
				);
			} );
		},

		'test simplified case': function() {
			// Simply insert a strong.
			var editor = this.editor,
				element = CKEDITOR.dom.element.createFromHtml( '<strong>foo</strong>' );

			this.editorBot.setHtmlWithSelection( '<ol><li>[aaa</li><li class="bbb">&nbsp;]</li></ol>' );

			this.editor.editable().insertElement( element );

			assert.isMatching(
				/<ol><li><strong>foo<\/strong>\^(?:<br \/>)?<\/li><li class="bbb"><\/li><\/ol>/,
				bender.tools.html.prepareInnerHtmlForComparison( bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts )
			);
		},

		'test bug case': function() {
			this.editorBot.setHtmlWithSelection( '<ol><li>[aaaaaaaaaaaaaaaa</li><li class="bbbbbbbbbbbbb">&nbsp;]</li></ol>' );

			this.editorBot.dialog( 'table', function( dialog ) {
				// It simply shouldn't hang.
				assert.isTrue( true );
				dialog.getButton( 'ok' ).click();
			} );
		}
	} );
} )();
