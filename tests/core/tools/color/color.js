/* bender-tags: editor */
/* bender-include: _helpers/colorTools.js */
/* global colorTools */

// Basic definitions
// 3-HEX -> hexadecimal color with only 3 characters value: #FFF
// 4-HEX -> hexadecimal color with exactly 4 characters value: #FFF0. Last character is for alpha
// 6-HEX -> hexadecimal color with exactly 6 characters value: #FFFFFF
// 8-HEX -> hexadecimal color with exactly 8 characters value: #FFFFFF00. Last two characters are for alpha
// n-HEX-like -> n-HEX format without the hash at the beginning: FFF, FFF0, FFFFFF, FFFFFF00

( function() {
	'use strict';

	bender.test( {
		'test color object creation': function() {
			var colorObject = new CKEDITOR.tools.color( '' );

			assert.isObject( colorObject );
		},

		'test color from non-color string name returns default undefined value': colorTools.testColorConversion( 'NotValidColorName', undefined, 'getHex' ),

		'test color from undefined value returns default value': colorTools.testColorConversion( undefined, 'default', 'getHex', 'default' ),

		'test color from null value returns default value': colorTools.testColorConversion( null , 'default', 'getHex', 'default' ),

		'test color from array returns default value': colorTools.testColorConversion( [], 'default', 'getHex', 'default' ),

		'test color from object returns default value': colorTools.testColorConversion( {}, 'default', 'getHex', 'default' ),

		'test color from outranged RGB value returns default value': colorTools.testColorConversion( 'rgb( 2940, 8840, 11150 )', 'default', 'getHex', 'default' ),

		'test color from outranged percent RGB value returns default value': colorTools.testColorConversion( 'rgb( 101%, 101%, 101% )', 'default', 'getHex', 'default' ),

		'test color from RGBA with outranged alpha value returns default value': colorTools.testColorConversion( 'rgba( 120, 120, 120, 19 )', 'default', 'getHex', 'default' ),

		'test color from RGBA with outranged alpha percent value returns default value': colorTools.testColorConversion( 'rgba( 120, 120, 120, 101% )', 'default', 'getHex', 'default' ),

		'test color from outranged percent HSL value returns default value': colorTools.testColorConversion( 'hsl( 361, 101%, 101% )', 'default', 'getHex', 'default' ),

		'test color from outranged normalized HSL value returns default value': colorTools.testColorConversion( 'hsl( 361, 1.1, 1.1 )', 'default', 'getHex', 'default' ),

		'test color from HSLA with outranged alpha value returns default value': colorTools.testColorConversion( 'hsla( 120, 100%, 100%, 19 )', 'default', 'getHex', 'default' ),

		'test color from HSLA with outranged alpha percent value returns default value': colorTools.testColorConversion( 'hsla( 120, 100%, 100%, 101% )', 'default', 'getHex', 'default' ),

		'test color from invalid 3-HEX returns default value': colorTools.testColorConversion( '#F00BAR', 'default', 'getHex', 'default' ),

		'test color from invalid 6-HEX returns default value': colorTools.testColorConversion( '#FF00FFRR', 'default', 'getHex', 'default' ),

		'test color from invalid 8-HEX returns default value': colorTools.testColorConversion( '#FF00FF00RR', 'default', 'getHex', 'default' ),

		// (#4583)
		'test RGB values are treated like RGBA values': colorTools.testColorConversion( 'rgb( 255, 0, 255, 0)', 'rgba(255,0,255,0)', 'getRgba' ),

		// (#4583)
		'test HSL values are treated like HSLA values': colorTools.testColorConversion( 'hsl( 195, 100%, 50%, 0 )', 'hsla(195,100%,50%,0)', 'getHsla' ),

		// (#4583)
		'test RGB value with no-comma syntax': colorTools.testColorConversion( 'rgb( 255 0 255 )', 'rgb(255,0,255)', 'getRgb' ),

		// (#4583)
		'test RGB value with alpha (number) and no-comma syntax': colorTools.testColorConversion( 'rgb( 255 0 255 / 0.1 )', 'rgba(255,0,255,0.1)', 'getRgba' ),

		// (#4583)
		'test RGB value with alpha (percentage) and no-comma syntax': colorTools.testColorConversion( 'rgb( 255 0 255 / 10% )', 'rgba(255,0,255,0.1)', 'getRgba' ),

		// (#4583)
		'test RGBA value with no-comma syntax': colorTools.testColorConversion( 'rgba( 255 0 255 )', 'rgb(255,0,255)', 'getRgb' ),

		// (#4583)
		'test RGBA value with alpha (number) and no-comma syntax': colorTools.testColorConversion( 'rgba( 255 0 255 / 0.1 )', 'rgba(255,0,255,0.1)', 'getRgba' ),

		// (#4583)
		'test RGBA value with alpha (percentage) and no-comma syntax': colorTools.testColorConversion( 'rgba( 255 0 255 / 10% )', 'rgba(255,0,255,0.1)', 'getRgba' ),

		// (#4583)
		'test HSL value with no-comma syntax': colorTools.testColorConversion( 'hsl( 200 50% 10% )', 'hsl(200,50%,10%)', 'getHsl' ),

		// (#4583)
		'test HSL value with alpha (number) and no-comma syntax': colorTools.testColorConversion( 'hsl( 200 50% 10% / 0.1 )', 'hsla(200,50%,10%,0.1)', 'getHsla' ),

		// (#4583)
		'test HSL value with alpha (percentage) and no-comma syntax': colorTools.testColorConversion( 'hsl( 200 50% 10% / 10% )', 'hsla(200,50%,10%,0.1)', 'getHsla' ),

		// (#4583)
		'test HSLA value with no-comma syntax': colorTools.testColorConversion( 'hsla( 200 50% 10% )', 'hsl(200,50%,10%)', 'getHsl' ),

		// (#4583)
		'test HSLA value with alpha (number) and no-comma syntax': colorTools.testColorConversion( 'hsla( 200 50% 10% / 0.1 )', 'hsla(200,50%,10%,0.1)', 'getHsla' ),

		// (#4583)
		'test HSLA value with alpha (percentage) and no-comma syntax': colorTools.testColorConversion( 'hsla( 200 50% 10% / 10% )', 'hsla(200,50%,10%,0.1)', 'getHsla' ),

		// (#4583)
		'test 6-HEX-like value is treated as 6-HEX value': colorTools.testColorConversion( 'FF0000', '#FF0000', 'getHex' ),

		// (#4583)
		'test 3-HEX-like value is treated as 3-HEX value': colorTools.testColorConversion( 'F00', '#FF0000', 'getHex' ),

		// (#4583)
		'test 8-HEX-like value is treated as 8-HEX value': colorTools.testColorConversion( 'FF0000FF', '#FF0000FF', 'getHexWithAlpha' ),

		// (#4583)
		'test 4-HEX-like value is treated as 8-HEX value': colorTools.testColorConversion( 'F00F', '#FF0000FF', 'getHexWithAlpha' ),

		// (#4596)
		'test HSL value with saturation not in percents treated as invalid color': function() {
			var input = 'hsl( 100, 50, 12% )',
				color = new CKEDITOR.tools.color( input );

			assert.isFalse( color._.isValidColor, 'color is valid despite the incorrect format' );
		},

		// (#4596)
		'test HSL value with lightness not in percents treated as invalid color': function() {
			var input = 'hsl( 100, 50%, 12 )',
				color = new CKEDITOR.tools.color( input );

			assert.isFalse( color._.isValidColor, 'color is valid despite the incorrect format' );
		},

		// (#4596)
		'test HSL value with saturation as fraction treated as invalid color': function() {
			var input = 'hsl( 100, 0.5, 12% )',
				color = new CKEDITOR.tools.color( input );

			assert.isFalse( color._.isValidColor, 'color is valid despite the incorrect format' );
		},

		// (#4596)
		'test HSL value with lightness as fraction treated as invalid color': function() {
			var input = 'hsl( 100, 5%, 0.2 )',
				color = new CKEDITOR.tools.color( input );

			assert.isFalse( color._.isValidColor, 'color is valid despite the incorrect format' );
		},

		// (#4596)
		'test HSLA value with saturation not in percents treated as invalid color': function() {
			var input = 'hsla( 100, 50, 12%, 0.5 )',
				color = new CKEDITOR.tools.color( input );

			assert.isFalse( color._.isValidColor, 'color is valid despite the incorrect format' );
		},

		// (#4596)
		'test HSLA value with lightness not in percents treated as invalid color': function() {
			var input = 'hsla( 100, 50%, 12, .1 )',
				color = new CKEDITOR.tools.color( input );

			assert.isFalse( color._.isValidColor, 'color is valid despite the incorrect format' );
		},

		// (#4596)
		'test HSLA value with saturation as fraction treated as invalid color': function() {
			var input = 'hsla( 100, 0.5, 12%, .2 )',
				color = new CKEDITOR.tools.color( input );

			assert.isFalse( color._.isValidColor, 'color is valid despite the incorrect format' );
		},

		// (#4596)
		'test HSLA value with lightness as fraction treated as invalid color': function() {
			var input = 'hsla( 100, 5%, 0.2, 0.45 )',
				color = new CKEDITOR.tools.color( input );

			assert.isFalse( color._.isValidColor, 'color is valid despite the incorrect format' );
		},

		// ($4596)
		'test HSL value with hue in degrees is treated as valid color': function() {
			var input = 'hsl( 100deg, 5%, 2% )',
				color = new CKEDITOR.tools.color( input );

			assert.isTrue( color._.isValidColor, 'color is invalid despite the correct format' );
		},

		// ($4596)
		'test HSLA value with hue in degrees is treated as valid color': function() {
			var input = 'hsla( 100deg, 5%, 2%, 0.45 )',
				color = new CKEDITOR.tools.color( input );

			assert.isTrue( color._.isValidColor, 'color is invalid despite the correct format' );
		},

		// (#4596)
		'test HSLA in no-comma syntax with hue in degrees is treated as valid color': function() {
			var input = 'hsl( 100deg 5% 2% / 0.45 )',
				color = new CKEDITOR.tools.color( input );

			assert.isTrue( color._.isValidColor, 'color is invalid despite the correct format' );
		},

		// (#4596)
		'test HSLA with fractional percents in saturation and lightness is treated as valid color': function() {
			var input = 'hsla( 100, 0.5%, .4%, .2 );',
				color = new CKEDITOR.tools.color( input );

			assert.isTrue( color._.isValidColor, 'color is invalid despite the correct format'  );
		}
	} );

} )();
