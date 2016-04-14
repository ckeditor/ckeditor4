/* exported balloonTestsTools */

var balloonTestsTools = {
	// @todo: Adjusted inRange assertion, it should be proposed to std assertion lib.
	assertInRange: function( expectedMin, expectedMax, actual, message ) {
		var YTest = bender.Y.Test,
			min,
			max;

		YTest.Assert.isNumber( actual, 'Actual value should be number type.' );
		YTest.Assert.isNumber( expectedMin, 'Min value should be number type.' );
		YTest.Assert.isNumber( expectedMax, 'Max value should be number type.' );

		min = Math.min( expectedMin, expectedMax );
		max = Math.max( expectedMin, expectedMax );

		YTest.Assert._increment();

		if ( actual < min || actual > max ) {
			throw new YTest.ComparisonFailure(
				YTest.Assert._formatMessage( message || 'Number is not within a valid range.' ),
				'[' + min + ', ' + max + ']',
				actual
			);
		}
	},

	assertMoveTo: function( moveMethod, expectedX, expectedY, maxX, maxY ) {
		var actualX = moveMethod.args[ 0 ][ 1 ],
			actualY = moveMethod.args[ 0 ][ 0 ];

		if ( maxX !== undefined || maxY !== undefined ) {
			maxX = maxX !== undefined ? maxX : expectedX;
			maxY = maxY !== undefined ? maxY : expectedY;

			this.assertInRange( expectedX, maxX, actualX, 'balloon move() x argument is not in range' );
			this.assertInRange( expectedY, maxY, actualY, 'balloon move() y argument is not in range' );
		} else {
			assert.areEqual( expectedX, actualX, 'invalid balloon move() x value' );
			assert.areEqual( expectedY, actualY, 'invalid balloon move() y value' );
		}
	},

	// Attaches balloon (this.balloon) to the given element.
	//
	// @param {String/CKEDITOR.dom.element} elementId String or element that ballooons hould be attached to.
	attachBalloon: function( balloon, elementId ) {
		var elem = typeof elementId == 'string' ? balloon.editor.editable().findOne( '#' + elementId ) : elementId;
		balloon.attach( elem );
		// For some reason cke_reset_all overrides balloon styling in tests.
		balloon.parts.panel.removeClass( 'cke_reset_all' );
	}
};
