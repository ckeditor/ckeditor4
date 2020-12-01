/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines te {@link CKEDITOR.tools.color} normalizer class
 * that parse color string code other formats.
 */

( function() {
	'use strict';

	/**
	 * Class representing color. Provides conversion to various types like: hexadecimal, rgb, hsl.
	 * Support alpha value.
	 *
	 * 		var color = new CKEDITOR.tools.color( 'rgb( 225, 225, 225 )' ); // Create color instance.
	 * 		console.log( color.getHex() ); // #FFFFFF
	 *
	 * 		var color = new CKEDITOR.tools.color( 'red' ); // Create color instance.
	 * 		console.log( color.getHexAlpha() ); // #FF0000FF
	 *
	 *
	 * @since 4.16.0
	 * @class
	 */
	CKEDITOR.tools.color = CKEDITOR.tools.createClass( {

		/**
		 * Creates CKEDITOR.tools.color class instance.
		 *
		 * @constructor
		 * @param {string} colorCode
		 * @param {any} defaultValue Value returned if colorCode is invalid.
		 */
		$: function( colorCode, defaultValue ) {
			this._.originalColorCode = colorCode;
			this._.defaultValue = defaultValue;

			this._.parseInput( colorCode );
		},
		proto: {
			/**
			 * Get hexadecimal color blended with alpha.
			 *
			 * @returns {string/any} hexadecimal color code. Eg: `#FF00FF` or default value.
			 */
			getHex: function() {
				if ( this._.invalidCreation ) {
					return this._.defaultValue;
				}

				var values = this._.blendAlphaColor( this._.red, this._.green, this._.blue, this._.alpha );

				return formatHexString( values[0], values[1], values[2] );
			},
			/**
			 * Get hexadecimal color with alpha value.
			 *
			 * @returns {string/any} hexadecimal color code. Eg: `#FF00FF00` or default value.
			 */
			getHexAlpha: function() {
				if ( this._.invalidCreation ) {
					return this._.defaultValue;
				}

				return formatHexString( this._.red, this._.green, this._.blue, this._.alpha );
			},
			/**
			 * Get rgb color blended with alpha.
			 *
			 * Each color ranged in 0-255.
			 *
			 * @returns {string/any} rgb color. Eg. `rgb(255,255,255)` or default value.
			 */
			getRgb: function() {
				if ( this._.invalidCreation ) {
					return this._.defaultValue;
				}

				var decimalColorValues = this._.blendAlphaColor( this._.red, this._.green, this._.blue, this._.alpha );

				return formatRgbString( 'rgb', decimalColorValues );
			},
			/**
			 * Get rgb color with alpha value.
			 *
			 * Each color ranged in 0-255.
			 * Alpha ranged in 0-1.
			 *
			 * @returns {string/any} rgba color. Eg. `rgba(255,255,255,0)` or default value.
			 */
			getRgba: function() {
				if ( this._.invalidCreation ) {
					return this._.defaultValue;
				}

				var decimalValues = [ this._.red, this._.green, this._.blue, this._.alpha ];

				return formatRgbString( 'rgba', decimalValues );
			},
			/**
			 * Get hsl color blended with alpha.
			 *
			 * Hue ranged in 0-360.
			 * Saturation, Lightness ranged in 0-100%.
			 *
			 * @returns {string/any} hsl color. Eg. `hsl(360, 100%, 50%)` or default value.
			 *
			 */
			getHsl: function() {
				if ( this._.invalidCreation ) {
					return this._.defaultValue;
				}

				var rgb = this._.blendAlphaColor( this._.red, this._.green, this._.blue, this._.alpha );

				var hsl = this._.rgbToHsl( rgb[0],rgb[1], rgb[2] );

				return formatHslString( 'hsl', hsl );
			},
			/**
			 * Get hsla color with alpha value.
			 *
			 * Hue ranged in 0-360.
			 * Saturation, Lightness ranged in 0-100%.
			 * Alpha ranged in 0-1.
			 *
			 * @returns {string/any} hsla color. Eg. `hsla(360, 100%, 50%, 0)` or default value.
			 */
			getHsla: function() {
				if ( this._.invalidCreation ) {
					return this._.defaultValue;
				}

				var hsl = this._.rgbToHsl( this._.red, this._.green, this._.blue );
				hsl.push( this._.alpha );

				return formatHslString( 'hsla', hsl );
			},
			/**
			 * Get original value used to create object
			 *
			 * @returns {Object} Any value used in constructor
			 */
			getOriginalValue: function() {
				return this._.originalColorCode;
			}
		},
		_: {
			/**
			 * Original color code provided to create object.
			 *
			 * @private
			 * @property {string}
			 */
			originalColorCode: '',
			/**
			 * Flag indicated invalid constructor input
			 *
			 * @private
			 * @property {boolean}
			 */
			invalidCreation: false,
			/**
			 * Alpha value extracted from constructor input.
			 * Held separated due to conversions.
			 * Ranged in 0-1.
			 *
			 * @private
			 * @property {Number}
			 */
			alpha: 1,
			/**
			 * Red channel
			 * Ranged in 0-255.
			 *
			 * @private
			 * @property {Number}
			 */
			red: 0,
			/**
			 * Green channel
			 * Ranged in 0-255.
			 *
			 * @private
			 * @property {Number}
			 */
			green: 0,
			/**
			 * Blue channel
			 * Ranged in 0-255.
			 *
			 * @private
			 * @property {Number}
			 */
			blue: 0,
			parseInput: function( colorCode ) {
				if ( typeof colorCode !== 'string' ) {
					this._.invalidCreation = true;
					return;
				}

				colorCode = colorCode.trim();

				var rgbaFromNamed = this._.matchStringToNamedColor( colorCode );
				var	rgbaFromHex = this._.matchStringToHex( colorCode );
				var rgbaFromRgbOrHsl = this._.rgbOrHslToHex( colorCode );

				var rgba = rgbaFromNamed || rgbaFromHex || rgbaFromRgbOrHsl;

				if ( rgba ) {
					this._.red = rgba[0];
					this._.green = rgba[1];
					this._.blue = rgba[2];
					this._.alpha = rgba[3];
				} else {
					this._.invalidCreation = true;
				}
			},
			/**
	 		 * Blend alpha into color. Assumes that background is white.
			 *
			 * @private
			 * @param {Number} red Number of red channel.
			 * @param {Number} green Number of green channel.
			 * @param {Number} blue Number of blue channel.
			 * @param {Number} alpha Alpha value.
			 * @returns {Array} Input rgb color mixed with alpha.
			 */
			blendAlphaColor: function( red, green, blue, alpha ) {
				var rgb = [ red, green, blue ];
				// Based on https://en.wikipedia.org/wiki/Alpha_compositing
				return CKEDITOR.tools.array.map( rgb, function( color ) {
					return Math.round( 255 - alpha * ( 255 - color ) );
				} );
			},
			/**
			 * Normalize rgb values into 0-255 range.
			 *
			 * @private
			 * @param {Number} red Number of red channel.
			 * @param {Number} green Number of green channel.
			 * @param {Number} blue Number of blue channel.
			 * @returns {Array} Rgb Array of normalized values.
			 */
			normalizeRgbValues: function( red, green, blue ) {
				function normalizer( number ) {
					if ( isPercentValue( number ) ) {
						number = convertPercentValueToNumber( number );
						number = Math.round( 255 * normalizePercentValue( number ) );
					} else {
						number = Number( number );
						number = number > 255 ? 0 :
							number < 0 ? 255 : number;
					}
					return number;
				}
				red = normalizer( red );
				green = normalizer( green );
				blue = normalizer( blue );

				return [ red, green, blue ];
			},
			/**
	 		 * Extract red, green, blue from hexadecimal color code.
			 *
			 * @private
			 * @param {string} hexColorCode hexadecimal color code with leading #
			 * @returns {Array} rgb decimal values.
			 */
			hexToRgb: function( hexColorCode ) {
				var colorValues = hexColorCode.slice( 1 ).match( /.{2}/ig );
				return CKEDITOR.tools.array.map( colorValues, function( color ) {
					return parseInt( color, 16 );
				} );
			},
			/**
			 * Convert rgb color values to hsl color values.
			 *
			 * @private
			 * @param {Number} red Number of red channel.
			 * @param {Number} green Number of green channel.
			 * @param {Number} blue Number of blue channel.
			 * @returns {Array} Array of hsl values.
			 */
			rgbToHsl: function( red, green, blue ) {
				//Based on https://en.wikipedia.org/wiki/HSL_and_HSV#General_approach
				var r = red / 255,
					g = green / 255,
					b = blue / 255;

				var Max = Math.max( r, g, b ),
					min = Math.min( r, g, b ),
					Chroma = Max - min;

				var calculateHueFactor = function() {
					switch ( Max ) {
						case r:
							return ( ( g - b ) / Chroma ) % 6;
						case g:
							return ( ( b - r ) / Chroma ) + 2;
						case b:
							return ( ( r - g ) / Chroma ) + 4;
					}
				};

				var hFactor = calculateHueFactor();
				var hue = Chroma === 0 ? 0 : 60 * hFactor;

				var light = ( Max + min ) / 2;

				var saturation = 1;
				if ( light === 1 || light === 0 ) {
					saturation = 0;
				} else {
					saturation = Chroma / ( 1 - Math.abs( ( 2 * light ) - 1 ) );
				}

				hue = Math.round( hue );
				saturation = Math.round( saturation ) * 100;
				light = light * 100;

				var hsl = [ hue, saturation, light ];
				return hsl;
			},
			/**
			 * Convert hsl values into rgb.
			 *
			 * @private
			 * @param {Number} hue
			 * @param {Number} saturation
			 * @param {Number} lightness
			 * @returns {Array} Array of decimal rgb values.
			 */
			hslToRgb: function( hue, saturation, lightness ) {
				//Based on https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
				hue = clampValueInRange( Number( hue ), 0, 360 ),
				saturation = normalizePercentValue( saturation ),
				lightness = normalizePercentValue( lightness );

				var calculateValueFromConst = function( fixValue ) {
					var k = ( fixValue + ( hue / 30 ) ) % 12,
						a = saturation * Math.min( lightness, 1 - lightness );

					var min = Math.min( k - 3, 9 - k, 1 ),
						max = Math.max( -1, min ),
						normalizedValue = lightness - ( a * max );

					return Math.round( normalizedValue * 255 );
				};

				var rgb = [ calculateValueFromConst( 0 ), calculateValueFromConst( 8 ), calculateValueFromConst( 4 ) ];
				return rgb;
			},
			/**
			 * Get hexadecimal color from named colors.
			 *
			 * @private
			 * @param {string} colorName color name. Eg. `red`.
			 * @returns {Array/null} Array of rgba values or `null`.
			 */
			matchStringToNamedColor: function( colorName ) {
				var colorToHexObject = CKEDITOR.tools.color.namedColors;
				var resultCode = colorToHexObject[ colorName.toLowerCase() ] || null;

				//push default alpha
				if ( resultCode ) {
					resultCode = this._.hexToRgb( resultCode );
					resultCode.push( 1 );
					return resultCode;
				} else {
					return null;
				}
			},
			/**
			 * Try to convert hexadecimal color code to exactly six characters long hexadecimal color.
			 * Extract alpha or takes `1` as default alpha value.
			 *
			 * @private
			 * @param {string} hexColorCode valid hexadecimal color. Eg. `#F0F`, `#FF00FF` or `#FF00FF00`.
			 * @returns {Array/null} Array of rgba values or `null`.
			 */
			matchStringToHex: function( hexColorCode ) {
				var finalHex = null;
				var initAlpha = 1;

				if ( hexColorCode.match( CKEDITOR.tools.color.hex3charsRegExp ) ) {
					finalHex = this._.hex3ToHex6( hexColorCode );
				}

				if ( hexColorCode.match( CKEDITOR.tools.color.hex6charsRegExp ) ) {
					finalHex = hexColorCode;
				}

				if ( hexColorCode.match( CKEDITOR.tools.color.hex8charsRegExp ) ) {
					var firstAlphaCharIndex = 7;

					finalHex = hexColorCode.slice( 0, firstAlphaCharIndex );
					initAlpha =  normalizePercentValue( hexColorCode.slice( firstAlphaCharIndex ) );
				}

				var rgba = null;

				if ( finalHex ) {
					rgba = this._.hexToRgb( finalHex );
					rgba.push( initAlpha );
				}

				return rgba;
			},
			/**
			 * Convert hexadecimal color three characters long to six characters long.
			 *
			 * @private
			 * @param {string} hex3ColorCode hexadecimal color, three characters long. Eg. `#F0F`.
			 * @returns {string} hexadecimal color value. Eg. `#FF00FF`.
			 */
			hex3ToHex6: function( hex3ColorCode ) {
				return hex3ColorCode.replace( CKEDITOR.tools.color.hex3charsRegExp, function( match, hexColor ) {
					var normalizedHexColor = hexColor.toLowerCase();

					var parts = normalizedHexColor.split( '' );
					normalizedHexColor = [ parts[ 0 ], parts[ 0 ], parts[ 1 ], parts[ 1 ], parts[ 2 ], parts[ 2 ] ].join( '' );

					return '#' + normalizedHexColor;
				} );
			},
			/**
			 * Convert rgb, rgba, hsl or hsla color code into hexadecimal color with alpha extraction.
			 *
			 * @private
			 * @param {string} colorCode rgb, rgba, hsl or hsla color code. Eg. `rgb(255,255,255)` or `hsla(360, 10%, 5%, 0)`
			 * @returns {string/null} hexadecimal color value. Eg. `#FF0000` or null.
			 */
			rgbOrHslToHex: function( colorCode ) {
				var colorFormat = colorCode.slice( 0, 3 ).toLowerCase();

				if ( colorFormat !== 'rgb' && colorFormat !== 'hsl' ) {
					return null;
				}

				var colorNumberValues = colorCode.match( /\d+\.?\d*%*/g );
				if ( !colorNumberValues ) {
					return null;
				}

				var alpha = 1;
				if ( colorNumberValues.length === 4 ) {
					alpha = normalizePercentValue( colorNumberValues.pop() );
				}

				if ( colorFormat === 'hsl' ) {
					colorNumberValues = this._.hslToRgb( colorNumberValues[0], colorNumberValues[1], colorNumberValues[2] );
				} else {
					colorNumberValues = this._.normalizeRgbValues( colorNumberValues[0], colorNumberValues[1], colorNumberValues[2] );
				}

				//add alpha
				colorNumberValues.push( alpha );

				return colorNumberValues;
			}
		},
		statics: {
			/**
			 * Regular expression to match three characters long hexadecimal color value.
			 *
			 * @private
			 * @static
			 * @property {RegExp}
			 */
			hex3charsRegExp: /#([0-9a-f]{3}$)/gim,
			/**
			 * Regular expression to match six characters long hexadecimal color value.
			 *
			 * @private
			 * @static
			 * @property {RegExp}
			 */
			hex6charsRegExp: /#([0-9a-f]{6}$)/gim,
			/**
			 * Regular expression to match eight characters long hexadecimal color value.
			 *
			 * @private
			 * @statice
			 * @property {RegExp}
			 */
			hex8charsRegExp: /#([0-9a-f]{8}$)/gim,

			/** Color list based on [W3.org](https://www.w3.org/TR/css-color-4/#named-colors).
			 *
			 * @static
			 * @member CKEDITOR.tools.color
			 * @property {Object}
			 */
			namedColors: {
				aliceblue: '#F0F8FF',
				antiquewhite: '#FAEBD7',
				aqua: '#00FFFF',
				aquamarine: '#7FFFD4',
				azure: '#F0FFFF',
				beige: '#F5F5DC',
				bisque: '#FFE4C4',
				black: '#000000',
				blanchedalmond: '#FFEBCD',
				blue: '#0000FF',
				blueviolet: '#8A2BE2',
				brown: '#A52A2A',
				burlywood: '#DEB887',
				cadetblue: '#5F9EA0',
				chartreuse: '#7FFF00',
				chocolate: '#D2691E',
				coral: '#FF7F50',
				cornflowerblue: '#6495ED',
				cornsilk: '#FFF8DC',
				crimson: '#DC143C',
				cyan: '#00FFFF',
				darkblue: '#00008B',
				darkcyan: '#008B8B',
				darkgoldenrod: '#B8860B',
				darkgray: '#A9A9A9',
				darkgreen: '#006400',
				darkgrey: '#A9A9A9',
				darkkhaki: '#BDB76B',
				darkmagenta: '#8B008B',
				darkolivegreen: '#556B2F',
				darkorange: '#FF8C00',
				darkorchid: '#9932CC',
				darkred: '#8B0000',
				darksalmon: '#E9967A',
				darkseagreen: '#8FBC8F',
				darkslateblue: '#483D8B',
				darkslategray: '#2F4F4F',
				darkslategrey: '#2F4F4F',
				darkturquoise: '#00CED1',
				darkviolet: '#9400D3',
				deeppink: '#FF1493',
				deepskyblue: '#00BFFF',
				dimgray: '#696969',
				dimgrey: '#696969',
				dodgerblue: '#1E90FF',
				firebrick: '#B22222',
				floralwhite: '#FFFAF0',
				forestgreen: '#228B22',
				fuchsia: '#FF00FF',
				gainsboro: '#DCDCDC',
				ghostwhite: '#F8F8FF',
				gold: '#FFD700',
				goldenrod: '#DAA520',
				gray: '#808080',
				green: '#008000',
				greenyellow: '#ADFF2F',
				grey: '#808080',
				honeydew: '#F0FFF0',
				hotpink: '#FF69B4',
				indianred: '#CD5C5C',
				indigo: '#4B0082',
				ivory: '#FFFFF0',
				khaki: '#F0E68C',
				lavender: '#E6E6FA',
				lavenderblush: '#FFF0F5',
				lawngreen: '#7CFC00',
				lemonchiffon: '#FFFACD',
				lightblue: '#ADD8E6',
				lightcoral: '#F08080',
				lightcyan: '#E0FFFF',
				lightgoldenrodyellow: '#FAFAD2',
				lightgray: '#D3D3D3',
				lightgreen: '#90EE90',
				lightgrey: '#D3D3D3',
				lightpink: '#FFB6C1',
				lightsalmon: '#FFA07A',
				lightseagreen: '#20B2AA',
				lightskyblue: '#87CEFA',
				lightslategray: '#778899',
				lightslategrey: '#778899',
				lightsteelblue: '#B0C4DE',
				lightyellow: '#FFFFE0',
				lime: '#00FF00',
				limegreen: '#32CD32',
				linen: '#FAF0E6',
				magenta: '#FF00FF',
				maroon: '#800000',
				mediumaquamarine: '#66CDAA',
				mediumblue: '#0000CD',
				mediumorchid: '#BA55D3',
				mediumpurple: '#9370DB',
				mediumseagreen: '#3CB371',
				mediumslateblue: '#7B68EE',
				mediumspringgreen: '#00FA9A',
				mediumturquoise: '#48D1CC',
				mediumvioletred: '#C71585',
				midnightblue: '#191970',
				mintcream: '#F5FFFA',
				mistyrose: '#FFE4E1',
				moccasin: '#FFE4B5',
				navajowhite: '#FFDEAD',
				navy: '#000080',
				oldlace: '#FDF5E6',
				olive: '#808000',
				olivedrab: '#6B8E23',
				orange: '#FFA500',
				orangered: '#FF4500',
				orchid: '#DA70D6',
				palegoldenrod: '#EEE8AA',
				palegreen: '#98FB98',
				paleturquoise: '#AFEEEE',
				palevioletred: '#DB7093',
				papayawhip: '#FFEFD5',
				peachpuff: '#FFDAB9',
				peru: '#CD853F',
				pink: '#FFC0CB',
				plum: '#DDA0DD',
				powderblue: '#B0E0E6',
				purple: '#800080',
				rebeccapurple: '#663399',
				red: '#FF0000',
				rosybrown: '#BC8F8F',
				royalblue: '#4169E1',
				saddlebrown: '#8B4513',
				salmon: '#FA8072',
				sandybrown: '#F4A460',
				seagreen: '#2E8B57',
				seashell: '#FFF5EE',
				sienna: '#A0522D',
				silver: '#C0C0C0',
				skyblue: '#87CEEB',
				slateblue: '#6A5ACD',
				slategray: '#708090',
				slategrey: '#708090',
				snow: '#FFFAFA',
				springgreen: '#00FF7F',
				steelblue: '#4682B4',
				tan: '#D2B48C',
				teal: '#008080',
				thistle: '#D8BFD8',
				tomato: '#FF6347',
				turquoise: '#40E0D0',
				violet: '#EE82EE',
				windowtext: 'windowtext',
				wheat: '#F5DEB3',
				white: '#FFFFFF',
				whitesmoke: '#F5F5F5',
				yellow: '#FFFF00',
				yellowgreen: '#9ACD32'
			}
		}
	} );

	/**
	 * Color list based on https://www.w3.org/TR/css-color-4/#named-colors.
	 * @member CKEDITOR.tools.style.parse
	 *
	 * @private
	 * @deprecated
	 */
	CKEDITOR.tools.style.parse._colors = CKEDITOR.tools.color.namedColors;

	function clampValueInRange( value, min, max ) {
		return Math.min( Math.max( value, min ), max );
	}

	// Convert value into Number ranged in 0-100.
	// @param {string/Number} value.
	function normalizePercentValue( value ) {
		if ( isPercentValue( value ) ) {
			value = convertPercentValueToNumber( value );
		}

		if ( Math.abs( value ) > 1 ) {
			value =  value / 100;
		}

		return clampValueInRange( value, 0, 1 );
	}

	// Validate if given value is string type and ends with `%` character.
	// @param {*} value any value.
	// @returns {boolean}
	function isPercentValue( value ) {
		return typeof value === 'string' && value.slice( -1 ) === '%';
	}

	// Remove `%` character and convert value to Number.
	// @param {string} value Percent value. Eg. `100%`
	// @returns {Number} value as a Number.
	function convertPercentValueToNumber( value ) {
		return Number( value.slice( 0, -1 ) );
	}

	// Convert given value as hexadecimal based.
	// @param {*} value value to convert.
	// @returns {string} hexadecimal value.
	function valueToHex( value ) {
		var hex = value.toString( 16 );

		return hex.length == 1 ? '0' + hex : hex;
	}

	//Format rgb to hex
	function formatHexString( red, green, blue, alpha ) {
		var hexColorCode = '#' + valueToHex( red ) + valueToHex( green ) + valueToHex( blue );

		if ( alpha !== undefined ) {
			hexColorCode += valueToHex( alpha );
		}

		return hexColorCode.toUpperCase();
	}


	// Convert color values into formatted rgb or rgba color code.
	// @param {string} rgbPrefix Prefix for color value. Expected: `rgb` or `rgba`.
	// @param {Array} values Array of color values.
	// @returns {string} Formatted color value. Eg. `rgb(255,255,255)`
	function formatRgbString( rgbPrefix, values ) {
		return rgbPrefix + '(' + values.join( ',' ) + ')';
	}

	// Convert color values into formatted hsl or hsla color code.
	// @private
	// @param {string} hslPrefix Prefix for color value. Expected `hsl` or `hsla`.
	// @param {Array} hsl Array of hsl or hsla color values.
	// @returns {string} Formatted color value. Eg. `hsl(360, 50%, 50%)`
	function formatHslString( hslPrefix, hsl ) {
		var alphaString = hsl[3] !== undefined ? ',' + hsl[3] : '';

		return hslPrefix + '(' +
		hsl[0] + ',' +
		hsl[1] + '%,' +
		hsl[2] + '%' +
		alphaString +
		')';
	}

} )();
