/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	var loadedLangs = {};

	CKEDITOR.lang = {
		/**
		 * The list of languages available in the editor core.
		 * @type Object
		 * @example
		 * alert( CKEDITOR.lang.en );  // "true"
		 */
		languages: { 'en':1 },

		/**
		 * Loads a specific language file, or auto detect it. A callback is
		 * then called when the file gets loaded.
		 * @param {String} languageCode The code of the language file to be
		 *		loaded. If "autoDetect" is set to true, this language will be
		 *		used as the default one, if the detect language is not
		 *		available in the core.
		 * @param {Boolean} autoDetect Indicates that the function must try to
		 *		detect the user language and load it instead.
		 * @param {Function} callback The function to be called once the
		 *		language file is loaded. Two parameters are passed to this
		 *		function: the language code and the loaded language entries.
		 * @example
		 */
		load: function( languageCode, autoDetect, callback ) {
			if ( autoDetect )
				languageCode = this.detect( languageCode );

			if ( !this[ languageCode ] ) {
				CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( '_source/' + // %REMOVE_LINE%
													'lang/' + languageCode + '.js' ), function() {
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
		 * @param {String} defaultLanguage The default language to be returned
		 *		if the user language is not supported.
		 * @returns {String} The detected language code.
		 * @example
		 * alert( CKEDITOR.lang.detect( 'en' ) );  // e.g., in a German browser: "de"
		 */
		detect: function( defaultLanguage ) {
			var languages = this.languages;

			var parts = ( navigator.userLanguage || navigator.language ).toLowerCase().match( /([a-z]+)(?:-([a-z]+))?/ ),
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
