/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

 /**
  * @fileoverview Defines the {@link CKEDITOR.tools.style.Color} normalizer class
  * 		that parse color string code other formats.
  */

//TODO
// naming convencion for hex with & without '#' -> methods or flag?
// uper / lower cases?

/**
 * HEX 	 -> valid HEX Color Value with # character: #FFF or #FFFFFF
 * 3-HEX -> HEX but with only 3 characters value: #FFF
 * 6-HEX -> HEX but with exactly 6 characters value: #FFFFFF
 */

  CKEDITOR.tools.style.Color = CKEDITOR.tools.createClass( {
		$: function (colorCode) {
			this._.originalColorCode = colorCode;

			var stringToHex = this._.convertStringToHex( colorCode );
			var rgbToHex = this._.convertRgbToHex( colorCode );
			var hexToHex = this._.normalizeHex( colorCode );

			var finalHex  = stringToHex || rgbToHex || hexToHex || this._.defaultHexColorCode;

			this._.hexColorCode = finalHex;
		},

		_: {
			originalColorCode: '',
			hexColorCode: '',
			defaultHexColorCode: '#000000',

			/**
			 * Normalizes hexadecimal notation so that the color string is always 6 characters long and lowercase.
			 *
			 * @param {String} hexColorCode String containing hex colors.
			 * @returns {String} The style data with hex colors normalized.
			 */
			normalizeHex: function(hexColorCode) {
				var hexRegExp = /#(([0-9a-f]{3}){1,2})($|;|\s+)/gi;

				if(hexColorCode.match(hexRegExp))
				{
					return hexColorCode.replace( hexRegExp, function( match, hexColor, hexColorPart, separator ) {
						var normalizedHexColor = hexColor.toLowerCase();

						if ( normalizedHexColor.length == 3 ) {
							var parts = normalizedHexColor.split( '' );
							normalizedHexColor = [ parts[ 0 ], parts[ 0 ], parts[ 1 ], parts[ 1 ], parts[ 2 ], parts[ 2 ] ].join( '' );
						}

						return '#' + normalizedHexColor + separator;
					} );
				}
				else {
					return null;
				}

			},

			convertRgbToHex: function( styleText ) {
				var rgbRegExp = /(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi;

				if( styleText.match( rgbRegExp ) ) {
					return styleText.replace(rgbRegExp, function( match, red, green, blue ) {
						var color = [ red, green, blue ];
						// Add padding zeros if the hex value is less than 0x10.
						for ( var i = 0; i < 3; i++ )
						color[ i ] = ( '0' + parseInt( color[ i ], 10 ).toString( 16 ) ).slice( -2 );
						return '#' + color.join( '' );
					} );
				}else {
					return null;
				}
			},

			convertStringToHex: function( colorCode ) {
				var colorToHexObject = CKEDITOR.tools.style.parse._colors;
				var resultCode = colorToHexObject[colorCode] || null;

				return  resultCode;
			}
		},

		proto: {
			getHex: function() {
				finalColorCode = this._.hexColorCode.toUpperCase();

				return finalColorCode;
			}
		}

	  }
  );
