/* bender-tags: editor */
/* bender-include: _helpers/colorTools.js */
/* global colorTools */

// Basic definitions
// 3-HEX -> hexadecimal color with only 3 characters value: #FFF
// 6-HEX -> hexadecimal color with exactly 6 characters value: #FFFFFF
// 8-HEX -> hexadecimal color with exactly 8 characters value: #FFFFFF00. Last two characters are for alpha

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

		'test color from invalid HSL with four values returns default value': colorTools.testColorConversion( 'hsl( 40, 40%, 100%, 1 )', 'default', 'getHex', 'default' ),

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

		'test color from invalid RGB with four values returns default value': colorTools.testColorConversion( 'rgb( 40, 40, 150, 1 )', 'default', 'getHex', 'default' ),

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

		'test color from valid RGB with percent returns valid RGB': colorTools.testColorConversion( 'rgb(20.5%,0,255)', 'rgb(52,0,255)', 'getRgb' )
	} );

} )();
