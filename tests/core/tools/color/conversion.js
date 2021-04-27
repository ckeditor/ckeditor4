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

		'test color from valid HSL string returns 6-HEX': colorTools.testColorConversion( 'hsl( 195, 100%, 50% )', '#00BFFF', 'getHex' ),

		'test color from percentage HSL string returns 6-HEX': colorTools.testColorConversion( 'hsl( 195, 100%, 50% )', '#00BFFF', 'getHex' ),

		'test color from valid RGBA alpha 1 value returns 6-HEX': colorTools.testColorConversion( 'rgba( 123, 123, 123, 1 )', '#7B7B7B', 'getHex' ),

		'test color from valid RGBA alpha 0.5 value returns 6-HEX': colorTools.testColorConversion( 'rgba( 123, 123, 123, 0.5 )', '#BDBDBD', 'getHex' ),

		'test color from valid RGBA alpha 0 value returns 6-HEX': colorTools.testColorConversion( 'rgba( 123, 123, 123, 0)', '#FFFFFF', 'getHex' ),

		'test color from valid HSLA alpha 1 value returns 6-HEX': colorTools.testColorConversion( 'hsla( 123, 50%, 50%, 1 )', '#40BF46', 'getHex' ),

		'test color from valid HSLA alpha 0.5 value returns 6-HEX': colorTools.testColorConversion( 'hsla( 123, 50%, 50%, 0.5 )', '#A0DFA3', 'getHex' ),

		'test color from valid HSLA alpha 0 value returns 6-HEX': colorTools.testColorConversion( 'hsla( 123, 50%, 50%, 0)', '#FFFFFF', 'getHex' ),

		'test color from 6-HEX returns valid RGB': colorTools.testColorConversion( '#FF00FF', 'rgb(255,0,255)', 'getRgb' ),

		'test color from 8-HEX returns valid RGBA': colorTools.testColorConversion( '#FF00FF00', 'rgba(255,0,255,0)', 'getRgba' ),

		'test color from 6-HEX returns valid HSL': colorTools.testColorConversion( '#00BFFF', 'hsl(195,100%,50%)', 'getHsl' ),

		'test color from 8-HEX returns valid HSLA': colorTools.testColorConversion( '#00BFFF00','hsla(195,100%,50%,0)', 'getHsla' ),

		'test color from 6-HEX returns valid RGBA': colorTools.testColorConversion( '#FF00FFFF', 'rgba(255,0,255,1)', 'getRgba' ),

		'test color from 8-HEX returns valid RGBA (alpha 0.5)': colorTools.testColorConversion( '#FF00FF88', 'rgba(255,0,255,0.5)', 'getRgba' ),

		'test color from valid HSL string returns 8-HEX': colorTools.testColorConversion( 'hsl( 195, 100%, 50% )', '#00BFFFFF', 'getHexWithAlpha' ),

		'test color from valid RGB with percent returns valid RGB': colorTools.testColorConversion( 'rgb(20.5%,0,255)', 'rgb(52,0,255)', 'getRgb' ),

		// (#4583)
		'test color from 4-HEX returns valid 6-HEX': colorTools.testColorConversion( '#F0F0', '#FFFFFF', 'getHex' ),

		// (#4583)
		'test color from 4-HEX returns valid 8-HEX': colorTools.testColorConversion( '#F0F0', '#FF00FF00', 'getHexWithAlpha' ),

		// (#4583)
		'test color from 4-HEX returns valid RGBA': colorTools.testColorConversion( '#F0F0', 'rgba(255,0,255,0)', 'getRgba' ),

		// (#4583)
		'test color from 4-HEX returns valid HSLA': colorTools.testColorConversion( '#F0F0', 'hsla(-60,100%,50%,0)', 'getHsla' ),

		// (#4597)
		'test converting RGB (64, 115, 38) produces HSL value with correct saturation value (100, 50%, 30%)': colorTools.testColorConversion( 'rgb( 64, 115, 38 )', 'hsl(100,50%,30%)', 'getHsl' ),

		// (#4597)
		'test converting RGBA (64, 115, 38, .4) produces HSLA value with correct saturation value (100, 50%, 30%, 0.4)': colorTools.testColorConversion( 'rgb( 64, 115, 38, .4 )',
			'hsla(100,50%,30%,0.4)', 'getHsla' ),

		// (#4096)
		'test converting HSL (123, 50%, 50%) to HSL value returns the original value': colorTools.testColorConversion( 'hsl( 123, 50%, 50% )', 'hsl(123,50%,50%)', 'getHsl' ),

		// (#4597)
		'test converting HSLA (123, 50%, 50%, 0.5) to HSLA value returns the original value': colorTools.testColorConversion( 'hsla( 123, 50%, 50%, .5 )', 'hsla(123,50%,50%,0.5)', 'getHsla' ),

		// (#4597)
		'test converting HSL (123, 0%, 50%) to HSL value returns the original value': colorTools.testColorConversion( 'hsl( 123, 0%, 50% )', 'hsl(123,0%,50%)', 'getHsl' ),

		// (#4597)
		'test converting HSL (123, 0%, 50%) to HSLA value returns the original value with 1 opacity': colorTools.testColorConversion( 'hsl( 123, 0%, 50% )', 'hsla(123,0%,50%,1)', 'getHsla' ),

		// (#4597)
		'test converting HSLA (123, 0%, 50%, 0.5) to HSLA value returns the original value': colorTools.testColorConversion( 'hsla( 123, 0%, 50%, 0.5 )', 'hsla(123,0%,50%,0.5)', 'getHsla' )
	} );

} )();
