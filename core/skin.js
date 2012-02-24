/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.skin} class, which is used to manage skin parts.
 */

/**
 * The singleton that manages the loading of skin parts among all editor instances.
 * @class
 * @example
 */
CKEDITOR.skin = (function() {
	var config = CKEDITOR.skinName && CKEDITOR.skinName.split( ',' );

	if ( !config )
		throw '[CKEDITOR.skin] No skin configured at "CKEDITOR.skinName".';

	var skinName = config[ 0 ],
		skinPath = CKEDITOR.getUrl( config[ 1 ] || ( 'skins/' + skinName + '/' ) ),
		props;

	function appendPath( fileNames ) {
		for ( var n = 0; n < fileNames.length; n++ ) {
			fileNames[ n ] = CKEDITOR.getUrl( skinPath + fileNames[ n ] );
		}
	}

	var cssLoaded = {};

	function loadCss( part ) {
		// Avoid reload.
		if ( !cssLoaded[ part ] ) {
			var parts = [ part ];

			if ( part == 'editor' ) {
				var uaParts = props.uaParts;

				// TODO: Load the combination in production mode.
				for ( var i = 0, ua; i < uaParts.length; i++ ) {
					ua = uaParts[ i ];
					if ( /^ie\d+$/.exec( ua ) )
						ua += 'Compat';

					if ( CKEDITOR.env[ ua ] )
						parts.push( 'browser_' + uaParts[ i ] );
				}
			}

			appendPath( parts );
			for ( var c = 0; c < parts.length; c++ )
				CKEDITOR.document.appendStyleSheet( parts[ c ] + '.css' );

			cssLoaded[ part ] = 1;
		}
	}

	/** @lends CKEDITOR.skin */
	return {
		/**
		 * The skin name.
		 */
		name: skinName,

		/**
		 * Root path of the skin directory.
		 */
		path: skinPath,

		/**
		 * Define the skin properties with the specified name.
		 * @param {String} name
		 * @param {Object} def
		 */
		addSkin: function( name, def ) {
			// Bypass other skin definitions. (For production)
			if ( name == skinName )
				CKEDITOR.tools.extend( this, props = def );
		},

		/**
		 * Load a skin part onto the page, do nothing if the part is already loaded.
		 * <storng>Note:</strong> The "editor" part is always auto loaded upon instance creation,
		 * thus this function is mainly used to <strong>lazy load</strong> other part of the skin
		 * which don't have to present until been requested.
		 *
		 * @param {String} part Name of skin part CSS file resides in the skin directory.
		 * @example
		 * // Load the dialog part.
		 * editor.skin.loadPart( "dialog" );
		 */
		loadPart: function( part ) {
			!props ? CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( skinPath + 'skin.js' ), function() {
				loadCss( part );
			}) : loadCss( part );
		},

		/**
		 * Retrieve the real URL of a (CSS) skin part.
		 * @param {String} part
		 */
		getPath: function( part ) {
			return CKEDITOR.getUrl( skinPath + part + '.css' );
		}

	};
})();

/**
 * List of file names, with each one matches a browser agent string cited from
 * {@link CKEDITOR.env}, the corresponding skin part file will be loaded in addition
 * to the "main" skin file for a particular browser.
 *
 * <strong>Note:</strong> For each of the defined skin parts must have
 * the corresponding CSS file with the same name as UA inside of
 * the skin directory.
 *
 * @name CKEDITOR.skin.uaParts
 */

/**
 * A function that support the chameleon (skin color switch) feature, providing
 * the skin colors styles update to be apply in runtime.
 * <strong>Note:</strong> the embedded "$color" variable is to be substituted by a concrete UI color.
 *
 * @function CKEDITOR.skin.chameleon
 * @param {String} editor The editor instance upon color changes impact.
 * @param {String} part Name of the skin part where the color changes take place.
 */
