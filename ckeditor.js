/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// Compressed version of core/ckeditor_base.js. See original for instructions.
/* jshint ignore:start */
/* jscs:disable */
window.CKEDITOR || ( window.CKEDITOR = ( function() {
	var e = /(^|.*[\\\/])ckeditor\.js(?:\?.*|;.*)?$/i,b = { timestamp: '',version: '%VERSION%',revision: '%REV%',rnd: Math.floor( 900 * Math.random() ) + 100,_: { pending: [],basePathSrcPattern: e },status: 'unloaded',basePath: ( function() {
			var a = window.CKEDITOR_BASEPATH || '';if ( !a ) {
				for ( var b = document.getElementsByTagName( 'script' ),c = 0;c < b.length;c++ ) {
					var f = b[c].src.match( e );if ( f ) {
						a = f[1];break;
					}
				}
			}a.indexOf( ':/' ) == -1 && a.slice( 0,2 ) != '//' && ( a = a.indexOf( '/' ) === 0 ? location.href.match( /^.*?:\/\/[^\/]*/ )[0] +
a : location.href.match( /^[^\?]*\/(?:)/ )[0] + a );if ( !a ) {
				throw 'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
			} return a;
		} )(),getUrl: function( a ) {
			a.indexOf( ':/' ) == -1 && a.indexOf( '/' ) !== 0 && ( a = this.basePath + a );this.timestamp && a.charAt( a.length - 1 ) != '/' && !/[&?]t=/.test( a ) && ( a += ( a.indexOf( '?' ) >= 0 ? '&' : '?' ) + 't=' + this.timestamp );return a;
		},domReady: ( function() {
			function a() {
				try {
					document.addEventListener ? ( document.removeEventListener( 'DOMContentLoaded',
						a,!1 ),b() ) : document.attachEvent && document.readyState === 'complete' && ( document.detachEvent( 'onreadystatechange',a ),b() );
				} catch ( f ) {}
			} function b() {
				for ( var a;a = c.shift(); ) {
					a();
				}
			} var c = [];return function( b ) {
				c.push( b );document.readyState === 'complete' && setTimeout( a,1 );if ( c.length == 1 ) {
					if ( document.addEventListener ) {
						document.addEventListener( 'DOMContentLoaded',a,!1 ),window.addEventListener( 'load',a,!1 );
					} else if ( document.attachEvent ) {
						document.attachEvent( 'onreadystatechange',a );window.attachEvent( 'onload',a );b = !1;try {
							b =
!window.frameElement;
						} catch ( e ) {} if ( document.documentElement.doScroll && b ) {
							var d = function() {
								try {
									document.documentElement.doScroll( 'left' );
								} catch ( b ) {
									setTimeout( d,1 );return;
								}a();
							};d();
						}
					}
				}
			};
		} )() },d = window.CKEDITOR_GETURL;if ( d ) {
		var g = b.getUrl;b.getUrl = function( a ) {
			return d.call( b,a ) || g.call( b,a );
		};
	} return b;
} )() );
/* jscs:enable */
/* jshint ignore:end */

if ( CKEDITOR.loader ) {
	CKEDITOR.loader.load( 'ckeditor' );
} else {
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
 * by a comma.
 *
 * **Note:** This is a global configuration that applies to all instances.
 *
 *		CKEDITOR.skinName = 'moono';
 *
 *		CKEDITOR.skinName = 'myskin,/customstuff/myskin/';
 *
 * @cfg {String} [skinName='moono-lisa']
 * @member CKEDITOR
 */
CKEDITOR.skinName = 'moono-lisa';
