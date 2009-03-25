/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	CKEDITOR.dialog.add( 'pastetext', function( editor ) {
		var textareaId = 'cke_' + CKEDITOR.tools.getNextNumber();

		return {
			title: editor.lang.pasteText.title,

			minWidth: 350,
			minHeight: 240,

			onShow: function() {
				// Reset the textarea value.
				CKEDITOR.document.getById( textareaId ).setValue( '' );
			},

			onOk: function() {
				// Get the textarea value.
				var text = CKEDITOR.document.getById( textareaId ).getValue();

				// Restore the editing area selection.
				this.restoreSelection();
				this.clearSavedSelection();

				// Inserts the text.
				this.getParentEditor().insertText( text );
			},

			contents: [
				{
				label: editor.lang.common.generalTab,
				elements: [
					{
					type: 'html',
					id: 'pasteMsg',
					html: '<div style="white-space:normal;width:340px;">' + editor.lang.clipboard.pasteMsg + '</div>'
				},
					{
					type: 'html',
					id: 'content',
					style: 'width:340px;height:170px',
					html: '<textarea id="' + textareaId + '" style="' +
																'width:346px;' +
																'height:170px;' +
																'border:1px solid black;' +
																'background-color:white">' +
															'</textarea>'
				}
				]
			}
			]
		}
	});
})();
