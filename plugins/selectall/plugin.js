/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "showblocks" plugin. Enable it will make all block level
 *               elements being decorated with a border and the element name
 *               displayed on the left-right corner.
 */

(function() {
	CKEDITOR.plugins.add( 'selectall', {
		init: function( editor ) {
			editor.addCommand( 'selectAll', { modes:{wysiwyg:1,source:1 },
				exec: function( editor ) {
					var editable = editor.editable();

					if ( editable ) {
						if ( editable.is( 'body' ) )
							editor.document.$.execCommand( 'SelectAll', false, null );
						else {
							var range = editor.createRange();
							range.selectNodeContents( editable );
							range.select();
						}

						// Force triggering selectionChange (#7008)
						editor.forceNextSelectionCheck();
						editor.selectionChange();
					} else if ( editor.textarea ) {
						var textarea = editor.textarea.$;
						if ( CKEDITOR.env.ie )
							textarea.createTextRange().execCommand( 'SelectAll' );
						else {
							textarea.selectionStart = 0;
							textarea.selectionEnd = textarea.value.length;
						}
						textarea.focus();
					}
				},
				canUndo: false
			});

			editor.ui.addButton && editor.ui.addButton( 'SelectAll', {
				label: editor.lang.selectAll,
				command: 'selectAll'
			});
		}
	});
})();
