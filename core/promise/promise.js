/* global Promise, ES6Promise */

( function() {
	'use strict';

	var isPolyfillNeeded = CKEDITOR.env.ie && !CKEDITOR.env.edge;

	if ( isPolyfillNeeded ) {
		CKEDITOR.loader.load( 'promise/polyfill' );
	}

	/**
	 * Creates [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
	 * object representing asynchronous operation.
	 *
	 * This helper function uses [ES6-Promise](https://github.com/stefanpenner/es6-promise) as a polyfill for Internet Explorer.
	 * Note that the polyfill won't be loaded if a browser supports native Promise object.
	 *
	 * See [MDN Promise documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for
	 * more details how to work with promises.
	 *
	 * @param {Function} resolver
	 * @member CKEDITOR.tools
	 * @returns {Promise}
	 */
	CKEDITOR.tools.promise = function( resolver ) {
		return isPolyfillNeeded ? new ES6Promise( resolver ) : new Promise( resolver );
	};

} )();
