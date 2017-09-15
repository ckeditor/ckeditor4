/**
 * @license Copyright (c) 2014-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.a11ychecker.quickFixes.get( { langCode: 'de',
		name: 'ImgAlt',
		callback: function( ImgAlt ) {

			/**
			 * Fixes the image with missing alt attribute, requiring non-empty alt.
			 *
			 * @constructor
			 */
			function ImgAltNonEmpty( issue ) {
				ImgAlt.call( this, issue );
			}

			ImgAltNonEmpty.prototype = new ImgAlt();
			ImgAltNonEmpty.prototype.constructor = ImgAltNonEmpty;

			ImgAltNonEmpty.prototype.validate = function( formAttributes ) {
				var ret = [],
					proposedAlt = formAttributes.alt + '';

				if ( !proposedAlt ) {
					ret.push( this.lang.errorEmpty );
				}

				if ( !ret.length ) {
					ret = ImgAlt.prototype.validate.call( this, formAttributes );
				}

				return ret;
			};

			ImgAltNonEmpty.prototype.lang = {"altLabel":"Alternativtext","errorTooLong":"Der Alternativtext ist zu lang. Er sollte {limit} Zeichen lang sein, ist aber aktuell {length} Zeichen lang","errorWhitespace":"Der Alternativtext kann nicht nur Leerzeichen enthalten","errorSameAsFileName":"Der Alternativtext sollte nicht dem Dateinamen entsprechen","errorEmpty":"Der Alternativtext sollte nicht leer sein"};
			CKEDITOR.plugins.a11ychecker.quickFixes.add( 'de/ImgAltNonEmpty', ImgAltNonEmpty );
		}
	} );
}() );
