/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'htmldataprocessor', {
	requires: [ 'htmlwriter' ],

	init: function( editor, pluginPath ) {
		editor.dataProcessor = new CKEDITOR.htmlDataProcessor();
	}
});

CKEDITOR.htmlDataProcessor = function() {
	this.writer = new CKEDITOR.htmlWriter();
};

CKEDITOR.htmlDataProcessor.prototype = {
	toHtml: function( data ) {
		// The source data is already HTML, so just return it as is.
		return data;
	},

	toDataFormat: function( element ) {
		var writer = this.writer,
			fragment = CKEDITOR.htmlParser.fragment.fromHtml( element.getHtml() );

		writer.reset();

		fragment.writeHtml( writer );

		return writer.getHtml( true );
	}
};
