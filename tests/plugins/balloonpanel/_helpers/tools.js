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

	/**
	 * Asserts balloon toolbar move method. If `options.maxX` or `options.maxY` is passed will use `assertInRange`, otherwise will use `areEqual`.
	 *
	 * @param {Object} options
	 * @param {Number} options.expectedX Expected X value.
	 * @param {Number} options.expectedY Expected Y value.
	 * @param {Number} [options.maxX] Maximum expected X value.
	 * @param {Number} [options.maxY] Maximum expected Y value.
	 * @param {Object} options.moveMethod Spied `move` method.
	 */
	assertMoveTo: function( options ) {
		//moveMethod, expectedX, expectedY, maxX, maxY, shouldRound
		var actualX = options.moveMethod.args[ 0 ][ 1 ],
			actualY = options.moveMethod.args[ 0 ][ 0 ],
			maxX = options.maxX,
			maxY = options.maxY;

		// Round values, as there is no need to compare pixels as floats.
		if ( options.shouldRound ) {
			actualX = Math.round( actualX );
			actualY = Math.round( actualY );
		}

		if ( maxX || maxY ) {
			maxX = maxX || options.expectedX;
			maxY = maxY || options.expectedY;

			this.assertInRange( options.expectedX, maxX, actualX, 'balloon move() x argument is not in range' );
			this.assertInRange( options.expectedY, maxY, actualY, 'balloon move() y argument is not in range' );
		} else {
			assert.areEqual( options.expectedX, actualX, 'invalid balloon move() x value' );
			assert.areEqual( options.expectedY, actualY, 'invalid balloon move() y value' );
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
	},

	getDocumentOrigin: function() {
		// The `document.location.origin` is not available on IE8-10 (#1276).
		if ( !document.location.origin ) {
			return document.location.protocol + '//' + document.location.hostname + ( document.location.port ? ':' + document.location.port : '' );
		}
		return document.location.origin;
	},

	getTriangleTipPosition: function( balloon ) {
		var pos = {
			x: balloon.rect.left,
			y: balloon.rect.top
		};

		switch ( balloon.triangleSide + ' ' + balloon.triangleAlign ) {
			case 'right vcenter':
				pos.x = pos.x + balloon.rect.width + balloon.triangleWidth;
				pos.y = pos.y + balloon.rect.height / 2;
				break;
			case 'left vcenter':
				pos.x = pos.x - balloon.triangleWidth;
				pos.y = pos.y + balloon.rect.height / 2;
				break;
			case 'top hcenter':
				pos.x = pos.x + balloon.rect.width / 2;
				pos.y = pos.y - balloon.triangleHeight;
				break;
			case 'top left':
				pos.x = pos.x + balloon.triangleMinDistance;
				pos.y = pos.y - balloon.triangleHeight;
				break;
			case 'top right':
				pos.x = pos.x + balloon.rect.width - balloon.triangleMinDistance;
				pos.y = pos.y - balloon.triangleHeight;
				break;
			case 'bottom hcenter':
				pos.x = pos.x + balloon.rect.width / 2;
				pos.y = pos.y + balloon.height + balloon.triangleHeight;
				break;
			case 'bottom left':
				pos.x = pos.x + balloon.triangleMinDistance;
				pos.y = pos.y + balloon.height + balloon.triangleHeight;
				break;
			case 'bottom right':
				pos.x = pos.x + balloon.rect.width - balloon.triangleMinDistance;
				pos.y = pos.y + balloon.height + balloon.triangleHeight;
				break;
		}
		return pos;
	},

	// (#2796)
	removeDotsFromUrl: function( expectedPath ) {
		var parts = expectedPath.split( '/' ),
			amountToRemove = 0;
		for ( var i = parts.length - 1; i; i-- ) {
			if ( parts[ i ] === '..' ) {
				amountToRemove++;
				parts.splice( i, 1 );
				continue;
			}
			if ( amountToRemove ) {
				parts.splice( i, 1 );
				amountToRemove--;
			}
		}
		return parts.join( '/' );
	}

};
