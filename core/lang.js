/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

(function() {
	var loadedLangs = {};

	/**
	 * Holds language related functions.
	 *
	 * @class
	 * @singleton
	 */
	CKEDITOR.lang = {
		/**
		 * The list of languages available in the editor core with the language reading direction.
		 *
		 * Possible values are "rtl" for Right-To-Left languages (like Arabic) and
		 * "ltr" for Left-To-Right languages (like English).
		 *
		 *		alert( CKEDITOR.lang.en ); // 'ltr'
		 */
		languages: {
			'af': 'ltr',
			'ar': 'rtl',
			'bg': 'ltr',
			'bn': 'ltr',
			'bs': 'ltr',
			'ca': 'ltr',
			'cs': 'ltr',
			'cy': 'ltr',
			'da': 'ltr',
			'de': 'ltr',
			'el': 'ltr',
			'en-au': 'ltr',
			'en-ca': 'ltr',
			'en-gb': 'ltr',
			'en': 'ltr',
			'eo': 'ltr',
			'es': 'ltr',
			'et': 'ltr',
			'eu': 'ltr',
			'fa': 'rtl',
			'fi': 'ltr',
			'fo': 'ltr',
			'fr-ca': 'ltr',
			'fr': 'ltr',
			'gl': 'ltr',
			'gu': 'ltr',
			'he': 'rtl',
			'hi': 'ltr',
			'hr': 'ltr',
			'hu': 'ltr',
			'id': 'ltr',
			'is': 'ltr',
			'it': 'ltr',
			'ja': 'ltr',
			'ka': 'ltr',
			'km': 'ltr',
			'ko': 'ltr',
			'ku': 'rtl',
			'lt': 'ltr',
			'lv': 'ltr',
			'mk': 'ltr',
			'mn': 'ltr',
			'ms': 'ltr',
			'nb': 'ltr',
			'nl': 'ltr',
			'no': 'ltr',
			'pl': 'ltr',
			'pt-br': 'ltr',
			'pt': 'ltr',
			'ro': 'ltr',
			'ru': 'ltr',
			'si': 'ltr',
			'sk': 'ltr',
			'sl': 'ltr',
			'sq': 'ltr',
			'sr-latn': 'ltr',
			'sr': 'ltr',
			'sv': 'ltr',
			'th': 'ltr',
			'tr': 'ltr',
			'ug': 'rtl',
			'uk': 'ltr',
			'vi': 'ltr',
			'zh-cn': 'ltr',
			'zh': 'ltr'
		},

		/**
		 * Loads a specific language file, or auto detect it. A callback is
		 * then called when the file gets loaded.
		 *
		 * @param {String} languageCode The code of the language file to be
		 * loaded. If null or empty, autodetection will be performed. The
		 * same happens if the language is not supported.
		 * @param {String} defaultLanguage The language to be used if
		 * languageCode is not supported or if the autodetection fails.
		 * @param {Function} callback A function to be called once the
		 * language file is loaded. Two parameters are passed to this
		 * function: the language code and the loaded language entries.
		 */
		load: function( languageCode, defaultLanguage, callback ) {
			// If no languageCode - fallback to browser or default.
			// If languageCode - fallback to no-localized version or default.
			if ( !languageCode || !CKEDITOR.lang.languages[ languageCode ] )
				languageCode = this.detect( defaultLanguage, languageCode );

			if ( !this[ languageCode ] ) {
				CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( 'lang/' + languageCode + '.js' ), function() {
					this[ languageCode ].dir = CKEDITOR.lang.languages[ languageCode ];
					callback( languageCode, this[ languageCode ] );
				}, this );
			} else
				callback( languageCode, this[ languageCode ] );
		},

		/**
		 * Returns the language that best fit the user language. For example,
		 * suppose that the user language is "pt-br". If this language is
		 * supported by the editor, it is returned. Otherwise, if only "pt" is
		 * supported, it is returned instead. If none of the previous are
		 * supported, a default language is then returned.
		 *
		 *		alert( CKEDITOR.lang.detect( 'en' ) ); // e.g., in a German browser: 'de'
		 *
		 * @param {String} defaultLanguage The default language to be returned
		 * if the user language is not supported.
		 * @param {String} [probeLanguage] A language code to try to use,
		 * instead of the browser based autodetection.
		 * @returns {String} The detected language code.
		 */
		detect: function( defaultLanguage, probeLanguage ) {
			var languages = this.languages;
			probeLanguage = probeLanguage || navigator.userLanguage || navigator.language || defaultLanguage;

			var parts = probeLanguage.toLowerCase().match( /([a-z]+)(?:-([a-z]+))?/ ),
				lang = parts[ 1 ],
				locale = parts[ 2 ];

			if ( languages[ lang + '-' + locale ] )
				lang = lang + '-' + locale;
			else if ( !languages[ lang ] )
				lang = null;

			CKEDITOR.lang.detect = lang ?
			function() {
				return lang;
			} : function( defaultLanguage ) {
				return defaultLanguage;
			};

			return lang || defaultLanguage;
		}
	};

})();
