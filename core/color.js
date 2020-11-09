/**
* @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
* For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
/**
* @fileoverview Defines the {@link CKEDITOR.tools.style.Color} normalizer class
* 		that parse color string code other formats.
*/

/**
*Basic definitions
*HEX 	 -> valid HEX Color Value with # value: #FFF or #FFFFFF
*3-HEX -> HEX but with only 3 characters value: #FFF
*6-HEX -> HEX but with exactly 6 characters value: #FFFFFF
*/
( function() {
	'use strict';

	var colorClassDefinition = {
			$: function( colorCode, compatibilityMode ) {
				this._.compatibilityMode = compatibilityMode || false;
				this._.originalColorCode = colorCode;

				if ( this._.compatibilityMode ) {
					this._.legacyParsing( colorCode );
				} else {
					this._.parseInput( colorCode );
				}
			},

			_: {
				//could be valid color code or trash input
				originalColorCode: '',
				hexColorCode: '',
				compatibilityMode: false,
				defaultHexColorCode: '#000000',
				/**
				 * @deprecated For compatibility
				 */
				legacyParsing: function( colorCode ) {
					var stringToHex = this._.matchStringToNamedColor( colorCode );
					var rgbToHex = this.convertRgbStringToHex( colorCode );
					var hexToHex = this._.normalizeHex( colorCode );

					//due to compatibility
					var defaultValue = colorCode;

					var finalHex  = stringToHex || rgbToHex || hexToHex || defaultValue;

					this._.hexColorCode = finalHex;
				},
				matchStringToNamedColor: function( colorName ) {
					var colorToHexObject = CKEDITOR.tools.style.Color.namedColors;
					var resultCode = colorToHexObject[ colorName.toLowerCase() ] || null;

					return resultCode;
				},
				convertRgbStringToHex: function( styleText ) {
					var rgbRegExp = /(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi;

					if ( styleText.match( rgbRegExp ) ) {
						return styleText.replace( rgbRegExp, function( match, red, green, blue ) {
							var color = [ red, green, blue ];
							// Add padding zeros if the hex value is less than 0x10.
							for ( var i = 0; i < 3; i++ ) {
								color[ i ] = ( '0' + parseInt( color[ i ], 10 ).toString( 16 ) ).slice( -2 );
							}
							return '#' + color.join( '' );
						} );
					} else {
						return null;
					}
				},
				/**
				* Normalizes hexadecimal notation so that the color string is always 6 characters long and lowercase.
				*
				* @param {String} hexColorCode String containing hex colors.
				* @returns {String} The style data with hex colors normalized.
				*/
				normalizeHex: function( hexColorCode ) {
					//also style string with hex color
					var styleHexRegExp = /#(([0-9a-f]{3}){1,2})($|;|\s+)/gi;

					if ( hexColorCode.match( styleHexRegExp ) ) {
						return hexColorCode.replace( styleHexRegExp, function( match, hexColor, hexColorPart, separator ) {
							var normalizedHexColor = hexColor.toLowerCase();

							if ( normalizedHexColor.length == 3 ) {
								var parts = normalizedHexColor.split( '' );
								normalizedHexColor = [ parts[ 0 ], parts[ 0 ], parts[ 1 ], parts[ 1 ], parts[ 2 ], parts[ 2 ] ].join( '' );
							}

							return '#' + normalizedHexColor + separator;
						} );
					} else {
						return null;
					}

				},
				parseInput: function( colorCode ) {
					var hexStringFromNamedColor = this._.matchStringToNamedColor( colorCode );

					var hexFromHexString = this._.matchStringToHex( colorCode );

					var hexFromRgbOrHsl = this._.rgbOrHslToHex( colorCode );

					this._.hexColorCode = hexStringFromNamedColor || hexFromHexString || hexFromRgbOrHsl || this._.defaultHexColorCode;
				},
				rgbOrHslToHex: function( colorCode ) {
					var colorFormat = colorCode.trim().slice( 0,3 ).toLowerCase();

					if ( colorFormat !== 'rgb' && colorFormat !== 'hsl' ) {
						return null;
					}

					//take values
					var colorNumberValues = colorCode.match( /\d+\.?\d*/g );
					//convert them to numbers
					colorNumberValues = CKEDITOR.tools.array.map( colorNumberValues, function( number ) {
						return Number( number );
					} );

					//extract alpha
					var alpha = colorNumberValues.length === 4 ? colorNumberValues.pop() : 1;

					if ( colorFormat === 'hsl' ) {
						colorNumberValues = this._.hslToRgb( colorNumberValues[0], colorNumberValues[1],colorNumberValues[2] );
					}
					//blend alpha
					colorNumberValues = this._.blendAlphaColor( colorNumberValues, alpha );

					return this._.rgbToHex( colorNumberValues );
				},
				hslToRgb: function( hue,sat,light ) {
					//based on https://www.w3schools.com/lib/w3color.js
					var t1, t2, r, g, b;
					hue = hue / 60;
					if ( light <= 0.5 ) {
						t2 = light * ( sat + 1 );
					} else {
						t2 = light + sat - ( light * sat );
					}
					t1 = light * 2 - t2;
					r = this._.hueToRgb( t1, t2, hue + 2 ) * 255;
					g = this._.hueToRgb( t1, t2, hue ) * 255;
					b = this._.hueToRgb( t1, t2, hue - 2 ) * 255;
					return [ r, g, b ];
				},
				hueToRgb: function( t1, t2, hue ) {
					if ( hue < 0 ) hue += 6;
					if ( hue >= 6 ) hue -= 6;
					if ( hue < 1 ) return ( t2 - t1 ) * hue + t1;
					else if ( hue < 3 ) return t2;
					else if ( hue < 4 ) return ( t2 - t1 ) * ( 4 - hue ) + t1;
					else return t1;
				},
				blendAlphaColor: function( rgb, alpha ) {
					// Based on https://en.wikipedia.org/wiki/Alpha_compositing
					return CKEDITOR.tools.array.map( rgb, function( color ) {
						return Math.round( 255 - alpha * ( 255 - color ) );
					}, this );
				},
				rgbToHex: function( rgb ) {
					var hexValues = CKEDITOR.tools.array.map( rgb, function( number ) {
						return this._.valueToHex( number );
					}, this );

					return '#' + hexValues.join( '' );
				},
				valueToHex: function( value ) {
					var hex = value.toString( 16 );

					return hex.length == 1 ? '0' + hex : hex;
				},
				matchStringToHex: function( colorCode ) {
					return this._.normalizeHex( colorCode );
				}
			},

			proto: {
				getHex: function() {
					var finalColorCode = this._.hexColorCode;

					if ( !this._.compatibilityMode ) {
						finalColorCode = finalColorCode.toUpperCase();
					}

					return finalColorCode;
				}
			},

			statics: {
				hexRegExp: /^\#[a-f0-9]{3}(?:[a-f0-9]{3})?$/gi,

				hslaRegExp: /hsla?\(\s*[0-9.]+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[0-9.]+\s*)?\)/gi,

				rgbaRegExp: /rgba?\(\s*\d+%?\s*,\s*\d+%?\s*,\s*\d+%?\s*(?:,\s*[0-9.]+\s*)?\)/gi,

				widthRegExp: /^(thin|medium|thick|[\+-]?\d+(\.\d+)?[a-z%]+|[\+-]?0+(\.0+)?|\.\d+[a-z%]+)$/,
				/**
					* Searches the `value` for any CSS color occurrences and returns it.
					*
					* @param {String} value
					* @returns {String[]} An array of matched results.
					* @member CKEDITOR.tools.style.parse
					*/
				extractAnyColors: function( value ) {
					var ret = [],
					arrayTools = CKEDITOR.tools.array;

					// Check for rgb(a).
					ret = ret.concat( value.match( this.rgbaRegExp ) || [] );

					// Check for hsl(a).
					ret = ret.concat( value.match( this.hslaRegExp ) || [] );

					ret = ret.concat( arrayTools.filter( value.split( /\s+/ ), function( colorEntry ) {
						// Check for hex format.
						if ( colorEntry.match( CKEDITOR.tools.style.Color.hexRegExp ) ) {
							return true;
						}

						// Check for preset names.
						return colorEntry.toLowerCase() in CKEDITOR.tools.style.Color.namedColors;
					} ) );

					return ret;
				},
				/**
					* Validates color string correctness. Works for:
					*
					* * hexadecimal notation;
					* * RGB or RGBA notation;
					* * HSL or HSLA notation;
					* * HTML color name.
					*
											* **Note:** This method is intended mostly for the input validations.
					* It doesn't perform any logical check like if the values in RGB format are correct
					* or if the passed color name actually exists.

					* See the examples below:
					*
					* ```javascript
					* CKEDITOR.tools._isValidColorFormat( '123456' ); // true
					* CKEDITOR.tools._isValidColorFormat( '#4A2' ); // true
					* CKEDITOR.tools._isValidColorFormat( 'rgb( 40, 40, 150 )' ); // true
					* CKEDITOR.tools._isValidColorFormat( 'hsla( 180, 50%, 50%, 0.2 )' ); // true
					*
					* CKEDITOR.tools._isValidColorFormat( '333333;' ); // false
					* CKEDITOR.tools._isValidColorFormat( '<833AF2>' ); // false
					*
					* // But also:
					* CKEDITOR.tools._isValidColorFormat( 'ckeditor' ); // true
					* CKEDITOR.tools._isValidColorFormat( '1234' ); // true
					* CKEDITOR.tools._isValidColorFormat( 'hsrgb( 100 )' ); // true
					* ```
					*
					* @since 4.15.1
					* @param {String} colorCode String to be validated.
					* @returns {Boolean} Whether the input string contains only allowed characters.
					*/
				isValidColorFormat: function( colorCode ) {
					if ( !colorCode ) {
						return false;
					}

					colorCode = colorCode.replace( /\s+/g, '' );

					return /^[a-z0-9()#%,./]+$/i.test( colorCode );
				},
				// Color list based on https://www.w3.org/TR/css-color-4/#named-colors.
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
		};

	//Make sure namespace is defined
	if ( !CKEDITOR.tools ) {
		CKEDITOR.tools = {};
		if ( !CKEDITOR.tools.style ) {
			CKEDITOR.tools.style = {};
		}
	}

	//Wrapp function for classCreator
	//Delay parsing CKEDITOR.tools.createClass until first object is created
	//Due to circular dependency with tools
	CKEDITOR.tools.style.Color = function( colorCode, compatibilityMode ) {
		var createdClass = CKEDITOR.tools.createClass( colorClassDefinition );
		return new createdClass( colorCode, compatibilityMode );
	};

	//Make statics available, even if class creation is delayed
	for ( var key in colorClassDefinition.statics ) {
		if ( colorClassDefinition.statics.hasOwnProperty( key ) ) {
			CKEDITOR.tools.style.Color[key] = colorClassDefinition.statics[key];
		}
	}

} )();
