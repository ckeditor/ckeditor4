/* bender-tags: editor,unit */

bender.test(
{
	// Return a set of css files for the specified skin part.
	cssFileToCheck: function( part ) {
		var base = CKEDITOR.skin.path();

		// Note: Below code copied from skin.js#getCssPath,
		// maintenance required when source is updated.

		var env = CKEDITOR.env;
		var uas = CKEDITOR.skin[ 'ua_' + part ].split( ',' );
		uas = uas.sort( function( a, b ) { return a > b ? -1 : 1; } );

		for ( var i = 0, ua ; i < uas.length ; i++ ) {
			ua = uas[ i ];

			if ( env.ie ) {
				if ( ( ua.replace( /^ie/, '' ) == env.version ) ||
					 ( env.quirks && ua == 'iequirks' ) )
					ua = 'ie';
			}

			if ( env[ ua ] ) {
				part += '_' + uas[ i ];
				break;
			}
		}

		// End of copied.

		return CKEDITOR.getUrl( base + part + '.css' );
	},

	// Check through all attached stylesheets to see if all skins parts are loaded.
	checkPartLoaded : function( part, callback ) {
		var css = this.cssFileToCheck( part );

		setTimeout( function checkLoaded() {
			for ( var i = 0, sheet, index; i < document.styleSheets.length; i++ ) {
				sheet = document.styleSheets[ i ];
				if ( sheet.href && sheet.href == css ) {
					callback();
					return;
				}
			}

			setTimeout( checkLoaded, 100 );
		}, 0 );
	},

	'load skin parts': function() {
		var tc = this;
		var skin = CKEDITOR.skin;

		var editor = new CKEDITOR.editor();
		editor.on( 'loaded', function() {
			// Make sure css parts are all loaded.
			tc.checkPartLoaded( 'editor', function() {
				resume( function() {
						// Load one other skin part.
						skin.loadPart( 'dialog' );
						tc.checkPartLoaded( 'dialog', function() {
							// Success, if we reach this point.
							assert.isTrue( true );
							resume();
						} );
						wait();
					} );
			} );
		} );

		wait();
	}

} );