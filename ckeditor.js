/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

// Compressed version of core/ckeditor_base.js. See original for instructions.
/*jsl:ignore*/
if ( !window.CKEDITOR ) {
	window.CKEDITOR = (function() {
		var b = {
			timestamp: "", version: "%VERSION%", revision: "%REV%", _: { pending: [] },
			status: "unloaded", basePath: (function() {
				var g = window.CKEDITOR_BASEPATH || "";
				if ( !g ) {
					var d = document.getElementsByTagName( "script" );
					for ( var f = 0; f < d.length; f++ ) {
						var e = d[ f ].src.match( /(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i );
						if ( e ) {
							g = e[ 1 ];
							break
						}
					}
				}
				if ( g.indexOf( ":/" ) == -1 ) {
					if ( g.indexOf( "/" ) === 0 ) {
						g = location.href.match( /^.*?:\/\/[^\/]*/ )[ 0 ] + g
					} else {
						g = location.href.match( /^[^\?]*\/(?:)/ )[ 0 ] + g
					}
				}
				if ( !g ) {
					throw 'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.'
				}
				return g
			})(), getUrl: function( d ) {
				if ( d.indexOf( ":/" ) == -1 && d.indexOf( "/" ) !== 0 ) {
					d = this.basePath + d
				}
				if ( this.timestamp && d.charAt( d.length - 1 ) != "/" && !( /[&?]t=/ ).test( d ) ) {
					d += ( d.indexOf( "?" ) >= 0 ? "&" : "?" ) + "t=" + this.timestamp
				}
				return d
			},
			domReady: (function() {
				var d = [];

				function e() {
					try {
						if ( document.addEventListener ) {
							document.removeEventListener( "DOMContentLoaded", e, false )
						} else {
							if ( document.attachEvent ) {
								document.detachEvent( "onreadystatechange", e )
							}
						}
					} catch ( g ) {}
					var f;
					while ( f = d.shift() ) {
						f()
					}
				}
				return function( g ) {
					d.push( g );
					if ( document.readyState === "complete" ) {
						setTimeout( e, 1 )
					}
					if ( d.length != 1 ) {
						return
					}
					if ( document.addEventListener ) {
						document.addEventListener( "DOMContentLoaded", e, false );
						window.addEventListener( "load", e, false )
					} else {
						if ( document.attachEvent ) {
							document.attachEvent( "onreadystatechange", e );
							window.attachEvent( "onload", e );
							var f = false;
							try {
								f = window.frameElement == null
							} catch ( h ) {}
							if ( document.documentElement.doScroll && f ) {
								(function i() {
									try {
										document.documentElement.doScroll( "left" )
									} catch ( j ) {
										setTimeout( i, 1 );
										return
									}
									e()
								})()
							}
						}
					}
				}
			})() }; var a = window.CKEDITOR_GETURL; if ( a ) {
			var c = b.url;
			b.url = function( d ) {
				return a.call( b, d ) || c.call( b, d )
			}
		}
		return b
	})()
};
/*jsl:end*/

if ( CKEDITOR.loader )
	CKEDITOR.loader.load( 'ckeditor' );
else {
	// Set the script name to be loaded by the loader.
	CKEDITOR._autoLoad = 'ckeditor';

	// Include the loader script.
	if ( document.body && ( !document.readyState || document.readyState == 'complete' ) ) {
		var script = document.createElement( 'script' );
		script.type = 'text/javascript';
		script.src = CKEDITOR.getUrl( 'core/loader.js' );
		document.body.appendChild( script );
	} else {
		document.write( '<script type="text/javascript" src="' + CKEDITOR.getUrl( 'core/loader.js' ) + '"></script>' );
	}
}

/**
 * The skin to load for all created instances, it may be the name of the skin
 * folder inside the editor installation path, or the name and the path separated
 * by a comma.<br>
 * <br>
 * <strong>Note:</strong> This is a global configuration that applies to all instances.
 * @name CKEDITOR.editorSkin
 * @type String
 * @example
 * CKEDITOR.editorSkin = 'kama';
 * @example
 * CKEDITOR.editorSkin = 'myskin,/customstuff/myskin/';
 */
CKEDITOR.skinName = 'kama';
