/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

// Compressed version of core/ckeditor_base.js. See original for instructions.
/*jsl:ignore*/
if ( !window.CKEDITOR )
	window.CKEDITOR = function() {
	var b = {
		timestamp: "", version: "%VERSION%", revision: "%REV%", _: { pending: [] },
		status: "unloaded", basePath: function() {
			var a = window.CKEDITOR_BASEPATH || ""; if ( !a )
				for ( var d = document.getElementsByTagName( "script" ), c = 0; c < d.length; c++ ) {
				var e = d[ c ].src.match( /(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i );
				if ( e ) {
					a = e[ 1 ];
					break
				}
			}
			if ( a.indexOf( ":/" ) == -1 )
				a = a.indexOf( "/" ) === 0 ? location.href.match( /^.*?:\/\/[^\/]*/ )[ 0 ] + a : location.href.match( /^[^\?]*\/(?:)/ )[ 0 ] + a;
			if ( !a )
				throw 'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
			return a
		}(), getUrl: function( a ) {
			if ( a.indexOf( ":/" ) == -1 && a.indexOf( "/" ) !== 0 )
				a = this.basePath + a;
			if ( this.timestamp && a.charAt( a.length - 1 ) != "/" && !/[&?]t=/.test( a ) )
				a += ( a.indexOf( "?" ) >= 0 ? "&" : "?" ) + "t=" + this.timestamp;
			return a
		} },
		f = window.CKEDITOR_GETURL; if ( f ) {
		var g = b.url;
		b.url = function( a ) {
			return f.call( b, a ) || g.call( b, a )
		}
	}
	return b
}();
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
