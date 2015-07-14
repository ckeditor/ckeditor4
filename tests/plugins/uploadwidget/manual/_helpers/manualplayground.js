/* global editors */
/* exported manualPlayground */

'use strict';

var manualPlayground = {
	showWarning: function() {
		editors.forEach( function( editor ) {
			editor.showNotification( 'Drag an image here.', 'warning' );
			editor.focus();
		} );
	}
};
