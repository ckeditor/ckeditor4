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
		},

		_: {
			originalColorCode: '',
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
			}
		},

		proto: {
			getHex: function() {
				var finalColorCode = this._.normalizeHex(this._.originalColorCode);
				finalColorCode = finalColorCode.toUpperCase();

				return finalColorCode;
			}
		}
	  }
  );
