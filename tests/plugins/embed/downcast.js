/* bender-tags: embed */
/* bender-ckeditor-plugins: embed,toolbar */

( function() {
	'use strict';

	bender.editor = true;

	var widgetHtml = CKEDITOR.document.findOne( '#widget-html' ).getValue(),
		response = {
			url: 'https://twitter.com/reinmarpl/status/573118615274315776',
			html: widgetHtml
		};

	bender.test( {
		'test widget downcast restores response html': function() {
			var editor = this.editor,
				data = '<div data-oembed-url="' + response.url + '">' + widgetHtml + '</div>';

			editor.widgets.registered.embed._cacheResponse( response.url, response );

			this.editorBot.setData( data, function() {
				assert.beautified.html( data, editor.getData() );
			} );
		}
	} );
} )();
