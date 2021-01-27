/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	/**
	 * Stores language-related functions.
	 *
	 * @class
	 * @singleton
	 */
	CKEDITOR.lang = {
		/**
		 * The list of languages available in the editor core.
		 *
		 *		alert( CKEDITOR.lang.languages.en ); // 1
		 */
		languages: {
			af: 1, ar: 1, az: 1, bg: 1, bn: 1, bs: 1, ca: 1, cs: 1, cy: 1, da: 1, de: 1, 'de-ch': 1, el: 1,
			'en-au': 1, 'en-ca': 1, 'en-gb': 1, en: 1, eo: 1, es: 1, 'es-mx':1, et: 1, eu: 1, fa: 1, fi: 1, fo: 1,
			'fr-ca': 1, fr: 1, gl: 1, gu: 1, he: 1, hi: 1, hr: 1, hu: 1, id: 1, is: 1, it: 1, ja: 1, ka: 1,
			km: 1, ko: 1, ku: 1, lt: 1, lv: 1, mk: 1, mn: 1, ms: 1, nb: 1, nl: 1, no: 1, oc: 1, pl: 1, 'pt-br': 1,
			pt: 1, ro: 1, ru: 1, si: 1, sk: 1, sl: 1, sq: 1, 'sr-latn': 1, sr: 1, sv: 1, th: 1, tr: 1, tt: 1, ug: 1,
			uk: 1, vi: 1, 'zh-cn': 1, zh: 1
		},

		/**
		 * The list of languages that are written Right-To-Left (RTL) and are supported by the editor.
		 */
		rtl: { ar: 1, fa: 1, he: 1, ku: 1, ug: 1 },

		/**
		 * Loads a specific language file, or auto detects it. A callback is
		 * then called when the file gets loaded.
		 *
		 * @param {String} languageCode The code of the language file to be
		 * loaded. If null or empty, autodetection will be performed. The
		 * same happens if the language is not supported.
		 * @param {String} defaultLanguage The language to be used if
		 * `languageCode` is not supported or if the autodetection fails.
		 * @param {Function} callback A function to be called once the
		 * language file is loaded. Two parameters are passed to this
		 * function: the language code and the loaded language entries.
		 */
		load: function( languageCode, defaultLanguage, callback ) {
			// If no languageCode - fallback to browser or default.
			// If languageCode - fallback to no-localized version or default.
			if ( !languageCode || !CKEDITOR.lang.languages[ languageCode ] )
				languageCode = this.detect( defaultLanguage, languageCode );

			var that = this,
				loadedCallback = function() {
					that[ languageCode ].dir = that.rtl[ languageCode ] ? 'rtl' : 'ltr';
					callback( languageCode, that[ languageCode ] );
				};

			if ( !this[ languageCode ] )
				CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( 'lang/' + languageCode + '.js' ), loadedCallback, this );
			else
				loadedCallback();
		},

		/**
		 * Returns the language that best fits the user language. For example,
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
		 * instead of the browser-based autodetection.
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

} )();
