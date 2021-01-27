/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
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
	 * It can be used to validate and convert color between above formats.
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
		 * @param {*} defaultValue Value which will be returned by any getter if passed color code is not valid.
		 */
		$: function( colorCode, defaultValue ) {
			this._.initialColorCode = colorCode;
			this._.defaultValue = defaultValue;

			this._.parseInput( colorCode );
		},

		proto: {
			/**
			 * Gets hexadecimal color representation.
			 *
			 * @returns {String/*} Hexadecimal color code (e.g. `#FF00FF`) or default value.
			 */
			getHex: function() {
				if ( !this._.isValidColor ) {
					return this._.defaultValue;
				}

				var color = this._.blendAlphaColor( this._.red, this._.green, this._.blue, this._.alpha );

				return this._.formatHexString( color[ 0 ], color[ 1 ], color[ 2 ] );
			},

			/**
			 * Gets hexadecimal color representation with separate alpha channel.
			 *
			 * @returns {String/*} Hexadecimal color code (e.g. `#FF00FF00`) or default value.
			 */
			getHexWithAlpha: function() {
				if ( !this._.isValidColor ) {
					return this._.defaultValue;
				}

				var alpha = Math.round( this._.alpha * CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE );

				return this._.formatHexString( this._.red, this._.green, this._.blue, alpha ) ;
			},

			/**
			 * Gets RGB color representation.
			 *
			 * @returns {String/*} RGB color representation (e.g. `rgb(255,255,255)`) or default value.
			 */
			getRgb: function() {
				if ( !this._.isValidColor ) {
					return this._.defaultValue;
				}

				var color = this._.blendAlphaColor( this._.red, this._.green, this._.blue, this._.alpha );

				return this._.formatRgbString( 'rgb', color[ 0 ], color[ 1 ], color[ 2 ]  );
			},

			/**
			 * Gets RGBA color representation.
			 *
			 * @returns {String/*} RGBA color representation (e.g. `rgba(255,255,255,0)`) or default value.
			 */
			getRgba: function() {
				if ( !this._.isValidColor ) {
					return this._.defaultValue;
				}

				return this._.formatRgbString( 'rgba', this._.red, this._.green, this._.blue, this._.alpha );
			},

			/**
			 * Gets HSL color representation.
			 *
			 * @returns {String/*} HSL color representation (e.g. `hsl(360,100%,50%)`) or default value.
			 *
			 */
			getHsl: function() {
				if ( !this._.isValidColor ) {
					return this._.defaultValue;
				}

				var color = this._.blendAlphaColor( this._.red, this._.green, this._.blue, this._.alpha ),
					hsl = this._.rgbToHsl( color[ 0 ], color[ 1 ], color[ 2 ] );

				return this._.formatHslString( 'hsl', hsl[ 0 ], hsl[ 1 ], hsl[ 2 ] );
			},

			/**
			 * Gets HSLA color representation.
			 *
			 * @returns {String/*} HSLA color representation (e.g. `hsla(360,100%,50%,0)`) or default value.
			 */
			getHsla: function() {
				if ( !this._.isValidColor ) {
					return this._.defaultValue;
				}

				var hsl = this._.rgbToHsl( this._.red, this._.green, this._.blue );

				return this._.formatHslString( 'hsla', hsl[ 0 ], hsl[ 1 ], hsl[ 2 ], this._.alpha );
			},

			/**
			 * Gets raw value passed to the constructor during color object creation.
			 *
			 * @returns {String} Raw value passed during color object creation.
			 */
			getInitialValue: function() {
				return this._.initialColorCode;
			}
		},

		_: {
			/**
			 * Initial color code provided to object constructor.
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
			 * Red channel value. Ranges between 0-255 (inclusive).
			 *
			 * @private
			 * @property {Number}
			 */
			red: 0,

			/**
			 * Green channel value. Ranges between 0-255 (inclusive).
			 *
			 * @private
			 * @property {Number}
			 */
			green: 0,

			/**
			 * Blue channel value. Ranges between 0-255 (inclusive).
			 *
			 * @private
			 * @property {Number}
			 */
			blue: 0,

			/**
			 * Alpha channel value. Ranges between 0-1 (inclusive).
			 *
			 * @private
			 * @property {Number}
			 */
			alpha: 1,

			/**
			 * Blends alpha into RGB color channels. Assumes that background is white.
			 *
			 * @private
			 * @param {Number} red Red channel value.
			 * @param {Number} green Green channel value.
			 * @param {Number} blue Blue channel value.
			 * @param {Number} alpha Alpha channel value.
			 * @returns {Array} Array containing RGB channels with alpha mixed.
			 */
			blendAlphaColor: function( red, green, blue, alpha ) {
				// Based on https://en.wikipedia.org/wiki/Alpha_compositing.
				return CKEDITOR.tools.array.map( [ red, green, blue ], function( color ) {
					return Math.round( CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE - alpha * ( CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE - color ) );
				} );
			},

			/**
			 * Returns color channels formatted as hexadecimal color code preceded by '#'.
			 *
			 * @private
			 * @param {Number} red Red channel value.
			 * @param {Number} green Green channel value.
			 * @param {Number} blue Blue channel value.
			 * @param {Number} [alpha] Optional alpha channel value.
			 * @returns {String} Formatted color value (e.g. `#FF00FF` or with alpha `#FF00FF00`).
			 */
			formatHexString: function( red, green, blue, alpha ) {
				var hexColorCode = '#' + numberToHex( red ) + numberToHex( green ) + numberToHex( blue );

				if ( alpha !== undefined ) {
					hexColorCode += numberToHex( alpha );
				}

				return hexColorCode.toUpperCase();
			},

			/**
			 * Returns color channels formatted as RGB or RGBA color code preceded by given prefix.
			 *
			 * @private
			 * @param {String} rgbPrefix Color code prefix: `rgb` or `rgba`.
			 * @param {Number} red Red channel value.
			 * @param {Number} green Green channel value.
			 * @param {Number} blue Blue channel value.
			 * @param {Number} [alpha] Optional alpha channel value. Should be used with `rgba` prefix only to create valid color value.
			 * @returns {String} Formatted color value (e.g. `rgb(255,255,255)` or with alpha `rgba(255,255,255,1)`).
			 */
			formatRgbString: function( rgbPrefix, red, green, blue, alpha ) {
				var rgba = [ red, green, blue ];

				if ( alpha !== undefined ) {
					rgba.push( alpha );
				}

				return rgbPrefix + '(' + rgba.join( ',' ) + ')';
			},

			/**
			 * Returns color channels formatted as HSL or HSLA color code preceded by given prefix.
			 *
			 * @private
			 * @param {String} hslPrefix Color code prefix: `hsl` or `hsla`.
			 * @param {Number} hue Hue channel value.
			 * @param {Number} saturation Saturation channel value.
			 * @param {Number} lightness Lightness channel value.
			 * @param {Number} [alpha] Optional alpha channel value. Should be used with `hsla` prefix only to create valid color value.
			 * @returns {String} Formatted color value (e.g. `hsl(360,50%,50%)` or `hsla(360,50%,50%,1)`).
			 */
			formatHslString: function( hslPrefix, hue, saturation, lightness, alpha ) {
				var alphaString = alpha !== undefined ? ',' + alpha : '';

				return hslPrefix + '(' +
					hue + ',' +
					saturation + '%,' +
					lightness + '%' +
					alphaString +
					')';
			},

			/**
			 * Parses color code string trying to match it to any supported format and extract RGBA channels.
			 *
			 * @private
			 * @param {String} colorCode Color to parse.
			 */
			parseInput: function( colorCode ) {
				if ( typeof colorCode !== 'string' ) {
					this._.isValidColor = false;
					return;
				}

				colorCode = CKEDITOR.tools.trim( colorCode );

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
			 * Returns hexadecimal color value from {@link CKEDITOR.tools.color#namedColors} based on provided color name.
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
			 * @returns {Array/null}
			 */
			extractColorChannelsFromHex: function( colorCode ) {
				if ( colorCode.match( CKEDITOR.tools.color.hex3CharsRegExp ) ) {
					colorCode = this._.hex3ToHex6( colorCode );
				}

				if ( !colorCode.match( CKEDITOR.tools.color.hex6CharsRegExp ) && !colorCode.match( CKEDITOR.tools.color.hex8CharsRegExp ) ) {
					return null;
				}

				var parts = colorCode.split( '' ),
					alpha = 1;

				if ( parts[ 7 ] && parts[ 8 ] ) {
					alpha = hexToNumber( parts[ 7 ] + parts[ 8 ] );
					alpha = alpha / CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE;
					alpha = Number( alpha.toFixed( 1 ) );
				}

				return [
					hexToNumber( parts[ 1 ] + parts[ 2 ] ),
					hexToNumber( parts[ 3 ] + parts[ 4 ] ),
					hexToNumber( parts[ 5 ] + parts [ 6 ] ),
					alpha
				];
			},

			/**
			 * Extracts RGBA channels from given RGB or RGBA string.
			 *
			 * @private
			 * @param {String} colorCode RGB or RGBA color representation.
			 * @returns {Array/null}
			 */
			extractColorChannelsFromRgba: function( colorCode ) {
				var channels =  this._.extractColorChannelsByPattern( colorCode, CKEDITOR.tools.color.rgbRegExp );

				if ( !channels ) {
					return null;
				}

				var isColorDeclaredWithAlpha = colorCode.indexOf( 'rgba' ) === 0;

				if ( isColorDeclaredWithAlpha && channels.length !== 4 ) {
					return null;
				}

				if ( !isColorDeclaredWithAlpha && channels.length !== 3 ) {
					return null;
				}

				var red = tryToConvertToValidIntegerValue( channels[ 0 ], CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE ),
					green = tryToConvertToValidIntegerValue( channels[ 1 ], CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE ),
					blue = tryToConvertToValidIntegerValue( channels[ 2 ], CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE ),
					alpha = 1;

				if ( isColorDeclaredWithAlpha ) {
					alpha = tryToConvertToValidFloatValue( channels[ 3 ], CKEDITOR.tools.color.MAX_ALPHA_CHANNEL_VALUE );
				}

				return this._.areColorChannelsValid( red, green, blue, alpha ) ? [ red, green, blue, alpha ] : null;
			},

			/**
			 * Extracts RGBA channels from given HSL or HSLA string.
			 *
			 * @private
			 * @param {String} colorCode HSL or HSLA color representation.
			 * @returns {Array/null}
			 */
			extractColorChannelsFromHsla: function( colorCode ) {
				var channels =  this._.extractColorChannelsByPattern( colorCode, CKEDITOR.tools.color.hslRegExp );

				if ( !channels ) {
					return null;
				}

				var isColorDeclaredWithAlpha = colorCode.indexOf( 'hsla' ) === 0;

				if ( isColorDeclaredWithAlpha && channels.length !== 4 ) {
					return null;
				}

				if ( !isColorDeclaredWithAlpha && channels.length !== 3 ) {
					return null;
				}

				var hue = tryToConvertToValidIntegerValue( channels[ 0 ], CKEDITOR.tools.color.MAX_HUE_CHANNEL_VALUE ),
					saturation = tryToConvertToValidFloatValue( channels[ 1 ], CKEDITOR.tools.color.MAX_SATURATION_LIGHTNESS_CHANNEL_VALUE ),
					lightness = tryToConvertToValidFloatValue( channels[ 2 ], CKEDITOR.tools.color.MAX_SATURATION_LIGHTNESS_CHANNEL_VALUE ),
					alpha = 1;

				var rgba = this._.hslToRgb( hue, saturation, lightness );

				if ( isColorDeclaredWithAlpha ) {
					alpha = tryToConvertToValidFloatValue( channels[ 3 ], CKEDITOR.tools.color.MAX_ALPHA_CHANNEL_VALUE );
				}

				rgba.push( alpha );

				return this._.areColorChannelsValid( rgba[ 0 ], rgba[ 1 ], rgba[ 2 ], rgba[ 3 ] ) ? rgba : null;
			},

			/**
			 * Converts 3-characters hexadecimal color format to 6-characters one.
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
			 * Extracts color channels values based on provided regular expression.
			 *
			 * @private
			 * @param {String} value String tested with pattern.
			 * @param {RegExp} regExp Regular expression pattern.
			 * @returns {Array/null} Array with extracted values or null if value doesn't match regular expression.
			 */
			extractColorChannelsByPattern: function( value, regExp ) {
				var match = value.match( regExp );

				if ( !match ) {
					return null;
				}

				var values = match[ 2 ].split( ',' );

				values = CKEDITOR.tools.array.map( values, function( value ) {
					return CKEDITOR.tools.trim( value );
				} );

				return values;
			},

			/**
			 * Validates whether red, green, blue and alpha color channels are within required range.
			 *
			 * For red, green and blue channels range is 0 to {@link CKEDITOR.tools.color#MAX_RGB_CHANNEL_VALUE} inclusive.
			 * For alpha channel range is 0 to {@link CKEDITOR.tools.color#MAX_ALPHA_CHANNEL_VALUE} inclusive.
			 *
			 * @private
			 * @param {Number} red Red channel value.
			 * @param {Number} green Green channel value.
			 * @param {Number} blue Blue channel value.
			 * @param {Number} alpha Alpha channel value.
			 * @returns {Boolean}
			 */
			areColorChannelsValid: function( red, green, blue, alpha ) {
				return isValueWithinRange( red, 0, CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE ) &&
					isValueWithinRange( green, 0, CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE ) &&
					isValueWithinRange( blue, 0, CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE ) &&
					isValueWithinRange( alpha, 0, CKEDITOR.tools.color.MAX_ALPHA_CHANNEL_VALUE );
			},

			/**
			 * Converts HSL color channel values into RGB ones.
			 *
			 * @private
			 * @param {Number} hue
			 * @param {Number} saturation
			 * @param {Number} lightness
			 * @returns {Array} Array of decimal RGB values.
			 */
			hslToRgb: function( hue, saturation, lightness ) {
				// Based on https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB.
				var calculateValueFromConst = function( fixValue ) {
					var k = ( fixValue + ( hue / 30 ) ) % 12,
						a = saturation * Math.min( lightness, 1 - lightness );

					var min = Math.min( k - 3, 9 - k, 1 ),
						max = Math.max( -1, min ),
						normalizedValue = lightness - ( a * max );

					return Math.round( normalizedValue * CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE );
				};

				return [ calculateValueFromConst( 0 ), calculateValueFromConst( 8 ), calculateValueFromConst( 4 ) ];
			},

			/**
			 * Converts RGB color channel values to HSL ones.
			 *
			 * @private
			 * @param {Number} red Number of red channel.
			 * @param {Number} green Number of green channel.
			 * @param {Number} blue Number of blue channel.
			 * @returns {Array} Array of HSL values.
			 */
			rgbToHsl: function( red, green, blue ) {
				// Based on https://en.wikipedia.org/wiki/HSL_and_HSV#General_approach.
				var r = red / CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE,
					g = green / CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE,
					b = blue / CKEDITOR.tools.color.MAX_RGB_CHANNEL_VALUE,
					maxValue = Math.max( r, g, b ),
					minValue = Math.min( r, g, b ),
					chroma = maxValue - minValue;

				var hueFactor = 0;
				switch ( maxValue ) {
					case r:
						hueFactor = ( ( g - b ) / chroma ) % 6;
						break;
					case g:
						hueFactor = ( ( b - r ) / chroma ) + 2;
						break;
					case b:
						hueFactor = ( ( r - g ) / chroma ) + 4;
						break;
				}

				var hue = chroma === 0 ? 0 : 60 * hueFactor,
					lightness = ( maxValue + minValue ) / 2,
					saturation = 0;

				if ( lightness !== 1 && lightness !== 0 ) {
					saturation = chroma / ( 1 - Math.abs( ( 2 * lightness ) - 1 ) );
				}

				hue = Math.round( hue );
				saturation = Math.round( saturation ) * 100;
				lightness = lightness * 100;

				return [ hue, saturation, lightness ];
			}
		},

		statics: {
			/**
			 * The maximum value of RGB channel.
			 *
			 * @private
			 * @static
			 * @readonly
			 * @property {Number}
			 */
			MAX_RGB_CHANNEL_VALUE: 255,

			/**
			 * The maximum value of alpha channel.
			 *
			 * @private
			 * @static
			 * @readonly
			 * @property {Number}
			 */
			MAX_ALPHA_CHANNEL_VALUE: 1,

			/**
			 * The maximum value of hue in HSL color format.
			 *
			 * @private
			 * @static
			 * @readonly
			 * @property {Number}
			 */
			MAX_HUE_CHANNEL_VALUE: 360,

			/**
			 * The maximum value of saturation and lightness in HSL color format.
			 *
			 * @private
			 * @static
			 * @readonly
			 * @property {Number}
			 */
			MAX_SATURATION_LIGHTNESS_CHANNEL_VALUE: 1,

			/**
			 * Regular expression to match hash (`#`) followed by three characters long hexadecimal color value.
			 *
			 * @private
			 * @static
			 * @property {RegExp}
			 */
			hex3CharsRegExp: /#([0-9a-f]{3}$)/gim,

			/**
			 * Regular expression to match hash (`#`) followed by six characters long hexadecimal color value.
			 *
			 * @private
			 * @static
			 * @property {RegExp}
			 */
			hex6CharsRegExp: /#([0-9a-f]{6}$)/gim,

			/**
			 * Regular expression to match hash (`#`) followed by eight characters long hexadecimal color value.
			 *
			 * @private
			 * @static
			 * @property {RegExp}
			 */
			hex8CharsRegExp: /#([0-9a-f]{8}$)/gim,

			/**
			 * Regular expression to extract numbers from RGB and RGBA color value.
			 *
			 * Allowed prefix is `rgb` or `rgba`.
			 * After prefix are values in parentheses. Only dots, coma, digit and percent sign are allowed.
			 *
			 * @private
			 * @static
			 * @property {RegExp}
			 */
			rgbRegExp: /(rgb[a]?)\(([.,\d\s%]*)\)/i,

			/**
			 * Regular expression to extract numbers from HSL and HSLA color value.
			 *
			 * Allowed prefix is `hsl` or `hsla`.
			 * After prefix are values in parentheses. Only dots, coma, digit and percent sign are allowed.
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

	/**
	 * This list is deprecated, use {@link CKEDITOR.tools.color#namedColors} instead.
	 *
	 * @member CKEDITOR.tools.style.parse
	 * @private
	 * @deprecated 4.16.0
	 */
	CKEDITOR.tools.style.parse._colors = CKEDITOR.tools.color.namedColors;

	// Tries to convert given string into integer value if it is a percentage
	// value (e.g. `99%`) or string containing digits only (e.g. `12345`).
	//
	// If given string represents percentage then it is converted to absolute value based on given `max` value.
	//
	// @param {String} value String to be converted (e.g. `100%` or `20`).
	// @param {Number} max If value is percent, then percentage of max is calculated.
	// @returns {Number/String} Converted value or original value.
	function tryToConvertToValidIntegerValue( value, max ) {
		if ( isPercentValue( value ) ) {
			value = Math.round( max * ( parseFloat( value ) / 100 ) );
		} else if ( isIntegerValue( value ) ) {
			value = parseInt( value, 10 );
		}

		return value;
	}

	// Tries to convert given string into float value if it is a percentage
	// value (e.g. `99%`) or string containing digits and dot only.
	//
	// If given string represents percentage then it is converted to absolute value based on given `max` value.
	//
	// @param {String} value String to be converted (e.g. `100%`, `0.5` or `.5`).
	// @param {Number} max If value is percent, then percentage of max is calculated.
	// @returns {Number/String} Converted value or original value.
	function tryToConvertToValidFloatValue( value, max ) {
		if ( isPercentValue( value ) ) {
			value = max * ( parseFloat( value ) / 100 );
		} else if ( isFloatValue( value ) ) {
			value = parseFloat( value );
		}

		return value;
	}

	// Validates if given value is a string representing valid float or integer value
	// ending with `%` character (e.g. `1.2%`, `.5%` or `50%`).
	//
	// @param {*} value Any value to be validated.
	// @returns {Boolean}
	function isPercentValue( value ) {
		return typeof value === 'string' && value.match( /^((\d*\.\d+)|(\d+))%{1}$/gm );
	}

	// Validates if given value is a string representing integer value.
	//
	// @param {*} value Any value to be validated.
	// @returns {Boolean}
	function isIntegerValue( value ) {
		return typeof value === 'string' && value.match( /^\d+$/gm );
	}

	// Validates if given value is a string representing float value.
	//
	// @param {*} value Any value to be validated.
	// @returns {Boolean}
	function isFloatValue( value ) {
		return typeof value === 'string' && value.match( /^\d?\.\d+/gm );
	}

	// Validates if given value is a number (or number-like) within given range (inclusive).
	//
	// @param {*} value Any value to be validated.
	// @param {Number} min The minimum value in the range.
	// @param {Number} max The maximum value in the range
	// @returns {Boolean}
	function isValueWithinRange( value, min, max ) {
		return !isNaN( value ) && value >= min && value <= max;
	}

	// Converts given 10-based value to hexadecimal one.
	//
	// @param {*} value Value to convert.
	// @returns {String} Hexadecimal value.
	function numberToHex( value ) {
		var hex = value.toString( 16 );

		return hex.length == 1 ? '0' + hex : hex;
	}

	// Convert hexadecimal value to 10-based one.
	//
	// @param {String} hexValue Value to convert.
	// @returns {Number}
	function hexToNumber( hexValue ) {
		return parseInt( hexValue, 16 );
	}

} )();
