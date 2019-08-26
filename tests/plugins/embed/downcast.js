/* bender-tags: embed */
/* bender-ckeditor-plugins: embed,toolbar */

( function() {
	'use strict';

	var widgetHtml = CKEDITOR.document.findOne( '#widget-html' ).getValue(),
		response = {
				url: 'https://twitter.com/reinmarpl/status/573118615274315776',
				html: widgetHtml
			},
		data = getDowncastedHtml( response.html, response.url );

	bender.editor = {
		config: {
			on: {
				instanceReady: function() {
					this.widgets.registered.embed._cacheResponse( response.url, response );
				}
			}
		}
	};

	bender.test( {
		'test widget with attr "data-restore-html" has it\'s html restored on downcast': function() {
			var editor = this.editor;

			this.editorBot.setData( data, function() {
				assert.beautified.html( data, editor.getData() );
			} );
		},
		'test widget without attr "data-restore-html" preserves it\'s on downcast': function() {
			var editor = this.editor;

			this.editorBot.setData( data, function() {
				var element = editor.editable().findOne( '[data-restore-html]' ),
					innerHtml = '<div>Foo bar</div>',
					expected = getDowncastedHtml( innerHtml, response.url );

				element.removeAttribute( 'data-restore-html' );
				element.setHtml( innerHtml );

				assert.beautified.html( expected, editor.getData() );
			} );
		}
	} );

	function getDowncastedHtml( innerHtml, url ) {
		return '<div data-oembed-url="' + url + '">' + innerHtml + '</div>';
	}
} )();
