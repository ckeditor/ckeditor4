/* bender-tags: editor */
/* bender-include: _helpers/colorTools.js */
/* global colorTools */

// Basic definitions
// 3-HEX -> hexadecimal color with only 3 characters value: #FFF
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

		'test color from 6-HEX lower-case string returns 6-HEX': colorTools.testColorConversion( '#ffffff', '#FFFFFF', 'getHex' ),

		'test color from 3-HEX lower-case string returns 6-HEX': colorTools.testColorConversion( '#fff', '#FFFFFF', 'getHex' ),

		'test color from 8-HEX string color name returns 6-HEX': colorTools.testColorConversion( '#FF00FF00', '#FFFFFF', 'getHex' ),

		'test color from 8-HEX string color name returns same 8-HEX': colorTools.testColorConversion( '#FF00FF00', '#FF00FF00', 'getHexWithAlpha' ),

		'test color from 8-HEX string color name returns same 8-HEX (max alpha)': colorTools.testColorConversion( '#112233FF', '#112233FF', 'getHexWithAlpha' ),

		'test color from valid string color name returns 6-HEX': colorTools.testColorConversion( 'red', '#FF0000', 'getHex' ),

		'test color from valid RGB string returns 6-HEX': colorTools.testColorConversion( 'rgb( 40, 40, 150 )', '#282896', 'getHex' ),

		'test color from valid RGB string returns 6-HEX (max value)': colorTools.testColorConversion( 'rgb( 255, 40, 150 )', '#FF2896', 'getHex' ),

		'test color from valid RGB string returns 6-HEX (min value)': colorTools.testColorConversion( 'rgb( 40, 40, 0 )', '#282800', 'getHex' ),

		'test color from percentage RGB value returns 6-HEX': colorTools.testColorConversion( 'rgb( 100%, 50%, 10% )', '#FF801A', 'getHex' ),

		'test color from valid HSL string returns 6-HEX': colorTools.testColorConversion( 'hsl( 195, 1, 0.5 )', '#00BFFF', 'getHex' ),

		'test color from percentage HSL string returns 6-HEX': colorTools.testColorConversion( 'hsl( 195, 100%, 50% )', '#00BFFF', 'getHex' ),

		'test color from valid RGBA alpha 1 value returns 6-HEX': colorTools.testColorConversion( 'rgba( 123, 123, 123, 1 )', '#7B7B7B', 'getHex' ),

		'test color from valid RGBA alpha 0.5 value returns 6-HEX': colorTools.testColorConversion( 'rgba( 123, 123, 123, 0.5 )', '#BDBDBD', 'getHex' ),

		'test color from valid RGBA alpha 0 value returns 6-HEX': colorTools.testColorConversion( 'rgba( 123, 123, 123, 0)', '#FFFFFF', 'getHex' ),

		'test color from valid HSLA alpha 1 value returns 6-HEX': colorTools.testColorConversion( 'hsla( 123, 0.5, 0.5, 1 )', '#40BF46', 'getHex' ),

		'test color from valid HSLA alpha 0.5 value returns 6-HEX': colorTools.testColorConversion( 'hsla( 123, 0.5, 0.5, 0.5 )', '#A0DFA3', 'getHex' ),

		'test color from valid HSLA alpha 0 value returns 6-HEX': colorTools.testColorConversion( 'hsla( 123, 0.5, 0.5, 0)', '#FFFFFF', 'getHex' ),

		'test color from 6-HEX returns valid RGB': colorTools.testColorConversion( '#FF00FF', 'rgb(255,0,255)', 'getRgb' ),

		'test color from 8-HEX returns valid RGBA': colorTools.testColorConversion( '#FF00FF00', 'rgba(255,0,255,0)', 'getRgba' ),

		'test color from 6-HEX returns valid HSL': colorTools.testColorConversion( '#00BFFF', 'hsl(195,100%,50%)', 'getHsl' ),

		'test color from 8-HEX returns valid HSLA': colorTools.testColorConversion( '#00BFFF00','hsla(195,100%,50%,0)', 'getHsla' ),

		'test color from 6-HEX returns valid RGBA': colorTools.testColorConversion( '#FF00FFFF', 'rgba(255,0,255,1)', 'getRgba' ),

		'test color from 8-HEX returns valid RGBA (alpha 0.5)': colorTools.testColorConversion( '#FF00FF88', 'rgba(255,0,255,0.5)', 'getRgba' ),

		'test color from valid HSL string returns 8-HEX': colorTools.testColorConversion( 'hsl( 195, 1, 0.5 )', '#00BFFFFF', 'getHexWithAlpha' ),

		'test color from valid RGB with percent returns valid RGB': colorTools.testColorConversion( 'rgb(20.5%,0,255)', 'rgb(52,0,255)', 'getRgb' ),

		// (#4583)
		'test color from 4-HEX returns valid 6-HEX': colorTools.testColorConversion( '#F0F0', '#FFFFFF', 'getHex' ),

		// (#4583)
		'test color from 4-HEX returns valid 8-HEX': colorTools.testColorConversion( '#F0F0', '#FF00FF00', 'getHexWithAlpha' ),

		// (#4583)
		'test color from 4-HEX returns valid RGBA': colorTools.testColorConversion( '#F0F0', 'rgba(255,0,255,0)', 'getRgba' ),

		// (#4583)
		'test color from 4-HEX returns valid HSLA': colorTools.testColorConversion( '#F0F0','hsla(-60,100%,50%,0)', 'getHsla' ),

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
		'test converting RGB (64, 115, 38) produces HSL value with correct saturation value (100, 50%, 30%)': colorTools.testColorConversion( 'rgb( 64, 115, 38 )', 'hsl(100,50%,30%)', 'getHsl' ),

		// (#4596)
		'test converting RGBA (64, 115, 38, .4) produces HSLA value with correct saturation value (100, 50%, 30%, 0.4)': colorTools.testColorConversion( 'rgb( 64, 115, 38, .4 )',
			'hsla(100,50%,30%,0.4)', 'getHsla' ),

		// (#4096)
		'test converting HSL (123, 50%, 50%) to HSL value returns the original value': colorTools.testColorConversion( 'hsl( 123, 50%, 50% )', 'hsl(123,50%,50%)', 'getHsl' ),

		// (#4596)
		'test converting HSLA (123, 50%, 50%, 0.5) to HSLA value returns the original value': colorTools.testColorConversion( 'hsla( 123, 50%, 50%, .5 )', 'hsla(123,50%,50%,0.5)', 'getHsla' ),

		// (#4596)
		'test converting HSL (123, 0%, 50%) to HSL value returns the original value': colorTools.testColorConversion( 'hsl( 123, 0%, 50% )', 'hsl(123,0%,50%)', 'getHsl' ),

		// (#4596)
		'test converting HSL (123, 0%, 50%) to HSLA value returns the original value with 1 opacity': colorTools.testColorConversion( 'hsl( 123, 0%, 50% )', 'hsla(123,0%,50%,1)', 'getHsla' ),

		// (#4596)
		'test converting HSLA (123, 0%, 50%, 0.5) to HSLA value returns the original value': colorTools.testColorConversion( 'hsla( 123, 0%, 50%, 0.5 )', 'hsla(123,0%,50%,0.5)', 'getHsla' ),

		// (#4596)
		'test saving data about color type, hue, saturation and ligthness for HSL color': function() {
			var input = 'hsl( 100, 37%, 17% )',
				color = new CKEDITOR.tools.color( input );

			assert.areSame( CKEDITOR.tools.color.TYPE_HSL, color._.type, 'Color type is correctly set to HSL' );
			assert.areSame( 100, color._.hue, 'Hue data is saved' );
			assert.areSame( 37, color._.saturation, 'Saturation data is saved' );
			assert.areSame( 17, color._.lightness, 'Lightness data is saved' );
		},

		// (#4596)
		'test saving data about color type for RGB color': function() {
			var input = 'rgb( 124, 54, 33 )',
				color = new CKEDITOR.tools.color( input );

			assert.areSame( CKEDITOR.tools.color.TYPE_RGB, color._.type, 'Color type is correctly set to RGB' );
		},

		// (#4596)
		'test saving data about color type for hex color': function() {
			var input = '#FF00FF',
				color = new CKEDITOR.tools.color( input );

			assert.areSame( CKEDITOR.tools.color.TYPE_RGB, color._.type, 'Color type is correctly set to RGB' );
		}
	} );

} )();
