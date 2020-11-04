/* bender-tags: editor */
( function() {
	'use strict';

	bender.test( {
		'test color object creation': function() {
			var color = new CKEDITOR.tools.style.Color("");
			console.log(color);

			// assert.isObject(color);
			assert.isObject(color);
		}
	});

} )();
