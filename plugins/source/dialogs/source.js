/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.dialog.add( 'source', function( editor ) {
	var size = CKEDITOR.document.getWindow().getViewPaneSize();

	// Make it maximum 800px wide, but still fully visible in the viewport.
	var width = Math.min( size.width - 70, 800);

	// Make it use 2/3 of the viewport height.
	var height = size.height / 1.5;

	// Store old editor data to avoid unnecessary setData.
	var oldData;

	return {
		title: editor.lang.source.title,
		minWidth: 100,
		minHeight: 100,

		onShow: function() {
			this.setValueOf( 'main', 'data', oldData = editor.getData() );
		},

		onOk: function() {
			var that = this,
				newData = this.getValueOf( 'main', 'data' );

			// Avoid unnecessary setData. Also preserve selection
			// when user changed his mind and goes back to wysiwyg editing.
			if ( newData === oldData )
				return true;

			editor.setData( this.getValueOf( 'main', 'data' ), function() {
				// Avoid selection error in webkit & gecko.
				if ( CKEDITOR.env.webkit || CKEDITOR.env.gecko ) {
					var range = editor.createRange();
					range.moveToElementEditStart( editor.editable() );
					range.select();
				}

				// Fix wrong caret position in IEs.
				CKEDITOR.env.ie && editor.editable().focus();

				// Close the dialog once getData is done and selection is fixed.
				that.hide();
			} );

			// Don't let the dialog close before setData is over.
			return false;
		},

		contents: [{
			id: 'main',
			label: editor.lang.source.title,
			elements: [{
				type: 'textarea',
				type: 'textarea',
				id: 'data',
				inputStyle: 'cursor:auto;' +
					'width:' + width + 'px;' +
					'height:' + height + 'px',
				'class': 'cke_source'
			}]
		}]
	};
});
