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

	var name = config[ 0 ],
		path = CKEDITOR.getUrl( config[ 1 ] || ( 'skins/' + name + '/' ) );

	function appendPath( fileNames ) {
		for ( var n = 0; n < fileNames.length; n++ ) {
			fileNames[ n ] = CKEDITOR.getUrl( path + fileNames[ n ] );
		}
	}

	var cssLoaded = {};

	/** @lends CKEDITOR.skin */
	return {
		/**
		 * The skin name.
		 */
		name: name,

		/**
		 * Root path of the skin directory.
		 */
		path: path,

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
			// Avoid reload.
			if ( !cssLoaded[ part ] ) {
				var parts = [ part ];

				if ( part == 'editor' ) {
					var uaParts = CKEDITOR.skinUAParts;

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
		},

		/**
		 * Retrieve the real URL of a (CSS) skin part.
		 * @param {String} part
		 */
		getPath: function( part ) {
			return CKEDITOR.getUrl( path + part + '.css' );
		}

	};
})();
