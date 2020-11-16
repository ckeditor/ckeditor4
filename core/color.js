/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @fileoverview Defines the {@link CKEDITOR.tools.style.color} normalizer class
 * that parse color string code other formats.
 */

( function() {
	'use strict';

	CKEDITOR.tools.style.color = function( colorCode ) {
		this.originalColorCode = colorCode;
		this.parseInput( colorCode );
	};

	CKEDITOR.tools.style.color.prototype = {
		originalColorCode: '',
		hexColorCode: '',
		defaultHexColorCode: '#000000',
		alpha: 1,
		hex3charsRegExp: /#([0-9a-f]{3})/gi,
		parseInput: function( colorCode ) {
			colorCode = colorCode.trim();

			var hexStringFromNamedColor = this.matchStringToNamedColor( colorCode );
			var hexFromHexString = this.matchStringToHex( colorCode );
			var hexFromRgbOrHsl = this.rgbOrHslToHex( colorCode );

			this.hexColorCode = hexStringFromNamedColor || hexFromHexString || hexFromRgbOrHsl || this.defaultHexColorCode;
		},
		matchStringToNamedColor: function( colorName ) {
			var colorToHexObject = this.namedColors;
			var resultCode = colorToHexObject[ colorName.toLowerCase() ] || null;

			return resultCode;
		},
		matchStringToHex: function( hexColorCode ) {
			var hex6charsRegExp = /#([0-9a-f]{6})/gi;
			var hex8charsRegExp = /#([0-9a-f]{8})/gi;

			var finalHex = null;
			this.setAlpha( 1 );

			if ( hexColorCode.match( this.hex3charsRegExp ) ) {
				finalHex = this.hex3ToHex6( hexColorCode );
			}

			if ( hexColorCode.match( hex6charsRegExp ) ) {
				finalHex = hexColorCode;
			}

			if ( hexColorCode.match( hex8charsRegExp ) ) {
				var firstAlphaCharIndex = 7;

				finalHex = hexColorCode.slice( 0, firstAlphaCharIndex );
				this.setAlpha( hexColorCode.slice( firstAlphaCharIndex ) );
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

			// colorNumberValues = CKEDITOR.tools.array.map( colorNumberValues, function( value ) {
			// 	return Number( value );
			// } );
			var alpha = 1;
			if ( colorNumberValues.length === 4 ) {
				alpha = this.normalizePercentValue( colorNumberValues.pop() );
			}

			this.setAlpha( alpha );

			if ( colorFormat === 'hsl' ) {
				colorNumberValues = this.hslToRgb( colorNumberValues[0], colorNumberValues[1],colorNumberValues[2] );
			}

			return this.rgbToHex( colorNumberValues );
		},
		hslToRgb: function( hue, sat, light ) {
			//Based on https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
			hue = this.clampValueInRange( Number( hue ), 0, 360 );
			sat = this.normalizePercentValue( sat );
			light = this.normalizePercentValue( light );

			var calculateValueFromConst = function( fixValue ) {
				var k = (fixValue + ( hue / 30 ) ) % 12;
				var a = sat * Math.min( light, 1 - light );

				var min = Math.min( k - 3, 9 - k, 1 );
				var max = Math.max( -1, min );
				var normalizedValue = light - ( a * max );

				return Math.round( normalizedValue * 255 );
			};

			var rgb = [ calculateValueFromConst( 0 ), calculateValueFromConst( 8 ), calculateValueFromConst( 4 ) ];
			return rgb;
		},
		setAlpha: function( alphaValue ) {
			alphaValue = this.normalizePercentValue( alphaValue );
			this.alpha = alphaValue;
		},
		clampValueInRange: function( value, min, max ) {
			return Math.min( Math.max( value, min ), max );
		},
		normalizePercentValue: function( value ) {
			if ( typeof value === 'string' && value.slice( -1 ) === '%' ) {
				value = value.slice( 0, -1 );

				value = Number( value );
			}

			if ( Math.abs( value ) > 1 ) {
				value =  value / 100;
			}

			return this.clampValueInRange( value, 0, 1 );
		},
		blendAlphaColor: function( rgb, alpha ) {
			// Based on https://en.wikipedia.org/wiki/Alpha_compositing
			return CKEDITOR.tools.array.map( rgb, function( color ) {
				return Math.round( 255 - alpha * ( 255 - color ) );
			} );
		},
		rgbToHex: function( rgb ) {
			var hexValues = CKEDITOR.tools.array.map( rgb, function( number ) {
								if ( typeof number === 'string' && number.slice( -1 ) === '%' ) {
									number = Number( number.slice( 0, -1 ) );
									number = Math.round( 255 * this.normalizePercentValue( number ) );
								} else {
									number = Number( number );
									//TODO clamp for negative numbers also
									number = number > 255 ? 0 : number;
								}
								return this.valueToHex( number );
							}, this );

			return '#' + hexValues.join( '' );
		},
		valueToHex: function( value ) {
			var hex = value.toString( 16 );

			return hex.length == 1 ? '0' + hex : hex;
		},
		getHex: function() {
			//Remove '#' character and split onto color values
			var colorValues = this.hexColorCode.slice( 1 ).match( /.{2}/ig );
			var decimalColorValues = CKEDITOR.tools.array.map( colorValues, function( color ) {
				return parseInt( color, 16 );
			} );

			decimalColorValues = this.blendAlphaColor( decimalColorValues, this.alpha );

			var finalColor = CKEDITOR.tools.array.map( decimalColorValues, function( color ) {
				return this.valueToHex( color );
			}, this );

			var finalColorCode = '#' + finalColor.join( '' );

			finalColorCode = finalColorCode.toUpperCase();

			return finalColorCode;
		},
		getHexAlpha: function() {
			return this.hexColorCode + this.valueToHex( this.alpha );
		},
		getRgb: function() {
			var decimalColorValues = this.hexToRgb();

			decimalColorValues = this.blendAlphaColor( decimalColorValues, this.alpha );

			return this.formatRgbString( 'rgb', decimalColorValues );
		},
		getRgba: function() {
			var decimalColorValues = this.hexToRgb();
			decimalColorValues.push( this.alpha );

			return this.formatRgbString( 'rgba', decimalColorValues );
		},
		hexToRgb: function() {
			var colorValues = this.hexColorCode.slice( 1 ).match( /.{2}/ig );
			return CKEDITOR.tools.array.map( colorValues, function( color ) {
				return parseInt( color, 16 );
			} );
		},
		formatRgbString: function( rgbPrefix, values ) {
			return rgbPrefix + '(' + values.join( ',' ) + ')';
		},
		getHsl: function() {
			var rgb = this.hexToRgb();
			rgb = this.blendAlphaColor( rgb, this.alpha );
			var hsl = this.hexToHsl( rgb );

			return this.formatHslString( 'hsl', hsl );
		},
		getHsla: function() {
			var rgb = this.hexToRgb();
			var hsl = this.hexToHsl( rgb );
			hsl.push( this.alpha );

			return this.formatHslString( 'hsla', hsl );
		},
		hexToHsl: function( rgb ) {
			var r = rgb[0] / 255;
			var g = rgb[1] / 255;
			var b = rgb[2] / 255;

			var max = Math.max( r, g, b ), min = Math.min( r, g, b );
			var h, s, l = ( max + min ) / 2;

			if ( max == min ) {
				h = s = 0; // achromatic
			} else {
				var d = max - min;
				s = l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );
				switch ( max ){
					case r: h = ( g - b ) / d + ( g < b ? 6 : 0 ); break;
					case g: h = ( b - r ) / d + 2; break;
					case b: h = ( r - g ) / d + 4; break;
				}
				h /= 6;
			}

			return [ Math.round( h * 360 ), s * 100, l * 100 ];
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
	};

} )();
