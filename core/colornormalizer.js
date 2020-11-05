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

			var finalHex  = colorCode;

			finalHex = this._.convertStringToHex( finalHex );
			finalHex = this._.convertRgbToHex( finalHex );

			this._.hexColorCode = finalHex;
		},

		_: {
			originalColorCode: '',
			hexColorCode: '',
			/**
			 * Normalizes hexadecimal notation so that the color string is always 6 characters long and lowercase.
			 *
			 * @param {String} hexColorCode String containing hex colors.
			 * @returns {String} The style data with hex colors normalized.
			 */
			normalizeHex: function(hexColorCode) {
				return hexColorCode.replace( /#(([0-9a-f]{3}){1,2})($|;|\s+)/gi, function( match, hexColor, hexColorPart, separator ) {
					var normalizedHexColor = hexColor.toLowerCase();

					if ( normalizedHexColor.length == 3 ) {
						var parts = normalizedHexColor.split( '' );
						normalizedHexColor = [ parts[ 0 ], parts[ 0 ], parts[ 1 ], parts[ 1 ], parts[ 2 ], parts[ 2 ] ].join( '' );
					}

					return '#' + normalizedHexColor + separator;
				} );
			},

			convertRgbToHex: function( styleText ) {
				return styleText.replace( /(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function( match, red, green, blue ) {
					var color = [ red, green, blue ];
					// Add padding zeros if the hex value is less than 0x10.
					for ( var i = 0; i < 3; i++ )
						color[ i ] = ( '0' + parseInt( color[ i ], 10 ).toString( 16 ) ).slice( -2 );
					return '#' + color.join( '' );
				} );
			},

			convertStringToHex: function( colorCode ) {
				var colorToHexObject = CKEDITOR.tools.style.parse._colors;
				var resultCode = colorToHexObject[colorCode] || colorCode;

				return  resultCode;
			}
		},

		proto: {
			getHex: function() {
				var finalColorCode = this._.normalizeHex( this._.hexColorCode );
				finalColorCode = finalColorCode.toUpperCase();

				return finalColorCode;
			}
		}
	  }
  );
