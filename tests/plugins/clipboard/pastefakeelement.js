/* bender-tags: editor */
/* bender-ckeditor-plugins: clipboard, iframe */

( function() {
	'use-strict';

	// Mock paste file from clipboard.
	function mockPasteFile( editor, dataValue ) {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.files.push( {
			type: 'text/html'
		} );

		dataTransfer.cacheData();

		editor.fire( 'paste', {
			dataTransfer: dataTransfer,
			dataValue: dataValue,
			method: 'paste',
			type: 'auto'
		} );
	}

	bender.editor = true;

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
							'<p><iframe frameborder="&quot;0&quot;" src="&quot;https://example.com&quot;" width="&quot;100&quot;" height="&quot;100&quot;&gt;&lt;/p"></iframe></p>',
							editor.getData()
						);
					} );
				} );

				mockPasteFile(
					editor,
					'<img data-cke-realelement="%3Ciframe%20frameborder%3D%22%26quot%3B0%26quot%3B%22%20src%3D%22%26quot%3Bhttps%3A%2F%2Fexample.com' +
					'%26quot%3B%22%20width%3D%22%26quot%3B100%26quot%3B%22%20height%3D%22%26quot%3B100%26quot%3B%26gt%3B%26lt%3B%2Fp%22%3E%3C%2Fiframe%3E" ' +
					'data-cke-real-node-type="1" alt="IFrame" title="IFrame" align="" src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" ' +
					'data-cke-real-element-type="iframe" data-cke-resizable="true" />'
				);

				wait();
			} );
		},

		// #638
		'test paste fake anchor': function() {
			bender.editorBot.create( {
				name: 'editor2'
			}, function( bot ) {
				var editor = bot.editor;

				editor.once( 'paste', function() {
					resume( function() {
						assert.areSame(
							'<p><a id="anchor" name="anchor"></a></p>',
							editor.getData()
						);
					} );
				} );

				mockPasteFile(
					editor,
					'<img data-cke-realelement="%3Ca%20id%3D%22anchor%22%20name%3D%22anchor%22%20data-cke-saved-name%3D%22anchor%22%3E%3C%2Fa%3E" ' +
					'data-cke-real-node-type="1" alt="Anchor" title="Anchor" align="" src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" ' +
					'data-cke-real-element-type="anchor" />'
				);

				wait();
			} );
		}
	} );
} )();
