/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* global Promise, ES6Promise */

( function() {
	'use strict';

	if ( window.Promise ) {
		CKEDITOR.tools.promise = Promise;
	} else {
		var polyfillURL = CKEDITOR.getUrl( 'vendor/promise.js' ),
			isAmdEnv = typeof window.define === 'function' && window.define.amd && typeof window.require === 'function';

		if ( isAmdEnv ) {
			return window.require( [ polyfillURL ], function( Promise ) {
				CKEDITOR.tools.promise = Promise;
			} );
		}

		CKEDITOR.scriptLoader.load( polyfillURL, function( success ) {
			if ( !success ) {
				return CKEDITOR.error( 'no-vendor-lib', {
					path: polyfillURL
				} );
			}

			if ( typeof window.ES6Promise !== 'undefined' ) {
				return CKEDITOR.tools.promise = ES6Promise;
			}
		} );
	}

	/**
	 * An alias for the [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
	 * object representing an asynchronous operation.
	 *
	 * It uses the native `Promise` browser implementation if it is available. For older browsers with lack of `Promise` support,
	 * the [`ES6-Promise`](https://github.com/stefanpenner/es6-promise) polyfill is used.
	 * See the [Promise Browser Compatibility table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Browser_compatibility)
	 * to learn more.
	 *
	 * Refer to [MDN Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) guide for
	 * more details on how to work with promises.
	 *
	 * **NOTE:** `catch` and `finally` are reserved keywords in IE<9 browsers. Use bracket notation instead:
	 *
	 * ```js
	 * promise[ 'catch' ]( function( err ) {
	 * 		// ...
	 * } );
	 *
	 * promise[ 'finally' ]( function() {
	 *		// ...
	 * } );
	 * ```
	 *
	 * @since 4.12.0
	 * @class CKEDITOR.tools.promise
	 */

	/**
	 * Creates a new `Promise` instance.
	 *
	 * ```js
	 *	new CKEDITOR.tools.promise( function( resolve, reject ) {
	 *		setTimeout( function() {
	 *			var timestamp;
	 *			try {
	 *				timestamp = ( new Date() ).getTime();
	 *			} catch ( e ) {
	 *				reject( e );
	 *			}
	 *			resolve( timestamp );
	 *		}, 5000 );
	 *	} );
	 * ```
	 *
	 * @param {Function} resolver
	 * @param {Function} resolver.resolve
	 * @param {Function} resolver.reject
	 * @constructor
	 */

} )();
