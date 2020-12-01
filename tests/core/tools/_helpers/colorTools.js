/* exported colorTools */

var colorTools = ( function() {
	function testColorConversion( inputColorCode, expectedColorCode, getterMethod ) {
		return function() {
			var colorObj = new CKEDITOR.tools.color( inputColorCode );

			var resultColorCode = colorObj[getterMethod]();

			assert.areSame( expectedColorCode, resultColorCode );
		};
	}

	return {
		testColorConversion: testColorConversion
	};
} )();
