/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: image2,justify,toolbar */
/* bender-include: ../widget/_helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'img figure[id]{*}',
			autoParagraph: false
		}
	};

	var getWidgetById = widgetTestsTools.getWidgetById,
		widgetHtml = '<img src="_assets/foo.png" alt="foo" width="100" id="x" />';

	bender.test( {
		// (#3394)
		'test image preloader URL with query string': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bot.setData( widgetHtml, function() {
				var widget = getWidgetById( editor, 'x' );

				widget.focus();

				editor.on( 'dialogShow', function( evt ) {
					resume( function() {
						var dialog = evt.data,
							srcElement = dialog.getContentElement( 'info', 'src' ),
							imageSpy = sinon.spy( CKEDITOR.dom.element.prototype, 'setAttribute' );

						srcElement.setValue( '_assets/foo.png?query=test' );

						// Check if image preloader produces correct URL with a query string.
						var result = imageSpy.calledWithMatch( 'src', function( value ) {
							return value.match( /^_assets\/foo\.png\?query=test&[a-z0-9]*$/ );
						} );

						dialog.hide();
						imageSpy.restore();

						assert.isTrue( result );
					} );
				} );

				editor.execCommand( 'image' );
				wait();
			} );
		}
	} );
} )();
