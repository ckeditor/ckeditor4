/* bender-tags: editor */
/* bender-ckeditor-plugins: clipboard, iframe, link */

( function() {
	'use-strict';

	// Mock paste file from clipboard.
	function mockPasteFile( editor, dataValue ) {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.files.push( {
			type: 'text/html'
		} );

		dataTransfer.setData( 'text/html', dataValue );
		dataTransfer.cacheData();

		editor.fire( 'paste', {
			dataTransfer: dataTransfer,
			dataValue: dataValue,
			method: 'paste',
			type: 'auto'
		} );
	}

	if ( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ) {
		bender.ignore();
		return;
	}

	bender.test( {
		// #638
		'test paste fake iframe': function() {
			bender.editorBot.create( {
				name: 'editor1'
			}, function( bot ) {
				var editor = bot.editor;

				editor.once( 'paste', function() {
					resume( function() {
						assert.areSame(
							'<p><iframe></iframe></p>',
							editor.getData()
						);

						assert.isInnerHtmlMatching(
							bender.tools.html.prepareInnerHtmlForComparison(
								'<p><img data-cke-realelement="%3Ciframe%3E%3C%2Fiframe%3E" data-cke-real-node-type="1" alt="IFrame" title="IFrame" ' +
								'data-cke-saved-src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" ' +
								'src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" ' +
								'data-cke-real-element-type="iframe" data-cke-resizable="true" class="cke_iframe">@</p>',
								{ fixStyles: true }
							),

							editor.editable().getHtml(),
							{ fixStyles: true }
						);
					} );
				} );

				mockPasteFile(
					editor,
					'<img class="cke_iframe" data-cke-realelement="%3Ciframe%3E%3C%2Fiframe%3E" data-cke-real-node-type="1" ' +
					'alt="IFrame" title="IFrame" align="" src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" ' +
					'data-cke-real-element-type="iframe" data-cke-resizable="true">'
				);

				wait();
			} );
		},

		'test paste fake anchor': function() {
			bender.editorBot.create( {
				name: 'editor2'
			}, function( bot ) {
				var editor = bot.editor;

				editor.on( 'paste', function() {
					resume( function() {
						assert.areSame(
							'<p><a id="anchor" name="anchor"></a></p>',
							editor.getData()
						);

						assert.isInnerHtmlMatching(
							bender.tools.html.prepareInnerHtmlForComparison(
								'<p><img data-cke-realelement="%3Ca%20id%3D%22anchor%22%20data-cke-saved-name%3D%22anchor%22%20name%3D%22anchor%22%3E%3C%2Fa%3E" ' +
								'data-cke-real-node-type="1" alt="Anchor" title="Anchor" data-cke-saved-src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" ' +
								'src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" data-cke-real-element-type="anchor" class="cke_anchor">@</p>',
								{ fixStyles: true }
							),

							editor.editable().getHtml(),
							{ fixStyles: true }
						);
					} );
				} );

				mockPasteFile(
					editor,
					'<img data-cke-realelement="%3Ca%20id%3D%22anchor%22%20data-cke-saved-name%3D%22anchor%22%20name%3D%22anchor%22%3E%3C%2Fa%3E" ' +
					'data-cke-real-node-type="1" alt="Anchor" title="Anchor" data-cke-saved-src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" ' +
					'src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" data-cke-real-element-type="anchor" class="cke_anchor">'
				);

				wait();
			} );
		},

		'test paste fake object with additional content': function() {
			bender.editorBot.create( {
				name: 'editor3'
			}, function( bot ) {
				var editor = bot.editor;

				editor.on( 'paste', function() {
					resume( function() {
						assert.beautified.html(
							'<p>Lorem ipsum</p>' +
							'<p><iframe frameborder="0" height="100" src="https://example.com" width="100"></iframe></p>',
							editor.getData()
						);

						assert.isInnerHtmlMatching(
							bender.tools.html.prepareInnerHtmlForComparison(
								'<p>Lorem ipsum</p>' +
								'<p><img data-cke-realelement="%3Ciframe%20frameborder%3D%220%22%20height%3D%22100%22%20src%3D%22https%3A%2F%2Fexample.com%22%20width%3D%22100%22%3E%3C%2Fiframe%3E" ' +
								'data-cke-real-node-type="1" alt="IFrame" title="IFrame" data-cke-saved-src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" ' +
								'src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" data-cke-real-element-type="iframe" data-cke-resizable="true" ' +
								'style="height:100px; width:100px" class="cke_iframe">@</p>',
								{ fixStyles: true }
							),

							editor.editable().getHtml(),
							{ fixStyles: true }
						);
					} );
				} );

				mockPasteFile(
					editor,
					'<p>Lorem ipsum</p>' +
					'<p><img data-cke-realelement="%3Ciframe%20frameborder%3D%220%22%20height%3D%22100%22%20src%3D%22https%3A%2F%2Fexample.com%22%20width%3D%22100%22%3E%3C%2Fiframe%3E" ' +
					'data-cke-real-node-type="1" alt="IFrame" title="IFrame" data-cke-saved-src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" ' +
					'src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" data-cke-real-element-type="iframe" data-cke-resizable="true" ' +
					'style="height:100px; width:100px" class="cke_iframe"></p>'
				);

				wait();
			} );
		},

		'test paste iframe with image2': function() {
			bender.editorBot.create( {
				name: 'editor4',
				config: {
					extraPlugins: 'image2'
				}
			}, function( bot ) {
				var editor = bot.editor;

				editor.on( 'paste', function() {
					resume( function() {
						assert.beautified.html(
							'<p><img alt="" src="../../_assets/lena.jpg" /></p><p><iframe frameborder="0" src="https://example.com" width="100" height="100"></iframe></p>',
							editor.getData()
						);

						assert.isInnerHtmlMatching(
							bender.tools.html.prepareInnerHtmlForComparison(
								'<p><span tabindex="-1" contenteditable="false" data-cke-widget-wrapper="1" data-cke-filter="off" ' +
								'class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption" data-cke-display-name="image" ' +
								'data-cke-widget-id="0" role="region" aria-label=" image widget"><img alt="" data-cke-saved-src="../../_assets/lena.jpg" src="../../_assets/lena.jpg" ' +
								'data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22..%2F..%2F_assets%2Flena.jpg%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22%22%2C%22height' +
								'%22%3A%22%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-upcasted="1" data-cke-widget-keep-attr="0" ' +
								'data-widget="image" class="cke_widget_element"><span class="cke_reset cke_widget_drag_handler_container" style="background:rgba(220,220,220,0.5);' +
								'background-image:url(http://tests.ckeditor.test:1030/apps/ckeditor/plugins/widget/images/handle.png)"><img class="cke_reset cke_widget_drag_handler" ' +
								'data-cke-widget-drag-handler="1" src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" width="15" ' +
								'title="Click and drag to move" height="15" role="presentation" draggable="true"></span><span class="cke_image_resizer" title="Click and drag to resize">​' +
								'</span></span></p><p><img data-cke-realelement="%3Ciframe%20frameborder%3D%220%22%20height%3D%22100%22%20src%3D%22https%3A%2F%2Fexample.com%22%20width%3D' +
								'%22100%22%3E%3C%2Fiframe%3E" data-cke-real-node-type="1" alt="IFrame" title="IFrame" data-cke-saved-src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5' +
								'BAEKAAAALAAAAAABAAEAAAICRAEAOw==" src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" data-cke-real-element-type="iframe" ' +
								'data-cke-resizable="true" width="100" height="100" class="cke_iframe">​​​​​​​</p>',
								{ fixStyles: true }
							),

							editor.editable().getHtml(),
							{ fixStyles: true }
						);
					} );
				} );

				mockPasteFile(
					editor,
					'<p><img alt="" src="../../_assets/lena.jpg" /></p><p><img data-cke-realelement="%3Ciframe%20frameborder%3D%220%22%20height%3D%22100%22%20src%3D%22https%3A%2F%2Fexample.com' +
					'%22%20width%3D%22100%22%3E%3C%2Fiframe%3E" data-cke-real-node-type="1" alt="IFrame" title="IFrame" data-cke-saved-src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAE' +
					'KAAAALAAAAAABAAEAAAICRAEAOw==" src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" data-cke-real-element-type="iframe" data-cke-resizable="true" ' +
					'style="height:100px; width:100px" class="cke_iframe"></p>'
				);

				wait();
			} );
		}
	} );
} )();
