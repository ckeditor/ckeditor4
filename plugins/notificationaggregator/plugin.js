
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

	CKEDITOR.plugins.add( 'notificationaggregator', {
		requires: 'notification'
	} );

	/**
	 * This type helps to create a notification where progress of a multiple entities is
	 * tracked.
	 *
	 * Aggregator is supposed to work with multiple tasks. Once all the tasks are closed, it
	 * means that the whole process is done.
	 *
	 * Once finished the notification state will be reset.
	 *
	 * Simple usage case:
	 *
	 *		// Create new notification aggregator instance.
	 *		var aggregator = new CKEDITOR.plugins.notificationaggregator( editor, 'Loading process, step {current} of {max}...' );
	 *
	 *		// Create 3 tasks.
	 *		var tasks = [
	 *			aggregator.createTask(),
	 *			aggregator.createTask(),
	 *			aggregator.createTask()
	 *		];
	 *		// At this point notification has a message: "Loading process, step 0 of 3...".
	 *
	 *		// Let's close first one immediately.
	 *		tasks[ 0 ](); // "Loading process, step 1 of 3...".
	 *
	 *		// One second later message will be "Loading process, step 2 of 3...".
	 *		window.setTimeout( tasks[ 1 ], 1000 );
	 *
	 *		// Two seconds after the previous message last task will be completed, meaining that
	 *		// notification will be closed.
	 *		window.setTimeout( tasks[ 2 ], 3000 );
	 *
	 * @since 4.5.0
	 * @class CKEDITOR.plugins.notificationaggregator
	 * @mixins CKEDITOR.event
	 * @constructor Creates a notification aggregator instance.
	 * @param {CKEDITOR.editor} editor
	 * @param {String} message A template of message to be displayed in notification, for template parameters
	 * see {@link #_message}.
	 */
	function Aggregator( editor, message ) {
		this.editor = editor;
		/**
		 * Array of unique numbers generated with {@link #createTask} calls. If an id is
		 * removed from the array, then we consider it completed.
		 *
		 * @private
		 */
		this._tasks = [];

		/**
		 * A template for the message.
		 *
		 * Template can use following variables:
		 *
		 * * **current** - A count of completed tasks.
		 * * **max** - The maximal count of tasks.
		 * * **percentage** - Percentage count.
		 *
		 * @type {CKEDITOR.template}
		 * @private
		 */
		this._message = new CKEDITOR.template( String( message ) );
	}

	Aggregator.prototype = {
		/**
		 * Notification created by the aggregator.
		 *
		 * Notification object is modified as aggregator tasks are being closed.
		 *
		 * @type {CKEDITOR.plugins.notification/null}
		 */
		notification: null,

		/**
		 * Maximal count of tasks before {@link #finished} was called.
		 *
		 * @private
		 */
		_tasksCount: 0,

		/**
		 * Creates a new task and returns a callback to close created task.
		 *
		 * @returns {Function}
		 */
		createTask: function() {
			var initialTask = !this.notification,
				ret;

			if ( initialTask ) {
				// It's a first call.
				this.notification = new CKEDITOR.plugins.notification( this.editor, {
					type: 'progress'
				} );
			}

			ret = this._increaseTasks();

			// Update the contents.
			this._updateNotification();

			if ( initialTask ) {
				this.notification.show();
			}

			return ret;
		},

		/**
		 * @returns {Boolean} Returns `true` if all the notification tasks are done
		 * (or there are no tasks at all).
		 */
		isFinished: function() {
			return this._tasks.length === 0;
		},

		/**
		 * Called when all tasks are done. The default implementation is to hide the notification.
		 */
		finished: function() {
			this.notification.hide();
			this.notification = null;
		},

		/**
		 * A private function that will inform public API about the finish event.
		 *
		 * @private
		 */
		_finish: function() {
			this._reset();

			var evt = this.fire( 'finished' );

			if ( evt !== false ) {
				this.finished();
			}
		},

		/**
		 * Updates the notification. It also detects if all tasks are finished,
		 * if so it will trigger finish procedure.
		 *
		 * @private
		 */
		_updateNotification: function() {
			var maxCount = this._tasksCount,
				currentCount = maxCount - this._tasks.length,
				percentage = Math.floor( currentCount / maxCount  * 100 ),
				msg;

			if ( this.isFinished() ) {
				// All tasks loaded, loading is finished.
				this._finish();
			} else {
				// Generate a message.
				msg = this._message.output( {
					current: currentCount,
					max: maxCount,
					percentage: percentage
				} );

				this.notification.update( {
					message: msg,
					progress: Number( currentCount / maxCount )
				} );
			}
		},

		/**
		 * Increases task count, and returns a callback for the created task entry.
		 *
		 * @private
		 * @returns {Function}
		 */
		_increaseTasks: function() {
			var id = CKEDITOR.tools.getNextId(),
				that = this,
				tasks = that._tasks;

			tasks.push( id );

			that._tasksCount = tasks.length;

			return function() {
				var index = CKEDITOR.tools.indexOf( tasks, id );
				// One task state can be finished only once.
				if ( index < 0 ) {
					return;
				}

				tasks.splice( index, 1 );
				// State changed so we need to call _updateNotification.
				that._updateNotification();
			};
		},

		/**
		 * Resets the internal state of an aggregator.
		 *
		 * @private
		 */
		_reset: function() {
			this._tasksCount = 0;
			this._tasks = [];
		}
	};

	CKEDITOR.event.implementOn( Aggregator.prototype );

	// Expose Aggregator type.
	CKEDITOR.plugins.notificationaggregator = Aggregator;
} )();
