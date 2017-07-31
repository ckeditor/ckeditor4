/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.scriptLoader} object, used to load scripts
 *		asynchronously.
 */

/**
 * Load scripts asynchronously.
 *
 * @class
 * @singleton
 */
CKEDITOR.scriptLoader = ( function() {
	var uniqueScripts = {},
		waitingList = {};

	return {
		/**
		 * This method has been hacked to prevent dynamic script loading
         *
         * Loads one or more external script checking if not already loaded
		 * previously by this function.
		 *
		 *		CKEDITOR.scriptLoader.load( '/myscript.js' );
		 *
		 *		CKEDITOR.scriptLoader.load( '/myscript.js', function( success ) {
		 *			// Alerts true if the script has been properly loaded.
		 *			// HTTP error 404 should return false.
		 *			alert( success );
		 *		} );
		 *
		 *		CKEDITOR.scriptLoader.load( [ '/myscript1.js', '/myscript2.js' ], function( completed, failed ) {
		 *			alert( 'Number of scripts loaded: ' + completed.length );
		 *			alert( 'Number of failures: ' + failed.length );
		 *		} );
		 *
		 * @param {String/Array} scriptUrl One or more URLs pointing to the
		 * scripts to be loaded.
		 * @param {Function} [callback] A function to be called when the script
		 * is loaded and executed. If a string is passed to `scriptUrl`, a
		 * boolean parameter is passed to the callback, indicating the
		 * success of the load. If an array is passed instead, two arrays
		 * parameters are passed to the callback - the first contains the
		 * URLs that have been properly loaded and the second the failed ones.
		 * @param {Object} [scope] The scope (`this` reference) to be used for
		 * the callback call. Defaults to {@link CKEDITOR}.
		 */
		load: function( scriptUrl, callback, scope ) {
			var isString = ( typeof scriptUrl == 'string' );

			if ( isString )
				scriptUrl = [ scriptUrl ];

			if ( !scope )
				scope = CKEDITOR;

			var completed = [],
				failed = [];

			var doCallback = function( success ) {
					if ( callback ) {
						if ( isString )
							callback.call( scope, success );
						else
							callback.call( scope, completed, failed );
					}
				};

            doCallback( true );
		},

		/**
		 * Loads a script in a queue, so only one is loaded at the same time.
		 *
		 * @since 4.1.2
		 * @param {String} scriptUrl URL pointing to the script to be loaded.
		 * @param {Function} [callback] A function to be called when the script
		 * is loaded and executed. A boolean parameter is passed to the callback,
		 * indicating the success of the load.
		 *
		 * @see CKEDITOR.scriptLoader#load
		 */
		queue: ( function() {
			var pending = [];

			// Loads the very first script from queue and removes it.
			function loadNext() {
				var script;

				if ( ( script = pending[ 0 ] ) )
					this.load( script.scriptUrl, script.callback, CKEDITOR, 0 );
			}

			return function( scriptUrl, callback ) {
				var that = this;

				// This callback calls the standard callback for the script
				// and loads the very next script from pending list.
				function callbackWrapper() {
					callback && callback.apply( this, arguments );

					// Removed the just loaded script from the queue.
					pending.shift();

					loadNext.call( that );
				}

				// Let's add this script to the queue
				pending.push( { scriptUrl: scriptUrl, callback: callbackWrapper } );

				// If the queue was empty, then start loading.
				if ( pending.length == 1 )
					loadNext.call( this );
			};
		} )()
	};
} )();
