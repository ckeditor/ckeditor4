/**
 * @license Copyright (c) 2014-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.a11ychecker.quickFixes.get( { langCode: 'nl',
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

			ImgAltNonEmpty.prototype.lang = {"altLabel":"Alternatieve tekst","errorTooLong":"Alternatieve tekst is te lang. Deze mag maximaal {limit} karaktersbevatten terwijl opgegeven tekst {length} bevat","errorWhitespace":"Alternatieve tekst mag niet alleen uit spaties bestaan","errorSameAsFileName":"Alt-tekst van de afbeelding mag niet hetzelfde zijn als de bestandsnaam","errorEmpty":"Alternatieve tekst mag niet leeg zijn"};
			CKEDITOR.plugins.a11ychecker.quickFixes.add( 'nl/ImgAltNonEmpty', ImgAltNonEmpty );
		}
	} );
}() );
