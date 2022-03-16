( function() {
	'use strict';

	CKEDITOR.plugins.add('removeEntities', {
		icons: 'about', // %REMOVE_LINE_CORE%
		init: function (editor) {
			//Plugin logic goes here.
			console.log('removeEntities');
			editor.setData('test');
		}
	});

});
