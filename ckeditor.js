/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

// Compressed version of core/ckeditor_base.js. See original for instructions.
/*jsl:ignore*/
window.CKEDITOR || ( window.CKEDITOR = function() {
	var e = {
		timestamp: "", version: "%VERSION%", revision: "%REV%", rnd: Math.floor( 900 * Math.random() ) + 100, _: { pending: [] },
		status: "unloaded", basePath: function() {
			var a = window.CKEDITOR_BASEPATH || ""; if ( !a )
				for ( var c = document.getElementsByTagName( "script" ), b = 0; b < c.length; b++ ) {
				var d = c[ b ].src.match( /(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i );
				if ( d ) {
					a = d[ 1 ];
					break
				}
			} - 1 == a.indexOf( ":/" ) && ( a = 0 === a.indexOf( "/" ) ? location.href.match( /^.*?:\/\/[^\/]*/ )[ 0 ] + a : location.href.match( /^[^\?]*\/(?:)/ )[ 0 ] + a );
			if ( !a )
				throw 'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
			return a
		}(), getUrl: function( a ) {
			-1 == a.indexOf( ":/" ) && 0 !== a.indexOf( "/" ) && ( a = this.basePath + a );
			this.timestamp && "/" != a.charAt( a.length - 1 ) && !/[&?]t=/.test( a ) && ( a += ( 0 <= a.indexOf( "?" ) ? "&" : "?" ) + "t=" + this.timestamp );
			return a
		},
		domReady: function() {
			function a() {
				try {
					document.addEventListener ? document.removeEventListener( "DOMContentLoaded", a, !1 ) : document.attachEvent && document.detachEvent( "onreadystatechange", a )
				} catch ( b ) {}
				for ( var d; d = c.shift(); )
					d()
			}
			var c = [];
			return function( b ) {
				c.push( b );
				"complete" === document.readyState && setTimeout( a, 1 );
				if ( 1 == c.length )
					if ( document.addEventListener )
					document.addEventListener( "DOMContentLoaded", a, !1 ), window.addEventListener( "load", a, !1 );
				else if ( document.attachEvent ) {
					document.attachEvent( "onreadystatechange", a );
					window.attachEvent( "onload", a );
					b = !1;
					try {
						b = null == window.frameElement
					} catch ( d ) {}
					document.documentElement.doScroll && b &&
					function g() {
						try {
							document.documentElement.doScroll( "left" )
						} catch ( b ) {
							setTimeout( g, 1 );
							return
						}
						a()
					}()
				}
			}
		}() },
		f = window.CKEDITOR_GETURL; if ( f ) {
		var h = e.url;
		e.url = function( a ) {
			return f.call( e, a ) || h.call( e, a )
		}
	}
	return e
}() );
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
