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

	return {
		getTestContent: getTestContent,
		getEditorSize: getEditorSize
	};
} )();
