/* exported autogrowTools */

var autogrowTools = ( function() {
	function getEditorSize( editor ) {
		return {
			width: parseInt( editor.getResizable().getComputedStyle( 'width' ), 10 ),
			height: parseInt( editor.getResizable().getComputedStyle( 'height' ), 10 )
		};
	}

	return {
		getEditorSize: getEditorSize
	};
} )();
