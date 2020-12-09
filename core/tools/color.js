/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines te {@link CKEDITOR.tools.color} class for handling different color formats.
 */

( function() {
	'use strict';

	/**
	 * Class representing a color. Provides conversion between various color formats:
	 *
	 * * Named colors.
	 * * Hexadecimal format (with alpha support).
	 * * RGB and RGBA formats.
	 * * HSL and HSLA formats.
	 *
	 * It can be used to validate and convert color between above formats:
	 *
	 * ```javascript
	 * var color = new CKEDITOR.tools.color( 'rgb( 225, 225, 225 )' );
	 * console.log( color.getHex() ); // #FFFFFF
	 *
	 * var color = new CKEDITOR.tools.color( 'red' );
	 * console.log( color.getHexWithAlpha() ); // #FF0000FF
	 * ```
	 * @since 4.16.0
	 * @class
	 */
	CKEDITOR.tools.color = CKEDITOR.tools.createClass( {

		/**
		 * Creates CKEDITOR.tools.color class instance.
		 *
		 * @constructor
		 * @param {String} colorCode
		 * @param {*} defaultValue Value which will be returned by any getter if passed color is not valid.
		 */
		$: function( colorCode, defaultValue ) {
			this._.initialColorCode = colorCode;
			this._.defaultValue = defaultValue;

			this._.parseInput( colorCode );
		},

		proto: {
			/**
			 * Get hexadecimal color representation.
			 *
			 * @returns {String/*} Hexadecimal color code (e.g. `#FF00FF`) or default value.
			 */
			getHex: function() {
				var color = blendAlphaColor( this._.red, this._.green, this._.blue, this._.alpha );

				return this._.isValidColor ?
					formatHexString( color[ 0 ], color[ 1 ], color[ 2 ] ) :
					this._.defaultValue;
			},

			/**
			 * Get hexadecimal color representation with separate alpha channel.
			 *
			 * @returns {String/*} Hexadecimal color code (e.g. `#FF00FF00`) or default value.
			 */
			getHexWithAlpha: function() {
				if ( !this._.isValidColor ) {
					return this._.defaultValue;
				}

				var alpha = Math.round( this._.alpha * CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE );
				return formatHexString( this._.red, this._.green, this._.blue, alpha ) ;
			},

			/**
			 * Get RGB color representation.
			 *
			 * @returns {String/*} RGB color representation (e.g. `rgb(255,255,255)`) or default value.
			 */
			getRgb: function() {
				var color = blendAlphaColor( this._.red, this._.green, this._.blue, this._.alpha );

				return this._.isValidColor ?
					formatRgbString( 'rgb', color[ 0 ], color[ 1 ], color[ 2 ]  ) :
					this._.defaultValue;
			},

			/**
			 * Get RGBA color representation.
			 *
			 * @returns {String/*} RGBA color representation (e.g. `rgba(255,255,255,0)`) or default value.
			 */
			getRgba: function() {
				return this._.isValidColor ?
					formatRgbString( 'rgba', this._.red, this._.green, this._.blue, this._.alpha ) :
					this._.defaultValue;
			},

			/**
			 * Get HSL color representation.
			 *
			 * @returns {String/*} HSL color representation (e.g. `hsl(360, 100%, 50%)`) or default value.
			 *
			 */
			getHsl: function() {
				var color = blendAlphaColor( this._.red, this._.green, this._.blue, this._.alpha );

				if ( this._.isValidColor ) {
					var hsl = this._.rgbToHsl( color[ 0 ], color[ 1 ], color[ 2 ] );
					return formatHslString( 'hsl', hsl[ 0 ], hsl[ 1 ], hsl[ 2 ] );
				} else {
					return this._.defaultValue;
				}
			},

			/**
			 * Get HSLA color representation.
			 *
			 * @returns {String/*} HSLA color representation (e.g. `hsla(360, 100%, 50%, 0)`) or default value.
			 */
			getHsla: function() {
				var hsl = this._.rgbToHsl( this._.red, this._.green, this._.blue );

				return this._.isValidColor ?
					formatHslString( 'hsla', hsl[ 0 ], hsl[ 1 ], hsl[ 2 ], this._.alpha ) :
					this._.defaultValue;
			},

			/**
			 * Get raw value passed to the constructor during color object creation.
			 *
			 * @returns {String} Raw value passed during color object creation.
			 */
			getInitialValue: function() {
				return this._.initialColorCode;
			}
		},

		_: {
			/**
			 * Initial color code provided to create object.
			 *
			 * @private
			 * @property {String}
			 */
			initialColorCode: '',

			/**
			 * Whether valid color input was passed.
			 *
			 * @private
			 * @property {Boolean}
			 */
			isValidColor: true,

			/**
			 * Red channel value. Ranges in 0-255.
			 *
			 * @private
			 * @property {Number}
			 */
			red: 0,

			/**
			 * Green channel value. Ranges in 0-255.
			 *
			 * @private
			 * @property {Number}
			 */
			green: 0,

			/**
			 * Blue channel value. Ranges in 0-255.
			 *
			 * @private
			 * @property {Number}
			 */
			blue: 0,

			/**
			 * Alpha channel value. Ranges in 0-1.
			 *
			 * @private
			 * @property {Number}
			 */
			alpha: 1,

			/**
			 * Parses color string trying to match it to any supported format and extract RGBA channels.
			 *
			 * @private
			 * @param {String} colorCode Color to parse.
			 */
			parseInput: function( colorCode ) {
				if ( typeof colorCode !== 'string' ) {
					this._.isValidColor = false;
					return;
				}

				colorCode = colorCode.trim();

				// Check if named color was passed and get its HEX representation.
				var hexFromNamedColor = this._.matchStringToNamedColor( colorCode );
				if ( hexFromNamedColor ) {
					colorCode = hexFromNamedColor;
				}

				var colorChannelsFromHex = this._.extractColorChannelsFromHex( colorCode ),
					colorChannelsFromRgba = this._.extractColorChannelsFromRgba( colorCode ),
					colorChannelsFromHsla = this._.extractColorChannelsFromHsla( colorCode );

				var colorChannels = colorChannelsFromHex || colorChannelsFromRgba || colorChannelsFromHsla;

				if ( !colorChannels ) {
					this._.isValidColor = false;
					return;
				}

				this._.red = colorChannels[ 0 ];
				this._.green = colorChannels[ 1 ];
				this._.blue = colorChannels[ 2 ];
				this._.alpha = colorChannels[ 3 ];
			},

			/**
			 * Get hexadecimal color value based on color name.
			 *
			 * @private
			 * @param {String} colorName color name, e.g. `red`.
			 * @returns {String/null} Hexadecimal color representation or `null` if such named color does not exists.
			 */
			matchStringToNamedColor: function( colorName ) {
				return CKEDITOR.tools.color.namedColors[ colorName.toLowerCase() ] || null;
			},

			/**
			 * Extracts RGBA channels from given HEX string.
			 *
			 * @private
			 * @param {String} colorCode HEX color representation.
			 */
			extractColorChannelsFromHex: function( colorCode ) {
				if ( colorCode.match( CKEDITOR.tools.color.hex3CharsRegExp ) ) {
					colorCode = this._.hex3ToHex6( colorCode );
				}

				if ( colorCode.match( CKEDITOR.tools.color.hex6CharsRegExp ) || colorCode.match( CKEDITOR.tools.color.hex8CharsRegExp ) ) {
					var parts = colorCode.split( '' );

					var alpha = 1;

					if ( parts[ 7 ] && parts[ 8 ] ) {
						alpha = hexToValue( parts[ 7 ] + parts[ 8 ] );

						alpha = ( alpha / CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE );
						alpha = alpha < 1 && alpha > 0 ? alpha.toFixed( 1 ) : alpha;
					}

					return [
						hexToValue( parts[ 1 ] + parts[ 2 ] ),
						hexToValue( parts[ 3 ] + parts[ 4 ] ),
						hexToValue( parts[ 5 ] + parts [ 6 ] ),
						alpha
					];
				}

				return null;
			},

			/**
			 * Extracts RGBA channels from given RGBA string.
			 *
			 * @private
			 * @param {String} colorCode RGB or RGBA color representation.
			 */
			extractColorChannelsFromRgba: function( colorCode ) {
				var rgbMatch =  this._.extractDigitsFromPattern( colorCode, CKEDITOR.tools.color.rgbRegExp, this._.validateRgbValues );
				return rgbMatch;
			},

			/**
			 * Validate given array as RGBA values.
			 * Returns array with valid channel values or nulls.
			 *
			 * @param {Array} values
			 * @returns {Array}
			 */
			validateRgbValues: function( values ) {
				var red = this._.validateRgbChannelValue( values[ 0 ] );
				var green = this._.validateRgbChannelValue( values[ 1 ] );
				var blue = this._.validateRgbChannelValue( values[ 2 ] );
				var alpha = this._.validateAlphaValue( values[ 3 ] );

				var rgb = [ red, green, blue, alpha ];

				return rgb;
			},

			/**
			 * Validate given value as alpha value.
			 *
			 * Ranged [0.0, 1.0] or [0, 100]%
			 *
			 * @param {String} value
			 */
			validateAlphaValue: function( value ) {
				var alpha = 1;
				if ( value !== undefined ) {
					alpha = this._.isValidPercentOrNormalizedPercent( value );
				}

				return alpha;
			},

			/**
			 * Validate given value if it's proper RGB channel value
			 *
			 * Ranged [0, 255] or [0, 100]%
			 *
			 * @param {String} value Channel value
			 */
			validateRgbChannelValue: function( value ) {
				var percentValue = null,
					rangedValue = null;

				if ( isPercentValue( value ) ) {
					percentValue = this._.validatePercent( value );
					if ( percentValue !== null ) {
						percentValue = CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE * ( percentValue / 100 );
					}
				} else {
					rangedValue = this._.validateValueInRange( value, 0, 255 );
				}

				return percentValue || rangedValue;
			},

			/**
			 * Extract RGBA channels from given HSLA string.
			 *
			 * @private
			 * @param {String} colorCode HSL or HSLA color representation.
			 */
			extractColorChannelsFromHsla: function( colorCode ) {
				var hslaMatch =  this._.extractDigitsFromPattern( colorCode, CKEDITOR.tools.color.hslRegExp, this._.validateHslValues );

				if ( hslaMatch ) {
					var rgb = this._.hslToRgb( hslaMatch[ 0 ], hslaMatch[ 1 ], hslaMatch[ 2 ] );
					if ( hslaMatch[ 3 ] !== undefined ) {
						rgb.push( hslaMatch[ 3 ] );
					}
					return rgb;
				}

				return null;
			},

			/**
			 * Validate if given values are proper as HSLA values.
			 *
			 * Hue: [0, 360]
			 * Saturation: [0.0, 1.0] or [0, 100]%
			 * Lightness: [0.0, 1.0] or [0, 100]%
			 *
			 * @param {Array} values
			 * @returns {Array/null}
			 */
			validateHslValues: function( values ) {
				var hue = this._.validateValueInRange( values[ 0 ], 0, 360 );
				var saturation = this._.isValidPercentOrNormalizedPercent( values[ 1 ] );
				var lightness = this._.isValidPercentOrNormalizedPercent( values[ 2 ] );
				var alpha = this._.validateAlphaValue( values[ 3 ] );

				var hsl = [ hue, saturation, lightness, alpha ];

				return hsl;
			},

			/**
			 * Validate if value is percent or normalize percent
			 *
			 * @private
			 * @param {String} value
			 */
			isValidPercentOrNormalizedPercent: function( value ) {
				var percentValue = null,
					rangedValue = null;

				if ( isPercentValue( value ) ) {
					percentValue = this._.validatePercent( value );
					if ( percentValue !== null ) {
						percentValue /= 100;
					}
				} else {
					rangedValue = this._.validateValueInRange( value, 0.0, 1.0 );
				}

				return percentValue || rangedValue;
			},

			/**
			 * Validate if value is Number in given range.
			 *
			 * @param {String} value
			 * @param {Number} min
			 * @param {Number} max
			 */
			validateValueInRange: function( value, min, max ) {
				value = parseFloat( value );
				if ( isNaN( value ) || value < min || value > max ) {
					return null;
				}

				return value;
			},

			/**
			 * Validate if given string is percent value in [0, 100] range.
			 *
			 * @private
			 * @param {String} value
			 * @returns {Number/null}
			 */
			validatePercent: function( value ) {
				if ( !isPercentValue( value ) ) {
					return null;
				}
				// [0, 100]
				value = convertPercentValueToNumber( value );
				if ( isNaN( value ) || value < 0 || value > 100 ) {
					return null;
				}
				return value;
			},

			/**
			 * Validate values extracted based on given regular expression pattern.
			 *
			 * @private
			 * @param {String} value String tested with pattern.
			 * @param {RegExp} regExp Regular expression pattern.
			 * @param {Function} validationStrategy Function to test values after extract from pattern.
			 * @returns {Array/null} Array with extracted values or null if values doesn't pass validation.
			 */
			extractDigitsFromPattern: function( value, regExp, validationStrategy ) {
				var match = value.match( regExp );
				if ( !match ) {
					return null;
				}

				var prefix = match[ 1 ];
				var values = match[ 2 ].split( ',' );

				values = CKEDITOR.tools.array.map( values, function( value ) {
					return value.trim();
				} );

				var shouldIncludeAlpha = prefix.slice( -1 ) === 'a';
				var hasValidAmountOfValues = shouldIncludeAlpha ? values.length === 4 : values.length === 3;

				if ( !hasValidAmountOfValues ) {
					return null;
				}

				var numbers = validationStrategy.call( this, values );

				if ( numbers.indexOf( null ) > -1 ) {
					return null;
				} else {
					return numbers;
				}
			},

			/**
			 * Convert 3-characters hexadecimal color format to 6-characters one.
			 *
			 * @private
			 * @param {String} hex3ColorCode 3-characters hexadecimal color, e.g. `#F0F`.
			 * @returns {String} 6-characters hexadecimal color e.g. `#FF00FF`.
			 */
			hex3ToHex6: function( hex3ColorCode ) {
				var parts = hex3ColorCode.split( '' );

				return '#' + parts[ 1 ] + parts[ 1 ] + parts[ 2 ] + parts[ 2 ] + parts[ 3 ] + parts[ 3 ];
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
				var r = red / CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE,
					g = green / CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE,
					b = blue / CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE;

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
				var calculateValueFromConst = function( fixValue ) {
					var k = ( fixValue + ( hue / 30 ) ) % 12,
						a = saturation * Math.min( lightness, 1 - lightness );

					var min = Math.min( k - 3, 9 - k, 1 ),
						max = Math.max( -1, min ),
						normalizedValue = lightness - ( a * max );

					return Math.round( normalizedValue * CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE );
				};

				var rgb = [ calculateValueFromConst( 0 ), calculateValueFromConst( 8 ), calculateValueFromConst( 4 ) ];
				return rgb;
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
			hex3CharsRegExp: /#([0-9a-f]{3}$)/gim,

			/**
			 * Regular expression to match six characters long hexadecimal color value.
			 *
			 * @private
			 * @static
			 * @property {RegExp}
			 */
			hex6CharsRegExp: /#([0-9a-f]{6}$)/gim,

			/**
			 * Regular expression to match eight characters long hexadecimal color value.
			 *
			 * @private
			 * @static
			 * @property {RegExp}
			 */
			hex8CharsRegExp: /#([0-9a-f]{8}$)/gim,

			/**
			 * Regular expression to extract numbers from rgba color value.
			 *
			 * @private
			 * @static
			 * @property {RegExp}
			 */
			rgbRegExp: /(rgb[a]?)\(([.,\d\s%]*)\)/i,

			/**
			 * Regular expression to match potentially valid hsl / hsla color value.
			 *
			 * @private
			 * @static
			 * @property {RegExp}
			 */
			hslRegExp: /(hsl[a]?)\(([.,\d\s%]*)\)/i,

			/**
			 * Color list based on [W3 named colors list](https://www.w3.org/TR/css-color-4/#named-colors).
			 *
			 * @static
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

	CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE = 255;

	/**
	 * This list is deprecated, use {@link CKEDITOR.tools.color#namedColors} instead.
	 *
	 * @member CKEDITOR.tools.style.parse
	 * @private
	 * @deprecated 4.16.0
	 */
	CKEDITOR.tools.style.parse._colors = CKEDITOR.tools.color.namedColors;

	// Blends alpha into RGB color channels. Assumes that background is white.
	//
	// @private
	// @param {Number} red Red channel value.
	// @param {Number} green Green channel value.
	// @param {Number} blue Blue channel value.
	// @param {Number} alpha Alpha channel value.
	// @returns {Array} Array containing RGB channels with alpha mixed.
	function blendAlphaColor( red, green, blue, alpha ) {
		// Based on https://en.wikipedia.org/wiki/Alpha_compositing.
		return CKEDITOR.tools.array.map( [ red, green, blue ], function( color ) {
			return Math.round( CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE - alpha * ( CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE - color ) );
		} );
	}

	// Validate if given value is string type and ends with `%` character.
	// @param {*} value any value.
	// @returns {Boolean}
	function isPercentValue( value ) {
		return typeof value === 'string' && value.slice( -1 ) === '%';
	}

	// Remove `%` character and convert value to Number.
	// @param {String} value Percent value (e.g. `100%`)
	// @returns {Number} value as a Number.
	function convertPercentValueToNumber( value ) {
		return Number( value.slice( 0, -1 ) );
	}

	// Convert given value as hexadecimal based.
	// @param {*} value value to convert.
	// @returns {String} hexadecimal value.
	function valueToHex( value ) {
		var hex = value.toString( 16 );

		return hex.length == 1 ? '0' + hex : hex;
	}

	// Convert hexadecimal value to digit.
	function hexToValue( hexValue ) {
		return parseInt( hexValue, 16 );
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
	// @param {*} rgbPrefix
	// @param {*} red
	// @param {*} green
	// @param {*} blue
	// @param {*} alpha
	// @returns {String} Formatted color value (e.g. `rgb(255,255,255)`)
	function formatRgbString( rgbPrefix, red, green, blue, alpha ) {
		var rgba = [ red, green, blue ];

		if ( alpha !== undefined ) {
			rgba.push( alpha );
		}

		return rgbPrefix + '(' + rgba.join( ',' ) + ')';
	}

	// Convert color values into formatted hsl or hsla color code.
	// @private
	// @param {String} hslPrefix Prefix for color value. Expected `hsl` or `hsla`.
	// @param {*} hue
	// @param {*} saturation
	// @param {*} lightness
	// @param {*} alpha
	// @returns {String} Formatted color value (e.g. `hsl(360, 50%, 50%)`)
	function formatHslString( hslPrefix, hue, saturation, lightness, alpha ) {
		var alphaString = alpha !== undefined ? ',' + alpha : '';

		return hslPrefix + '(' +
		hue + ',' +
		saturation + '%,' +
		lightness + '%' +
		alphaString +
		')';
	}

} )();
