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
	 *		var aggregator = new CKEDITOR.plugins.notificationAggregator( editor, 'Loading process, step {current} of {max}...' );
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
	 * @class CKEDITOR.plugins.notificationAggregator
	 * @mixins CKEDITOR.event
	 * @constructor Creates a notification aggregator instance.
	 * @param {CKEDITOR.editor} editor
	 * @param {String} message A template of message to be displayed in notification, for template parameters
	 * see {@link #_message}.
	 */
	function Aggregator( editor, message ) {
		/**
		 * @readonly
		 * @property {CKEDITOR.editor} editor
		 */
		this.editor = editor;

		/**
		 * Notification created by the aggregator.
		 *
		 * Notification object is modified as aggregator tasks are being closed.
		 *
		 * @property {CKEDITOR.plugins.notification/null}
		 */
		this.notification = null,

		/**
		 * Array of unique numbers generated with {@link #createTask} calls. If an id is
		 * removed from the array, then we consider it completed.
		 *
		 * @private
		 */
		this._tasks = [];

		/**
		 * Maximal count of tasks before {@link #finished} was called.
		 *
		 * @private
		 */
		this._tasksCount = 0;

		/**
		 * A template for the message.
		 *
		 * Template can use following variables:
		 *
		 * * **current** - A count of completed tasks.
		 * * **max** - The maximal count of tasks.
		 * * **percentage** - Percentage count.
		 *
		 * @private
		 * @property {CKEDITOR.template}
		 */
		this._message = new CKEDITOR.template( String( message ) );
	}

	Aggregator.prototype = {
		/**
		 * Creates a new task that can be updated to indicate the progress.
		 *
		 * @param [options] Options object for the task creation.
		 * @param [options.weight=1]
		 * @returns {CKEDITOR.plugins.notificationAggregator.task} An object that represents the task state, and allows
		 * for it manipulation.
		 */
		createTask: function( options ) {
			options = options || {};

			var initialTask = !this.notification,
				ret;

			if ( initialTask ) {
				// It's a first call.
				this.notification = this._createNotification();
			}

			ret = this._increaseTasks( options );

			// Update the contents.
			this._updateNotification();

			if ( initialTask ) {
				this.notification.show();
			}

			return ret;
		},

		/**
		 * Note: For an empty aggregator (without any tasks created) it will return 100.
		 *
		 * @param {Boolean} round If `true`, returned number will be rounded.
		 * @returns {Number} Returns done percentage as a number ranging from `0` to `100`.
		 */
		getPercentage: function( rounded ) {
			// In case there are no weights at all we'll return 100.
			if ( this._tasks.length === 0 ) {
				return 100;
			}

			var ret = this._getDoneWeights() / this._getWeights() * 100;

			if ( rounded ) {
				return Math.round( ret );
			} else {
				return ret;
			}
		},

		/**
		 * @returns {Boolean} Returns `true` if all the notification tasks are done
		 * (or there are no tasks at all).
		 */
		isFinished: function() {
			return this._getDoneTasks() === this._tasksCount;
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

			var evt = this.fire( 'finished', {}, this.editor );

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
			var percentage = this.getPercentage( true ),
				// Msg that we're going to put in notification.
				msg = this._message.output( {
					current: this._getDoneTasks(),
					max: this._tasksCount,
					percentage: percentage
				} );

			this.notification.update( {
				message: msg,
				progress: percentage / 100
			} );

			if ( this.isFinished() ) {
				// All tasks loaded, loading is finished.
				this._finish();
			}
		},

		/**
		 * Creates a notification object.
		 *
		 * @returns {CKEDITOR.plugins.notification}
		 */
		_createNotification: function() {
			return new CKEDITOR.plugins.notification( this.editor, {
				type: 'progress'
			} );
		},

		/**
		 * Increases task count, and returns a callback for the created task entry.
		 *
		 * @private
		 * @param options
		 * @returns {CKEDITOR.plugins.notificationAggregator.task}
		 */
		_increaseTasks: function( options ) {
			// Provide a default value.
			options.weight = options.weight || 1;

			var task = new Task( this, options.weight );

			this._tasks.push( task );
			this._tasksCount = this._tasks.length;

			return task;
		},

		/**
		 * Returns the count of done tasks.
		 *
		 * @returns {Number}
		 */
		_getDoneTasks: function() {
			var ret = 0;
			for ( var i = this._tasks.length - 1; i >= 0; i-- ) {
				if ( this._tasks[ i ].isDone() ) {
					ret += 1;
				}
			}
			return ret;
		},

		/**
		 * Resets the internal state of an aggregator.
		 *
		 * @private
		 */
		_reset: function() {
			this._tasksCount = 0;
			this._tasks = [];
		},

		/**
		 * Removes given task from the {@link #_tasks} array and updates the ui.
		 *
		 * @param task Task to be removed.
		 */
		_removeTask: function( task ) {
			var key = CKEDITOR.tools.indexOf( this._tasks, task );

			if ( key !== -1 ) {
				this._tasks.splice( key, 1 );
				this._tasksCount = this._tasks.length;
				// And we also should inform the UI about this change.
				this._updateNotification();
			}
		},

		/**
		 * Gets a done wieght sum of all the contained tasks.
		 *
		 * @returns {Number}
		 */
		_getDoneWeights: function() {
			var ret = 0;
			for ( var i = this._tasks.length - 1; i >= 0; i-- ) {
				ret += this._tasks[ i ]._doneWeight;
			}
			return ret;
		},

		/**
		 * Gets a wieght sum of all the contained tasks.
		 *
		 * @returns {Number}
		 */
		_getWeights: function() {
			var ret = 0;
			for ( var i = this._tasks.length - 1; i >= 0; i-- ) {
				ret += this._tasks[ i ]._weight;
			}
			return ret;
		}
	};

	CKEDITOR.event.implementOn( Aggregator.prototype );

	/**
	 * This type represents a Task, and exposes methods to manipulate task state.
	 *
	 * @since 4.5.0
	 * @class CKEDITOR.plugins.notificationAggregator
	 * @constructor Creates a notification aggregator instance.
	 * @param {CKEDITOR.plugins.notificationAggregator} aggregator Aggregator instance owning the
	 * task.
	 * @param {Number} weight
	 */
	function Task( aggregator, weight ) {
		this.aggregator = aggregator;
		this._weight = weight;
		// Task always starts with 0 done weight.
		this._doneWeight = 0;
	}

	Task.prototype = {
		done: function() {
			this._doneWeight = this._weight;
			this.aggregator._updateNotification();
		},

		update: function( weight ) {
			// Note that newWeight can't be higher than _doneWeight.
			this._doneWeight = Math.min( this._weight, weight );

			if ( this.isDone() ) {
				this.done();
			} else {
				// In other case we want to update notification.
				// We don't have to do that in case above, because done() will call it.
				this.aggregator._updateNotification();
			}
		},

		/**
		 * Cancels the task, removing it from the aggregator.
		 */
		cancel: function() {
			this.aggregator._removeTask( this );
		},

		/**
		 * Checks if the task is done.
		 *
		 * @returns {Boolean}
		 */
		isDone: function() {
			return this._weight === this._doneWeight;
		}
	};

	// Expose Aggregator type.
	CKEDITOR.plugins.notificationAggregator = Aggregator;
	CKEDITOR.plugins.notificationAggregator.task = Task;
} )();
