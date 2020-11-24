/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @fileoverview Defines the {@link CKEDITOR.tools.color} normalizer class
 * that parse color string code other formats.
 */

( function() {
	'use strict';

	CKEDITOR.tools.color = CKEDITOR.tools.createClass( {
		$: function( colorCode ) {
			this._.originalColorCode = colorCode;
			this._.parseInput( colorCode );
		},

		_: {
			originalColorCode: '',
			hexColorCode: '',
			alpha: 1,
			parseInput: function( colorCode ) {
				colorCode = colorCode.trim();

				var hexStringFromNamedColor = this.matchStringToNamedColor( colorCode );
				var hexFromHexString = this.matchStringToHex( colorCode );
				var hexFromRgbOrHsl = this.rgbOrHslToHex( colorCode );

				this._.hexColorCode = hexStringFromNamedColor || hexFromHexString || hexFromRgbOrHsl || this.defaultHexColorCode;
			},
			setAlpha: function( alphaValue ) {
				alphaValue = this._.normalizePercentValue( alphaValue );
				this._.alpha = alphaValue;
			},
			clampValueInRange: function( value, min, max ) {
				return Math.min( Math.max( value, min ), max );
			},
			normalizePercentValue: function( value ) {
				if ( this._.isPercentValue( value ) ) {
					value = this._.convertPercentValueToNumber( value );
				}

				if ( Math.abs( value ) > 1 ) {
					value =  value / 100;
				}

				return this._.clampValueInRange( value, 0, 1 );
			},
			isPercentValue: function( value ) {
				return typeof value === 'string' && value.slice( -1 ) === '%';
			},
			convertPercentValueToNumber: function( value ) {
				return Number( value.slice( 0, -1 ) );
			},
			valueToHex: function( value ) {
				var hex = value.toString( 16 );

				return hex.length == 1 ? '0' + hex : hex;
			},
			hexToRgb: function() {
				var colorValues = this._.hexColorCode.slice( 1 ).match( /.{2}/ig );
				return CKEDITOR.tools.array.map( colorValues, function( color ) {
					return parseInt( color, 16 );
				} );
			},
			rgbToHex: function( rgb ) {
				var hexValues = CKEDITOR.tools.array.map( rgb, function( number ) {
									if ( this._.isPercentValue( number ) ) {
										number = this._.convertPercentValueToNumber( number );
										number = Math.round( 255 * this._.normalizePercentValue( number ) );
									} else {
										number = Number( number );
										number = number > 255 ? 0 :
													number < 0 ? 255 : number;
									}
									return this._.valueToHex( number );
								}, this );

				return '#' + hexValues.join( '' );
			},
			formatRgbString: function( rgbPrefix, values ) {
				return rgbPrefix + '(' + values.join( ',' ) + ')';
			},
			formatHslString: function( hslPrefix, hsl ) {
				var alphaString = hsl[3] !== undefined ? ',' + hsl[3] : '';

				return hslPrefix + '(' +
				hsl[0] + ',' +
				hsl[1] + '%,' +
				hsl[2] + '%' +
				alphaString +
				')';
			},
			hexToHsl: function( rgb ) {
				//Based on https://en.wikipedia.org/wiki/HSL_and_HSV#General_approach
				var r = rgb[ 0 ] / 255;
				var g = rgb[ 1 ] / 255;
				var b = rgb[ 2 ] / 255;

				var Max = Math.max( r, g, b );
				var min = Math.min( r, g, b );
				var Chroma = Max - min;

				var calculateHprim = function() {
					switch ( Max ) {
						case r:
							return ( ( g - b ) / Chroma ) % 6;
						case g:
							return ( ( b - r ) / Chroma ) + 2;
						case b:
							return ( ( r - g ) / Chroma ) + 4;
					}
				};

				var hPrim = calculateHprim();
				var hue = Chroma === 0 ? 0 : 60 * hPrim;

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
			blendAlphaColor: function( rgb, alpha ) {
				// Based on https://en.wikipedia.org/wiki/Alpha_compositing
				return CKEDITOR.tools.array.map( rgb, function( color ) {
					return Math.round( 255 - alpha * ( 255 - color ) );
				} );
			}
		},

		proto: {
			defaultHexColorCode: '#000000',
			hex3charsRegExp: /#([0-9a-f]{3})/gi,
			matchStringToNamedColor: function( colorName ) {
				var colorToHexObject = CKEDITOR.tools.color.namedColors;
				var resultCode = colorToHexObject[ colorName.toLowerCase() ] || null;

				return resultCode;
			},
			matchStringToHex: function( hexColorCode ) {
				var hex6charsRegExp = /#([0-9a-f]{6})/gi;
				var hex8charsRegExp = /#([0-9a-f]{8})/gi;

				var finalHex = null;
				this._.setAlpha( 1 );

				if ( hexColorCode.match( this.hex3charsRegExp ) ) {
					finalHex = this.hex3ToHex6( hexColorCode );
				}

				if ( hexColorCode.match( hex6charsRegExp ) ) {
					finalHex = hexColorCode;
				}

				if ( hexColorCode.match( hex8charsRegExp ) ) {
					var firstAlphaCharIndex = 7;

					finalHex = hexColorCode.slice( 0, firstAlphaCharIndex );
					this._.setAlpha( hexColorCode.slice( firstAlphaCharIndex ) );
				}

				return finalHex;
			},
			hex3ToHex6: function( hex3ColorCode ) {
				return hex3ColorCode.replace( this.hex3charsRegExp, function( match, hexColor ) {
					var normalizedHexColor = hexColor.toLowerCase();

					var parts = normalizedHexColor.split( '' );
					normalizedHexColor = [ parts[ 0 ], parts[ 0 ], parts[ 1 ], parts[ 1 ], parts[ 2 ], parts[ 2 ] ].join( '' );

					return '#' + normalizedHexColor;
				} );
			},
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
					alpha = this._.normalizePercentValue( colorNumberValues.pop() );
				}

				this._.setAlpha( alpha );

				if ( colorFormat === 'hsl' ) {
					colorNumberValues = this.hslToRgb( colorNumberValues[0], colorNumberValues[1],colorNumberValues[2] );
				}

				return this._.rgbToHex( colorNumberValues );
			},
			hslToRgb: function( hue, saturation, light ) {
				//Based on https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
				hue = this._.clampValueInRange( Number( hue ), 0, 360 );
				saturation = this._.normalizePercentValue( saturation );
				light = this._.normalizePercentValue( light );

				var calculateValueFromConst = function( fixValue ) {
					var k = ( fixValue + ( hue / 30 ) ) % 12;
					var a = saturation * Math.min( light, 1 - light );

					var min = Math.min( k - 3, 9 - k, 1 );
					var max = Math.max( -1, min );
					var normalizedValue = light - ( a * max );

					return Math.round( normalizedValue * 255 );
				};

				var rgb = [ calculateValueFromConst( 0 ), calculateValueFromConst( 8 ), calculateValueFromConst( 4 ) ];
				return rgb;
			},

			getHex: function() {
				//Remove '#' character and split onto color values
				var colorValues = this._.hexColorCode.slice( 1 ).match( /.{2}/ig );
				var decimalColorValues = CKEDITOR.tools.array.map( colorValues, function( color ) {
					return parseInt( color, 16 );
				} );

				decimalColorValues = this._.blendAlphaColor( decimalColorValues, this._.alpha );

				var finalColor = CKEDITOR.tools.array.map( decimalColorValues, function( color ) {
					return this._.valueToHex( color );
				}, this );

				var finalColorCode = '#' + finalColor.join( '' );

				finalColorCode = finalColorCode.toUpperCase();

				return finalColorCode;
			},
			getHexAlpha: function() {
				return this._.hexColorCode + this._.valueToHex( this._.alpha );
			},
			getRgb: function() {
				var decimalColorValues = this._.hexToRgb();

				decimalColorValues = this._.blendAlphaColor( decimalColorValues, this._.alpha );

				return this._.formatRgbString( 'rgb', decimalColorValues );
			},
			getRgba: function() {
				var decimalColorValues = this._.hexToRgb();
				decimalColorValues.push( this._.alpha );

				return this._.formatRgbString( 'rgba', decimalColorValues );
			},
			getHsl: function() {
				var rgb = this._.hexToRgb();
				rgb = this._.blendAlphaColor( rgb, this._.alpha );

				var hsl = this._.hexToHsl( rgb );

				return this._.formatHslString( 'hsl', hsl );
			},
			getHsla: function() {
				var rgb = this._.hexToRgb();
				var hsl = this._.hexToHsl( rgb );
				hsl.push( this._.alpha );

				return this._.formatHslString( 'hsla', hsl );
			}
		}
	} );

	// Color list based on https://www.w3.org/TR/css-color-4/#named-colors.
	CKEDITOR.tools.color.namedColors = {
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
	};

	/**
	 * @deprecated
	 */
	CKEDITOR.tools.style.parse._colors = CKEDITOR.tools.color.namedColors;

} )();
