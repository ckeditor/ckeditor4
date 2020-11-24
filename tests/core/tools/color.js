/* bender-tags: editor */


/**
 * Basic definitions
 * HEX 	 -> valid HEX Color Value with # value: #FFF or #FFFFFF
 * 3-HEX -> HEX but with only 3 characters value: #FFF
 * 6-HEX -> HEX but with exactly 6 characters value: #FFFFFF
 * 8-HEX -> HEX but with exactly 8 characters value: #FFFFFF00. Last two characters are for alpha
 */
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

		'test color from invalid string color name returns default color': function() {
			var notValidColorString = 'NotValidColorName';
			var expectedDefaultHexCode = '#000000';

			var colorObject = this.createColor( notValidColorString );

			var resultHex = colorObject.getHex();

			assert.areSame( expectedDefaultHexCode, resultHex );
		},

		'test color from 6-HEX lower-case string returns 6-HEX': function() {
			var hexCode = '#ffffff';
			var expectedHex = '#FFFFFF';
			var colorObject = this.createColor( hexCode );

			var resultHex = colorObject.getHex();

			assert.areSame( expectedHex, resultHex );
		},

		'test color from 3-HEX lower-case string returns 6-HEX': function() {
			var hexCode = '#fff';
			var expectedHexCode = '#FFFFFF';
			var colorObject = this.createColor( hexCode );

			var resultHex = colorObject.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from 8-HEX string color name returns HEX': function() {
			var validColorString = '#FF00FF00';
			var expectedHexCode = '#FFFFFF';

			var colorObject = this.createColor( validColorString );

			var resultHex = colorObject.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from 8-HEX string color name returns same 8-HEX': function() {
			var validColorString = '#FF00FF00';
			var expectedHexCode = '#FF00FF00';

			var colorObject = this.createColor( validColorString );

			var resultHex = colorObject.getHexAlpha();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from valid string color name returns HEX': function() {
			var validColorString = 'red';
			var expectedHexCode = '#FF0000';

			var colorObject = this.createColor( validColorString );

			var resultHex = colorObject.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from valid rgb string returns HEX': function() {
			var validRgbString = 'rgb( 40, 40, 150 )';
			var expectedHexCode  = '#282896';
			var colorObj = this.createColor( validRgbString );

			var resultHex = colorObj.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from outranged rgb value returns default HEX': function() {
			var validRgbString = 'rgb( 2940, 8840, 11150 )';
			var expectedHexCode  = '#000000';
			var colorObj = this.createColor( validRgbString );

			var resultHex = colorObj.getHex();

			assert.areSame( expectedHexCode, resultHex );

		},

		'test color from percentage rgb value returns HEX': function() {
			var validRgbString = 'rgb( 100%, 50%, 10% )';
			var expectedHexCode  = '#FF801A';
			var colorObj = this.createColor( validRgbString );

			var resultHex = colorObj.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from valid hsl string returns HEX': function() {
			var validRgbString = 'hsl( 195, 1, 0.5 )';//0-360 , 0-1, 0-1
			var expectedHexCode  = '#00BFFF';
			var colorObj = this.createColor( validRgbString );

			var resultHex = colorObj.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from outranged hsl string returns HEX': function() {
			var validRgbString = 'hsl( 999, 1882, 128 )';//0-360 , 0-1, 0-1
			var expectedHexCode  = '#FFFFFF';
			var colorObj = this.createColor( validRgbString );

			var resultHex = colorObj.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from percentage hsl string returns HEX': function() {
			var validRgbString = 'hsl( 195, 100%, 50% )';//0-360 , 0-1, 0-1
			var expectedHexCode  = '#00BFFF';
			var colorObj = this.createColor( validRgbString );

			var resultHex = colorObj.getHex();

			assert.areSame( expectedHexCode, resultHex );

		},

		'test color from valid rgba alpha 1 value returns HEX': function() {
			var validRgbString = 'rgba( 123, 123, 123, 1 )';
			var expectedHexCode  = '#7B7B7B';
			var colorObj = this.createColor( validRgbString );

			var resultHex = colorObj.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from valid rgba alpha 0.5 value returns HEX': function() {
			var validRgbString = 'rgba( 123, 123, 123, 0.5 )';
			var expectedHexCode  = '#BDBDBD';
			var colorObj = this.createColor( validRgbString );

			var resultHex = colorObj.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from valid rgba alpha 0 value returns HEX': function() {
			var validRgbString = 'rgba( 123, 123, 123, 0)';
			var expectedHexCode  = '#FFFFFF';
			var colorObj = this.createColor( validRgbString );

			var resultHex = colorObj.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from valid hsla alpha 1 value returns HEX': function() {
			var validRgbString = 'hsla( 123, 0.5, 0.5, 1 )';
			var expectedHexCode  = '#40BF46';
			var colorObj = this.createColor( validRgbString );

			var resultHex = colorObj.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from valid hsla alpha 0.5 value returns HEX': function() {
			var validRgbString = 'hsla( 123, 0.5, 0.5, 0.5 )';
			var expectedHexCode  = '#A0DFA3';
			var colorObj = this.createColor( validRgbString );

			var resultHex = colorObj.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from valid hsla alpha 0 value returns HEX': function() {
			var validRgbString = 'hsla( 123, 0.5, 0.5, 0)';
			var expectedHexCode  = '#FFFFFF';
			var colorObj = this.createColor( validRgbString );

			var resultHex = colorObj.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from hsla with invalid alpha range value returns HEX': function() {
			var validRgbString = 'hsla( 123, 0.5, 0.5, 200)';
			var expectedHexCode  = '#40BF46';
			var colorObj = this.createColor( validRgbString );

			var resultHex = colorObj.getHex();

			assert.areSame( expectedHexCode, resultHex );
		},

		'test color from HEX returns valid RGB': function() {
			var validHex = '#FF00FF';
			var expectedValidRgb = 'rgb(255,0,255)';
			var colorObj = this.createColor( validHex );

			var resultRgb = colorObj.getRgb();

			assert.areSame( expectedValidRgb, resultRgb );
		},

		'test color from HEX returns valid RGBA': function() {
			var validHex = '#FF00FF00';
			var expectedValidRgb = 'rgba(255,0,255,0)';
			var colorObj = this.createColor( validHex );

			var resultRgb = colorObj.getRgba();

			assert.areSame( expectedValidRgb, resultRgb );
		},

		'test color from HEX returns valid hsl': function() {
			var validHex = '#00BFFF';
			var expectedHsl = 'hsl(195,100%,50%)';
			var colorObj = this.createColor( validHex );

			var resultHsl = colorObj.getHsl();

			assert.areSame( expectedHsl, resultHsl );
		},

		'test color from HEX returns valid hsla': function() {
			var validHex = '#00BFFF00';
			var expectedHsl = 'hsla(195,100%,50%,0)';
			var colorObj = this.createColor( validHex );

			var resultHsl = colorObj.getHsla();

			assert.areSame( expectedHsl, resultHsl );
		}

	} );

} )();
