
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
		}
	} );

	/**
	 * This type helps to create a notification where progress of a multiple entities is
	 * tracked.
	 *
	 * Once finished the notification state will be reset.
	 */
	function Aggregator( editor, message ) {
		this.editor = editor;
		/**
		 * Array of unique numbers generated with {@link #createThread} calls. If an id is
		 * removed from the array, then we consider it completed.
		 *
		 * @private
		 */
		this._threads = [];

		/**
		 * A template for message.
		 *
		 * It takes gets variables:
		 *
		 * * **current** - A count of completed threads.
		 * * **max** - The maximal count of threads.
		 */
		this._message = new CKEDITOR.template( String( message ) );
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

		/**
		 * Maximal count of threads before {@Link #finish} was called.
		 *
		 * @private
		 */
		_maxThreadsCount: 0,

		createThread: function() {
			var initialThread = !this.notification,
				ret;

			if ( initialThread ) {
				// It's a first call.
				var notifOptions = this._getNotificationOptions();
				this.notification = new CKEDITOR.plugins.notification( this.editor, notifOptions );
			}

			ret = this._increaseThreads();

			// Update the contents.
			this._updateNotification();

			if ( initialThread ) {
				this.notification.show();
			}

			return ret;
		},

		/**
		 * @returns {Boolean} Returns `true` if all the notification threads are done
		 * (or there are no threads at all).
		 */
		isFinished: function() {
			return this._threads.length === 0;
		},

		/**
		 * Called when all threads are done. Default implementation will hide the notification.
		 */
		finished: function() {
			this._reset();
			this.notification.hide();
			this.notification = null;
		},

		_updateNotification: function() {
			var maxCount = this._maxThreadsCount,
				currentCount = maxCount - this._threads.length,
				msg;

			if ( this.isFinished() ) {
				// All threads loaded, loading is finished.
				this.finished();
			} else {
				// Generate a message.
				msg = this._message.output( {
					current: currentCount,
					max: maxCount
				} );

				this.notification.update( {
					message: msg,
					progress: Number( currentCount / maxCount )
				} );
			}
		},

		/**
		 * Increase threads count, and returns callback for created thread entry.
		 *
		 * @returns {Function}
		 */
		_increaseThreads: function() {
			var id = CKEDITOR.tools.getNextId(),
				that = this,
				threads = that._threads;

			threads.push( id );

			that._maxThreadsCount = threads.length;

			return function() {
				var index = CKEDITOR.tools.indexOf( threads, id );
				// One thread state can be finished only once.
				if ( index < 0 ) {
					return;
				}

				threads.splice( index, 1 );
				// State changed so we need to call _updateNotification.
				that._updateNotification();
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
			return {
				type: 'progress'
			};
		},

		/**
		 * Resets the internal state of aggregator.
		 *
		 * @private
		 */
		_reset: function() {
			this._maxThreadsCount = 0;
			this._threads = [];
		}
	};

	// Expose Aggregator type.
	CKEDITOR.plugins.notificationaggregator = Aggregator;
} )();
