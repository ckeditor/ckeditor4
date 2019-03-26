/* global Promise, ES6Promise */

( function() {
	'use strict';

	CKEDITOR.domReady( function() {
		if ( window.Promise ) {
			CKEDITOR.tools.promise = Promise;
		} else {
			var script = new CKEDITOR.dom.element( 'script' );

			script.setAttributes( {
				type: 'text/javascript',
				src: CKEDITOR.getUrl( 'core/promise/polyfill.js' )
			} );

			if ( script.$.onreadystatechange !== undefined ) {
				script.$.onreadystatechange = function() {
					var readyState = script.$.readyState;

					if ( readyState === 'loaded' || readyState === 'complete' ) {
						CKEDITOR.tools.promise = ES6Promise;
					}
				};
			} else {
				script.$.onload = script.$.onreadystatechange = function() {
					CKEDITOR.tools.promise = ES6Promise;
				};
			}

			CKEDITOR.document.getBody().append( script );
		}
	} );

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
	 * @property promise
	 * @param {Function} resolver
	 * @member CKEDITOR.tools
	 * @returns {Promise}
	 */

} )();
