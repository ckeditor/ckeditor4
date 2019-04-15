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
		CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( 'vendor/promise.js' ), function( success ) {
			if ( success ) {
				CKEDITOR.tools.promise = ES6Promise;
			} else {
				CKEDITOR.error( 'no-vendor-lib', {
					path: 'vendor/promise.js'
				} );
			}
		} );
	}

	/**
	 * Alias for [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
	 * object representing asynchronous operation.
	 *
	 * Uses [ES6-Promise](https://github.com/stefanpenner/es6-promise) as a polyfill.
	 * Note that the polyfill won't be loaded if a browser supports native Promise object.
	 *
	 * See [MDN Promise documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for
	 * more details how to work with promises.
	 *
	 * @since 4.12.0
	 * @class CKEDITOR.tools.promise
	 */

	/**
	 * Creates a new instance of Promise.
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
