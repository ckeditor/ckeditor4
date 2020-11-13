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
		parseInput: function( colorCode ) {
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
			//TODO match only hex, not style text
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
		rgbOrHslToHex: function( colorCode ) {
			var colorFormat = colorCode.trim().slice( 0, 3 ).toLowerCase();

			if ( colorFormat !== 'rgb' && colorFormat !== 'hsl' ) {
				return null;
			}

			var colorNumberValues = colorCode.match( /\d+\.?\d*/g );
			if ( !colorNumberValues ) {
				return null;
			}

			colorNumberValues = colorNumberValues.map( Number );
			//extract alpha
			var alpha = colorNumberValues.length === 4 ? colorNumberValues.pop() : 1;

			if ( colorFormat === 'hsl' ) {
				colorNumberValues = this.hslToRgb( colorNumberValues[0], colorNumberValues[1],colorNumberValues[2] );
			}

			//blend alpha
			colorNumberValues = this.blendAlphaColor( colorNumberValues, alpha );

			return this.rgbToHex( colorNumberValues );
		},
		hslToRgb: function( hue, sat, light ) {
			hue = this.clampValueInRange( hue, 0, 360 );
			sat = this.normalizePercentValue( sat );
			light = this.normalizePercentValue( light );

			//based on https://www.w3schools.com/lib/w3color.js
			var t1, t2, r, g, b;
			hue = hue / 60;
			if ( light <= 0.5 ) {
				t2 = light * ( sat + 1 );
			} else {
				t2 = light + sat - ( light * sat );
			}
			t1 = light * 2 - t2;
			r = this.hueToRgb( t1, t2, hue + 2 ) * 255;
			g = this.hueToRgb( t1, t2, hue ) * 255;
			b = this.hueToRgb( t1, t2, hue - 2 ) * 255;
			return [ r, g, b ];
		},
		clampValueInRange: function( value, min, max ) {
			return Math.min( Math.max( value, min ), max );
		},
		normalizePercentValue: function( value ) {
			if ( value > 1 ) {
				value =  value / 100;
			}

			return this.clampValueInRange( value, 0, 1 );
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
			return rgb.map( function( color ) {
				return Math.round( 255 - alpha * ( 255 - color ) );
			} );
		},
		rgbToHex: function( rgb ) {
			var hexValues = rgb.map( function( number ) {
								number = number > 255 ? 0 : number;
								return this.valueToHex( number );
							}, this );

			return '#' + hexValues.join( '' );
		},
		valueToHex: function( value ) {
			var hex = value.toString( 16 );

			return hex.length == 1 ? '0' + hex : hex;
		},
		getHex: function() {
			var finalColorCode = this.hexColorCode;

			finalColorCode = finalColorCode.toUpperCase();

			return finalColorCode;
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
