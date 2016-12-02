/* exported htmlWithSelectionHelper */

'use strict';

var htmlWithSelectionHelper = {

	pHtml: function( selectionOnEnd, text ) {
		var content = text || 'This is text',
			onStart = '',
			onEnd = '';

		if ( CKEDITOR.env.safari ) {
			content = ( selectionOnEnd ? content + ']' : '[' + content );
		} else {
			selectionOnEnd ? onEnd = ']' : onStart = '[';
		}

		return onStart + '<p>' + content + '</p>' + onEnd;
	},

	fillerHtml: function( end ) {
		var content = '&nbsp;',
			onStart = '',
			onEnd = '';

		if ( CKEDITOR.env.safari ) {
			content = ( end ? content + ']' : '[' + content );
		} else {
			end ? onEnd = ']' : onStart = '[';
		}

		return onStart + '<div data-cke-filler-webkit="' + ( end ? 'end' : 'start' ) + '" data-cke-temp="1" style="border:0px; display:block; height:0px; left:-9999px;' +
			' margin:0px; opacity:0; overflow:hidden; padding:0px; position:absolute; top:0px; width:0px">' + content + '</div>' + onEnd;
	}
};
