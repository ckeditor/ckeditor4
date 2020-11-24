/* exported autogrowTools */

var autogrowTools = ( function() {
	function getEditorSize( editor ) {
		return {
			width: parseInt( editor.getResizable().getComputedStyle( 'width' ), 10 ),
			height: parseInt( editor.getResizable().getComputedStyle( 'height' ), 10 )
		};
	}

	function getTestContent( numberOfParagraphs ) {
		var html = '',
			paragraphsCount = numberOfParagraphs || 1;

		for ( var i = 0; i < paragraphsCount; i++ ) {
			html += '<p>test ' + i + '</p>';
		}

		return html;
	}

	function testEditorSizeWithContent( editorWidth ) {
		bender.editorBot.create( {
			name: 'editor_' + new Date().getTime(),
			config: {
				width: editorWidth
			}
		}, function( bot ) {
			var paragraphsCount = 10;

			bot.setData( autogrowTools.getTestContent( paragraphsCount ), function() {
				var editor = bot.editor,
					initialEditorSize = autogrowTools.getEditorSize( editor );

				editor.once( 'afterCommandExec', function() {
					resume( function name() {
						var editorSize = autogrowTools.getEditorSize( editor );

						assert.isTrue( editorSize.height > initialEditorSize.height, 'Editor height should increase' );
						assert.areEqual( editorSize.width, initialEditorSize.width, 'Editor width should not change' );
					} );
				} );

				editor.execCommand( 'autogrow' );

				wait();
			} );
		} );
	}

	return {
		getTestContent: getTestContent,
		getEditorSize: getEditorSize,
		testEditorSizeWithContent: testEditorSizeWithContent
	};
} )();
