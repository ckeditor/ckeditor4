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
		setUp: function() {
			this.createColor = function( colorCode ) {
				return new CKEDITOR.tools.color( colorCode );
			};
		},

		'test color object creation': function() {
			var colorObject = this.createColor( '' );

			assert.isObject( colorObject );
		},

		'test color from non-color string name returns default undefined value': colorTools.testColorConversion( 'NotValidColorName', undefined, 'getHex' ),

		'test color from 6-HEX lower-case string returns 6-HEX': colorTools.testColorConversion( '#ffffff', '#FFFFFF', 'getHex' ),

		'test color from 3-HEX lower-case string returns 6-HEX': colorTools.testColorConversion( '#fff', '#FFFFFF', 'getHex' ),

		'test color from 8-HEX string color name returns 6-HEX': colorTools.testColorConversion( '#FF00FF00', '#FFFFFF', 'getHex' ),

		'test color from 8-HEX string color name returns same 8-HEX': colorTools.testColorConversion( '#FF00FF00', '#FF00FF00', 'getHexAlpha' ),

		'test color from valid string color name returns 6-HEX': colorTools.testColorConversion( 'red', '#FF0000', 'getHex' ),

		'test color from valid rgb string returns 6-HEX': colorTools.testColorConversion( 'rgb( 40, 40, 150 )', '#282896', 'getHex' ),

		'test color from outranged rgb value returns default 6-HEX': colorTools.testColorConversion( 'rgb( 2940, 8840, 11150 )', '#000000', 'getHex' ),

		'test color from percentage rgb value returns 6-HEX': colorTools.testColorConversion( 'rgb( 100%, 50%, 10% )', '#FF801A', 'getHex' ),

		'test color from valid hsl string returns 6-HEX': colorTools.testColorConversion( 'hsl( 195, 1, 0.5 )', '#00BFFF', 'getHex' ),

		'test color from outranged hsl string returns 6-HEX': colorTools.testColorConversion( 'hsl( 999, 1882, 128 )', '#FFFFFF', 'getHex' ),

		'test color from percentage hsl string returns 6-HEX': colorTools.testColorConversion( 'hsl( 195, 100%, 50% )', '#00BFFF', 'getHex' ),

		'test color from valid rgba alpha 1 value returns 6-HEX': colorTools.testColorConversion( 'rgba( 123, 123, 123, 1 )', '#7B7B7B', 'getHex' ),

		'test color from valid rgba alpha 0.5 value returns 6-HEX': colorTools.testColorConversion( 'rgba( 123, 123, 123, 0.5 )', '#BDBDBD', 'getHex' ),

		'test color from valid rgba alpha 0 value returns 6-HEX': colorTools.testColorConversion( 'rgba( 123, 123, 123, 0)', '#FFFFFF', 'getHex' ),

		'test color from valid hsla alpha 1 value returns 6-HEX': colorTools.testColorConversion( 'hsla( 123, 0.5, 0.5, 1 )', '#40BF46', 'getHex' ),

		'test color from valid hsla alpha 0.5 value returns 6-HEX': colorTools.testColorConversion( 'hsla( 123, 0.5, 0.5, 0.5 )', '#A0DFA3', 'getHex' ),

		'test color from valid hsla alpha 0 value returns 6-HEX': colorTools.testColorConversion( 'hsla( 123, 0.5, 0.5, 0)', '#FFFFFF', 'getHex' ),

		'test color from hsla with invalid alpha range value returns 6-HEX': colorTools.testColorConversion( 'hsla( 123, 0.5, 0.5, 200)', '#40BF46', 'getHex' ),

		'test color from 6-HEX returns valid RGB': colorTools.testColorConversion( '#FF00FF', 'rgb(255,0,255)', 'getRgb' ),

		'test color from 8-HEX returns valid RGBA': colorTools.testColorConversion( '#FF00FF00', 'rgba(255,0,255,0)', 'getRgba' ),

		'test color from 6-HEX returns valid hsl': colorTools.testColorConversion( '#00BFFF', 'hsl(195,100%,50%)', 'getHsl' ),

		'test color from 8-HEX returns valid hsla': colorTools.testColorConversion( '#00BFFF00','hsla(195,100%,50%,0)', 'getHsla' )

	} );

} )();
