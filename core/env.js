/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.env} object which contains
 *		environment and browser information.
 */

if ( !CKEDITOR.env ) {
	/**
	 * Environment and browser information.
	 *
	 * @class CKEDITOR.env
	 * @singleton
	 */
	CKEDITOR.env = ( function() {
		var agent = navigator.userAgent.toLowerCase(),
			edge = agent.match( /edge[ \/](\d+.?\d*)/ ),
			trident = agent.indexOf( 'trident/' ) > -1,
			ie = !!( edge || trident );

		var env = {
			/**
			 * Indicates that CKEditor is running in Internet Explorer.
			 *
			 *		if ( CKEDITOR.env.ie )
			 *			alert( 'I\'m running in IE!' );
			 *
			 * **Note:** This property is also set to `true` if CKEditor is running
			 * in {@link #edge Microsoft Edge}.
			 *
			 * @property {Boolean}
			 */
			ie: ie,

			/**
			 * Indicates that CKEditor is running in Microsoft Edge.
			 *
			 *		if ( CKEDITOR.env.edge )
			 *			alert( 'I\'m running in Edge!' );
			 *
			 * See also {@link #ie}.
			 *
			 * @since 4.5.0
			 * @property {Boolean}
			 */
			edge: !!edge,

			/**
			 * Indicates that CKEditor is running in a WebKit-based browser, like Safari,
			 * or Blink-based browser, like Chrome.
			 *
			 *		if ( CKEDITOR.env.webkit )
			 *			alert( 'I\'m running in a WebKit browser!' );
			 *
			 * @property {Boolean}
			 */
			webkit: !ie && ( agent.indexOf( ' applewebkit/' ) > -1 ),

			/**
			 * Indicates that CKEditor is running in Adobe AIR.
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
			 * Indicates that CKEditor is running in a Quirks Mode environment.
			 *
			 *		if ( CKEDITOR.env.quirks )
			 *			alert( 'Nooooo!' );
			 *
			 * Internet Explorer 10 introduced the _New Quirks Mode_, which is similar to the _Quirks Mode_
			 * implemented in other modern browsers and defined in the HTML5 specification. It can be handled
			 * as the Standards mode, so the value of this property will be set to `false`.
			 *
			 * The _Internet Explorer 5 Quirks_ mode which is still available in Internet Explorer 10+
			 * sets this value to `true` and {@link #version} to `7`.
			 *
			 * Read more: [IEBlog](http://blogs.msdn.com/b/ie/archive/2011/12/14/interoperable-html5-quirks-mode-in-ie10.aspx)
			 *
			 * @property {Boolean}
			 */
			quirks: ( document.compatMode == 'BackCompat' && ( !document.documentMode || document.documentMode < 10 ) ),

			/**
			 * Indicates that CKEditor is running in a mobile environemnt.
			 *
			 *		if ( CKEDITOR.env.mobile )
			 *			alert( 'I\'m running with CKEditor today!' );
			 *
			 * @deprecated
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
			 * @deprecated
			 */
			isCustomDomain: function() {
				if ( !this.ie )
					return false;

				var domain = document.domain,
					hostname = window.location.hostname;

				return domain != hostname && domain != ( '[' + hostname + ']' ); // IPv6 IP support (https://dev.ckeditor.com/ticket/5434)
			},

			/**
			 * Indicates that the page is running under an encrypted connection.
			 *
			 *		if ( CKEDITOR.env.secure )
			 *			alert( 'I\'m on SSL!' );
			 *
			 * @returns {Boolean} `true` if the page has an encrypted connection.
			 */
			secure: location.protocol == 'https:'
		};

		/**
		 * Indicates that CKEditor is running in a Gecko-based browser, like
		 * Firefox.
		 *
		 *		if ( CKEDITOR.env.gecko )
		 *			alert( 'I\'m riding a gecko!' );
		 *
		 * @property {Boolean}
		 */
		env.gecko = ( navigator.product == 'Gecko' && !env.webkit && !env.ie );

		/**
		 * Indicates that CKEditor is running in a Blink-based browser like Chrome.
		 *
		 *		if ( CKEDITOR.env.chrome )
		 *			alert( 'I\'m running in Chrome!' );
		 *
		 * @property {Boolean} chrome
		 */

		/**
		 * Indicates that CKEditor is running in Safari (including the mobile version).
		 *
		 *		if ( CKEDITOR.env.safari )
		 *			alert( 'I\'m on Safari!' );
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
			if ( edge ) {
				version = parseFloat( edge[ 1 ] );
			} else if ( env.quirks || !document.documentMode ) {
				version = parseFloat( agent.match( /msie (\d+)/ )[ 1 ] );
			} else {
				version = document.documentMode;
			}

			// Deprecated features available just for backwards compatibility.
			env.ie9Compat = version == 9;
			env.ie8Compat = version == 8;
			env.ie7Compat = version == 7;
			env.ie6Compat = version < 7 || env.quirks;

			/**
			 * Indicates that CKEditor is running in an IE6-like environment, which
			 * includes IE6 itself as well as IE7, IE8 and IE9 in Quirks Mode.
			 *
			 * @deprecated
			 * @property {Boolean} ie6Compat
			 */

			/**
			 * Indicates that CKEditor is running in an IE7-like environment, which
			 * includes IE7 itself and IE8's IE7 Document Mode.
			 *
			 * @deprecated
			 * @property {Boolean} ie7Compat
			 */

			/**
			 * Indicates that CKEditor is running in Internet Explorer 8 on
			 * Standards Mode.
			 *
			 * @deprecated
			 * @property {Boolean} ie8Compat
			 */

			/**
			 * Indicates that CKEditor is running in Internet Explorer 9 on
			 * Standards Mode.
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
		 * For Gecko-based browsers (like Firefox) it contains the revision
		 * number with first three parts concatenated with a padding zero
		 * (e.g. for revision 1.9.0.2 we have 10900).
		 *
		 * For WebKit-based browsers (like Safari and Chrome) it contains the
		 * WebKit build version (e.g. 522).
		 *
		 * For IE browsers, it matches the "Document Mode".
		 *
		 *		if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 6 )
		 *			alert( 'Ouch!' );
		 *
		 * @property {Number}
		 */
		env.version = version;

		/**
		 * Since CKEditor 4.5.0 this property is a blacklist of browsers incompatible with CKEditor. It means that it is
		 * set to `false` only in browsers that are known to be incompatible. Before CKEditor 4.5.0 this
		 * property was a whitelist of browsers that were known to be compatible with CKEditor.
		 *
		 * The reason for this change is the rising fragmentation of the browser market (especially the mobile segment).
		 * It became too complicated to check in which new environments CKEditor is going to work.
		 *
		 * In order to enable CKEditor 4.4.x and below in unsupported environments see the
		 * {@glink guide/dev_unsupported_environments Enabling CKEditor in Unsupported Environments} article.
		 *
		 *		if ( CKEDITOR.env.isCompatible )
		 *			alert( 'Your browser is not known to be incompatible with CKEditor!' );
		 *
		 * @property {Boolean}
		 */
		env.isCompatible =
			// IE 7+ (IE 7 is not supported, but IE Compat Mode is and it is recognized as IE7).
			!( env.ie && version < 7 ) &&
			// Firefox 4.0+.
			!( env.gecko && version < 40000 ) &&
			// Chrome 6+, Safari 5.1+, iOS 5+.
			!( env.webkit && version < 534 );

		/**
		 * Indicates that CKEditor is running in the HiDPI environment.
		 *
		 *		if ( CKEDITOR.env.hidpi )
		 *			alert( 'You are using a screen with high pixel density.' );
		 *
		 * @property {Boolean}
		 */
		env.hidpi = window.devicePixelRatio >= 2;

		/**
		 * Indicates that CKEditor is running in a browser which uses a bogus
		 * `<br>` filler in order to correctly display caret in empty blocks.
		 *
		 * @since 4.3.0
		 * @property {Boolean}
		 */
		env.needsBrFiller = env.gecko || env.webkit || ( env.ie && version > 10 );

		/**
		 * Indicates that CKEditor is running in a browser which needs a
		 * non-breaking space filler in order to correctly display caret in empty blocks.
		 *
		 * @since 4.3.0
		 * @property {Boolean}
		 */
		env.needsNbspFiller = env.ie && version < 11;

		/**
		 * A CSS class that denotes the browser where CKEditor runs and is appended
		 * to the HTML element that contains the editor. It makes it easier to apply
		 * browser-specific styles to editor instances.
		 *
		 *		myDiv.className = CKEDITOR.env.cssClass;
		 *
		 * @property {String}
		 */
		env.cssClass = 'cke_browser_' + ( env.ie ? 'ie' : env.gecko ? 'gecko' : env.webkit ? 'webkit' : 'unknown' );

		if ( env.quirks )
			env.cssClass += ' cke_browser_quirks';

		if ( env.ie )
			env.cssClass += ' cke_browser_ie' + ( env.quirks ? '6 cke_browser_iequirks' : env.version );

		if ( env.air )
			env.cssClass += ' cke_browser_air';

		if ( env.iOS )
			env.cssClass += ' cke_browser_ios';

		if ( env.hidpi )
			env.cssClass += ' cke_hidpi';

		return env;
	} )();
}

// PACKAGER_RENAME( CKEDITOR.env )
// PACKAGER_RENAME( CKEDITOR.env.ie )
