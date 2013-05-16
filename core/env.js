/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.env} object, which constains
 *		environment and browser information.
 */

if ( !CKEDITOR.env ) {
	/**
	 * Environment and browser information.
	 *
	 * @class CKEDITOR.env
	 * @singleton
	 */
	CKEDITOR.env = (function() {
		var agent = navigator.userAgent.toLowerCase();
		var opera = window.opera;

		var env = {
			/**
			 * Indicates that CKEditor is running on Internet Explorer.
			 *
			 *		if ( CKEDITOR.env.ie )
			 *			alert( 'I\'m on IE!' );
			 *
			 * @property {Boolean}
			 */
			ie: eval( '/*@cc_on!@*/false' ),
			// Use eval to preserve conditional comment when compiling with Google Closure Compiler (#93).

			/**
			 * Indicates that CKEditor is running on Opera.
			 *
			 *		if ( CKEDITOR.env.opera )
			 *			alert( 'I\'m on Opera!' );
			 *
			 * @property {Boolean}
			 */
			opera: ( !!opera && opera.version ),

			/**
			 * Indicates that CKEditor is running on a WebKit based browser, like Safari.
			 *
			 *		if ( CKEDITOR.env.webkit )
			 *			alert( 'I\'m on WebKit!' );
			 *
			 * @property {Boolean}
			 */
			webkit: ( agent.indexOf( ' applewebkit/' ) > -1 ),

			/**
			 * Indicates that CKEditor is running on Adobe AIR.
			 *
			 *		if ( CKEDITOR.env.air )
			 *			alert( 'I\'m on AIR!' );
			 *
			 * @property {Boolean}
			 */
			air: ( agent.indexOf( ' adobeair/' ) > -1 ),

			/**
			 * Indicates that CKEditor is running on Macintosh.
			 *
			 *		if ( CKEDITOR.env.mac )
			 *			alert( 'I love apples!'' );
			 *
			 * @property {Boolean}
			 */
			mac: ( agent.indexOf( 'macintosh' ) > -1 ),

			/**
			 * Indicates that CKEditor is running on a quirks mode environemnt.
			 *
			 *		if ( CKEDITOR.env.quirks )
			 *			alert( 'Nooooo!' );
			 *
			 * @property {Boolean}
			 */
			quirks: ( document.compatMode == 'BackCompat' ),

			/**
			 * Indicates that CKEditor is running on a mobile like environemnt.
			 *
			 *		if ( CKEDITOR.env.mobile )
			 *			alert( 'I\'m running with CKEditor today!' );
			 *
			 * @property {Boolean}
			 */
			mobile: ( agent.indexOf( 'mobile' ) > -1 ),

			/**
			 * Indicates that CKEditor is running on Apple iPhone/iPad/iPod devices.
			 *
			 *		if ( CKEDITOR.env.iOS )
			 *			alert( 'I like little apples!' );
			 *
			 * @property {Boolean}
			 */
			iOS: /(ipad|iphone|ipod)/.test( agent ),

			/**
			 * Indicates that the browser has a custom domain enabled. This has
			 * been set with `document.domain`.
			 *
			 *		if ( CKEDITOR.env.isCustomDomain() )
			 *			alert( 'I\'m in a custom domain!' );
			 *
			 * @returns {Boolean} `true` if a custom domain is enabled.
			 */
			isCustomDomain: function() {
				if ( !this.ie )
					return false;

				var domain = document.domain,
					hostname = window.location.hostname;

				return domain != hostname && domain != ( '[' + hostname + ']' ); // IPv6 IP support (#5434)
			},

			/**
			 * Indicates that page is running under an encrypted connection.
			 *
			 *		if ( CKEDITOR.env.secure )
			 *			alert( 'I\'m in SSL!' );
			 *
			 * @returns {Boolean} `true` if the page has an encrypted connection.
			 */
			secure: location.protocol == 'https:'
		};

		/**
		 * Indicates that CKEditor is running on a Gecko based browser, like
		 * Firefox.
		 *
		 *		if ( CKEDITOR.env.gecko )
		 *			alert( 'I\'m riding a gecko!' );
		 *
		 * @property {Boolean}
		 */
		env.gecko = ( navigator.product == 'Gecko' && !env.webkit && !env.opera );

		/**
		 * Indicates that CKEditor is running on Chrome.
		 *
		 *		if ( CKEDITOR.env.chrome )
		 *			alert( 'I\'m riding Chrome!' );
		 *
		 * @property {Boolean} chrome
		 */

		 /**
		 * Indicates that CKEditor is running on Safari (including mobile version).
		 *
		 *		if ( CKEDITOR.env.safari )
		 *			alert( 'I\'m riding Safari!' );
		 *
		 * @property {Boolean} safari
		 */
		if ( env.webkit ) {
			if ( agent.indexOf( 'chrome' ) > -1 )
				env.chrome = true;
			else
				env.safari = true;
		}

		var version = 0;

		// Internet Explorer 6.0+
		if ( env.ie ) {
			// We use env.version for feature detection, so set it properly.
			if ( env.quirks || !document.documentMode )
				version = parseFloat( agent.match( /msie (\d+)/ )[ 1 ] );
			else
				version = document.documentMode;

			// Deprecated features available just for backwards compatibility.
			env.ie9Compat = version == 9;
			env.ie8Compat = version == 8;
			env.ie7Compat = version == 7;
			env.ie6Compat = version < 7 || env.quirks;

			/**
			 * Indicates that CKEditor is running on an IE6-like environment, which
			 * includes IE6 itself and IE7 and IE8 quirks mode.
			 *
			 * @deprecated
			 * @property {Boolean} ie6Compat
			 */

			/**
			 * Indicates that CKEditor is running on an IE7-like environment, which
			 * includes IE7 itself and IE8's IE7 document mode.
			 *
			 * @deprecated
			 * @property {Boolean} ie7Compat
			 */

			/**
			 * Indicates that CKEditor is running on Internet Explorer 8 on
			 * standards mode.
			 *
			 * @deprecated
			 * @property {Boolean} ie8Compat
			 */

			/**
			 * Indicates that CKEditor is running on Internet Explorer 9's standards mode.
			 *
			 * @deprecated
			 * @property {Boolean} ie9Compat
			 */
		}

		// Gecko.
		if ( env.gecko ) {
			var geckoRelease = agent.match( /rv:([\d\.]+)/ );
			if ( geckoRelease ) {
				geckoRelease = geckoRelease[ 1 ].split( '.' );
				version = geckoRelease[ 0 ] * 10000 + ( geckoRelease[ 1 ] || 0 ) * 100 + ( geckoRelease[ 2 ] || 0 ) * 1;
			}
		}

		// Opera 9.50+
		if ( env.opera )
			version = parseFloat( opera.version() );

		// Adobe AIR 1.0+
		// Checked before Safari because AIR have the WebKit rich text editor
		// features from Safari 3.0.4, but the version reported is 420.
		if ( env.air )
			version = parseFloat( agent.match( / adobeair\/(\d+)/ )[ 1 ] );

		// WebKit 522+ (Safari 3+)
		if ( env.webkit )
			version = parseFloat( agent.match( / applewebkit\/(\d+)/ )[ 1 ] );

		/**
		 * Contains the browser version.
		 *
		 * For gecko based browsers (like Firefox) it contains the revision
		 * number with first three parts concatenated with a padding zero
		 * (e.g. for revision 1.9.0.2 we have 10900).
		 *
		 * For webkit based browser (like Safari and Chrome) it contains the
		 * WebKit build version (e.g. 522).
		 *
		 * For IE browsers, it matches the "document mode".
		 *
		 *		if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 6 )
		 *			alert( 'Ouch!' );
		 *
		 * @property {Number}
		 */
		env.version = version;

		/**
		 * Indicates that CKEditor is running on a compatible browser.
		 *
		 *		if ( CKEDITOR.env.isCompatible )
		 *			alert( 'Your browser is pretty cool!' );
		 *
		 * @property {Boolean}
		 */
		env.isCompatible =
			// White list of mobile devices that supports.
			env.iOS && version >= 534 ||
			!env.mobile && (
				( env.ie && version > 6 ) ||
				( env.gecko && version >= 10801 ) ||
				( env.opera && version >= 9.5 ) ||
				( env.air && version >= 1 ) ||
				( env.webkit && version >= 522 ) ||
				false
			);

		/**
		 * The CSS class to be appended on the main UI containers, making it
		 * easy to apply browser specific styles to it.
		 *
		 *		myDiv.className = CKEDITOR.env.cssClass;
		 *
		 * @property {String}
		 */
		env.cssClass = 'cke_browser_' + ( env.ie ? 'ie' : env.gecko ? 'gecko' : env.opera ? 'opera' : env.webkit ? 'webkit' : 'unknown' );

		if ( env.quirks )
			env.cssClass += ' cke_browser_quirks';

		if ( env.ie ) {
			env.cssClass += ' cke_browser_ie' + ( env.quirks || env.version < 7 ? '6' : env.version );

			if ( env.quirks )
				env.cssClass += ' cke_browser_iequirks';
		}

		if ( env.gecko ) {
			if ( version < 10900 )
				env.cssClass += ' cke_browser_gecko18';
			else if ( version <= 11000 )
				env.cssClass += ' cke_browser_gecko19';
		}

		if ( env.air )
			env.cssClass += ' cke_browser_air';

		return env;
	})();
}

// PACKAGER_RENAME( CKEDITOR.env )
// PACKAGER_RENAME( CKEDITOR.env.ie )
