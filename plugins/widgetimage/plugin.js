'use strict';

(function() {

	CKEDITOR.plugins.add( 'widgetimage', {
		requires: 'widget,image',
		init: function( editor ) {
			editor.widgets.add( 'widgetimage', {} );
		}
	} );

})()