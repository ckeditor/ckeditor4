
/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview The "notificationaggregator" plugin.
 *
 */

( function() {

	'use strict';

	window.aggr = null;

	CKEDITOR.plugins.add( 'notificationaggregator', {
		requires: 'notification',
		init: function( editor ) {
			// We need to use timeout, otherwise we would get an exception, about
			// undefined 'getClientRect' method of some ui element. This is due to
			// uninited UI.
			window.setTimeout( function() {
				window.aggr = new Aggregator( editor, 'fo', 'ba' );
				var cancel = window.aggr.createThread();
			}, 20 );
		}
	} );

	/**
	 * This type helps to create a notification where progress of a multiple entities is
	 * tracked.
	 *
	 *
	 */
	function Aggregator( editor, message, singleEntryMessage ) {
		this.editor = editor;
		/**
		 * Array of unique numbers generated with {@link #createThread} calls. If an id is
		 * removed from the array, then we consider it completed.
		 *
		 * @private
		 */
		this._threads = [];
	}

	Aggregator.prototype = {
		/**
		 * Notification created by the aggregator.
		 *
		 * It's modified as threads are being closed with callback returned by the
		 * {@link #createThread}.
		 *
		 * @type {CKEDITOR.plugins.notification}
		 */
		notification: null,

		createThread: function() {
			var initialThread = !this._threads.length,
				ret;

			if ( initialThread ) {
				// It's a first call.
				var notifOptions = this._getNotificationOptions();
				//notifOptions.message = 'foobar';
				this.notification = new CKEDITOR.plugins.notification( this.editor, notifOptions );
			} else {
			}

			ret = this._increaseThreads();

			if ( initialThread ) {
				this.notification.show();
			}

			return ret;
		},

		_updateNotification: function() {
		},

		/**
		 * Increase threads count, and returns callback for created thread entry.
		 *
		 * @returns {Function}
		 */
		_increaseThreads: function() {
			var id = CKEDITOR.tools.getNextId(),
				threads = this._threads;

			threads.push( id );

			return function() {
				var index = CKEDITOR.tools.indexOf( threads, id );
				// One thread state can be finished only once.
				if ( index < 0 ) {
					return;
				}

				threads.splice( index, 1 );
			};
		},

		/**
		 * Returns options object used for notification.
		 *
		 * For more details see {@link CKEDITOR.plugins.notification#update}.
		 *
		 * @private
		 * @returns {Object}
		 */
		_getNotificationOptions: function() {
			return {};
		},

		/**
		 * Called when all threads are done.
		 */
		finish: function() {
		}
	};

	// Expose Aggregator type.
	CKEDITOR.plugins.notificationaggregator = Aggregator;
} )();
