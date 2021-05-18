/* exported colorTools */

var colorTools = ( function() {
	function testColorConversion( inputColorCode, expectedColorCode, getterMethod, defaultValue ) {
		return function() {
			var colorObj = new CKEDITOR.tools.color( inputColorCode, defaultValue );

			var resultColorCode = typeof getterMethod === 'function' ? getterMethod( colorObj ) : colorObj[ getterMethod ]();

			assert.areSame( expectedColorCode, resultColorCode );
		};
	}

	return {
		testColorConversion: testColorConversion
	};
} )();
