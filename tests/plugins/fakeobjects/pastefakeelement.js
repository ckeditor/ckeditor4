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
					} );
				} );

				mockPasteFile(
					editor,
					'<p><img alt="" src="../../_assets/lena.jpg" /></p><p><iframe frameborder="0" src="https://example.com" width="100" height="100"></iframe></p>'
				);

				wait();
			} );
		}
	} );
} )();
