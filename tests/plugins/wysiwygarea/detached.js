/* bender-tags: editor */
/* bender-ckeditor-plugins: basicstyles,toolbar */

( function() {
	bender.test( {
		'Reattached editor contains same data': function() {
			var startupData = '<p>CKEditor4</p>';

			bender.editorBot.create( {
				startupData: startupData
			}, function( bot ) {
				var editorContainer	= bot.editor.container,
					editorContainerParent = editorContainer.getParent();

				editorContainer.remove();
				editorContainerParent.append( editorContainer );

				var iframeElement = bot.editor.ui.space( 'contents' ).findOne( 'iframe' );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						var editorData = iframeElement.getFrameDocument().getBody().getHtml();
						assert.areSame( startupData, editorData );
					} );
				}, 500 );

				wait();
			} );
		}
	} );
} )();
