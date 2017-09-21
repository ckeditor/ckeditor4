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

						assert.beautified.html(
							'<img data-cke-realelement="%3Ciframe%3E%3C%2Fiframe%3E" data-cke-real-node-type="1" alt="IFrame" title="IFrame" ' +
							'data-cke-saved-src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" ' +
							'src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" ' +
							'data-cke-real-element-type="iframe" data-cke-resizable="true" class="cke_iframe">',
							editor.editable().getHtml().match( /<img.+?>/g )[ 0 ]
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

		// #638
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
						assert.beautified.html(
							'<img data-cke-realelement="%3Ca%20id%3D%22anchor%22%20data-cke-saved-name%3D%22anchor%22%20name%3D%22anchor%22%3E%3C%2Fa%3E" ' +
							'data-cke-real-node-type="1" alt="Anchor" title="Anchor" data-cke-saved-src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" ' +
							'src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" data-cke-real-element-type="anchor" class="cke_anchor">',
							editor.editable().getHtml().match( /<img.+?>/g )[ 0 ]
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
		}
	} );
} )();
