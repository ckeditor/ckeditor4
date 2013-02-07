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

	return {
		title: editor.lang.source.title,
		minWidth: 100,
		minHeight: 100,

		onShow: function() {
			this.setValueOf( 'main', 'data', editor.getData() );
		},

		onOk: function() {
			editor.setData( this.getValueOf( 'main', 'data' ) );
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
