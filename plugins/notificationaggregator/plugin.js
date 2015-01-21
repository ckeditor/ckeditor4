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
		requires: 'notification',
		lang: 'en'
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
	 * @param {String} message A template for message to be displayed in notification, for template parameters
	 * see {@link #_message}.
	 * @param {String/null} [singularMessage=null] An optional template for message to be displayed in notification when there's only
	 * one task remaining. See {@link #_singularMessage}.
	 *
	 * If `null` the `message` template will be used.
	 * @param {String/null} [counter=null] An optional template for counter.
	 *
	 * eg. `({current} of {max})`
	 *
	 * If `null` it will use default counter from lang file.
	 */
	function Aggregator( editor, message, singularMessage, counter ) {
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
		 * A template for the notification message.
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
		this._message = new CKEDITOR.template( message );

		/**
		 * A template for the notification message if only one task is loading.
		 *
		 * Sometimes there might be a need to specify special message when there
		 * is only one task loading, and the standard messages in other cases.
		 *
		 * Eg. you might want show a message "Translating a widget" rather than
		 * "Translating widgets (1 of 1)", but still you would want to have a message
		 * "Translating widgets (2 of 3)" if more widgets are translated at the same
		 * time.
		 *
		 * Template variables are the same as in {@link #_message}.
		 *
		 * @private
		 * @property {CKEDITOR.template/null}
		 */
		this._singularMessage = singularMessage ? new CKEDITOR.template( singularMessage ) : null;

		/**
		 * A template for counter in notifications.
		 *
		 * Template can use following variables:
		 *
		 * * **current** - A count of completed tasks.
		 * * **max** - The maximal count of tasks.
		 *
		 * @private
		 * @property {CKEDITOR.template}
		 */
		this._counter = new CKEDITOR.template( counter || editor.lang.notificationaggregator.counter );
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
			options = CKEDITOR.tools.clone( options ) || {};
			// Provide a default value.
			options.weight = options.weight || 1;

			var initialTask = !this.notification,
				ret;

			if ( initialTask ) {
				// It's a first call.
				this.notification = this._createNotification();
			}

			ret = this._addTask( options );

			// Update the aggregator.
			this.update();

			if ( initialTask ) {
				this.notification.show();
			}

			return ret;
		},

		/**
		 * Triggers an update on aggregator, meaning that its UI will be refreshed.
		 *
		 * If aggregator is finished, then `finished` event will be fired.
		 */
		update: function() {
			this._updateNotification();

			if ( this.isFinished() ) {
				// All tasks loaded, loading is finished.
				this._reset();

				if ( this.fire( 'finished', {}, this.editor ) !== false ) {
					this.finished();
				}
			}
		},

		/**
		 * Note: For an empty aggregator (without any tasks created) it will return 100.
		 *
		 * @param {Boolean} round If `true`, returned number will be rounded.
		 * @returns {Number} Returns done percentage as a number ranging from `0` to `100`.
		 */
		getPercentage: function( rounded ) {
			// In case there are no weights at all we'll return 100.
			if ( this.getTasksCount() === 0 ) {
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
			return this.getDoneTasks() === this.getTasksCount();
		},

		/**
		 * Called when all tasks are done. The default implementation is to hide the notification.
		 */
		finished: function() {
			this.notification.hide();
			this.notification = null;
		},

		/**
		 * Returns the count of done tasks.
		 *
		 * @returns {Number}
		 */
		getDoneTasks: function() {
			var ret = 0;
			for ( var i = this.getTasksCount() - 1; i >= 0; i-- ) {
				if ( this._tasks[ i ].isDone() ) {
					ret += 1;
				}
			}
			return ret;
		},

		/**
		 * @returns {Number} Returns a total tasks count.
		 */
		getTasksCount: function() {
			return this._tasks.length;
		},

		/**
		 * Updates the notification content.
		 *
		 * @private
		 */
		_updateNotification: function() {
			this.notification.update( {
				message: this._getNotificationMessage(),
				progress: this.getPercentage( true ) / 100
			} );
		},

		/**
		 * Returns a message used in the notification.
		 *
		 * @private
		 * @returns {String}
		 */
		_getNotificationMessage: function() {
			var tasksCount = this.getTasksCount(),
				doneTasks = this.getDoneTasks(),
				remainingTasks = tasksCount - doneTasks,
				// Template params common for _counter and _message
				templateParams = {
					current: doneTasks,
					max: tasksCount
				},
				template;

			// Expand template params with props needed by _message.
			templateParams.counter = this._counter.output( templateParams );
			templateParams.percentage = this.getPercentage( true );

			// If there's only one remaining task and we have a singular message,
			// we should use it.
			if ( remainingTasks === 1 && this._singularMessage ) {
				template = this._singularMessage;
			} else {
				template = this._message;
			}

			return template.output( templateParams );
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
		 * Creates a {@link CKEDITOR.plugins.notificationAggregator.Task} instance based
		 * on `options`, and adds it to tasks list.
		 *
		 * @private
		 * @param options Options object coming from {@link #createTask} method.
		 * @returns {CKEDITOR.plugins.notificationAggregator.task}
		 */
		_addTask: function( options ) {
			var task = new Task( this, options.weight );
			this._tasks.push( task );
			return task;
		},

		/**
		 * Resets the internal state of an aggregator.
		 *
		 * @private
		 */
		_reset: function() {
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
				// And we also should inform the UI about this change.
				this.update();
			}
		},

		/**
		 * Gets a done wieght sum of all the contained tasks.
		 *
		 * @returns {Number}
		 */
		_getDoneWeights: function() {
			var ret = 0;
			for ( var i = this.getTasksCount() - 1; i >= 0; i-- ) {
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
			for ( var i = this.getTasksCount() - 1; i >= 0; i-- ) {
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
		/**
		 * An aggregator object associated with the task.
		 */
		this.aggregator = aggregator;

		/**
		 * Total weight for the task.
		 */
		this._weight = weight;

		/**
		 * Done weight.
		 *
		 * @private
		 */
		this._doneWeight = 0;
	}

	Task.prototype = {
		/**
		 * Marks task as done.
		 */
		done: function() {
			this.update( this._weight );
		},

		/**
		 * Updates the done weight of a task.
		 *
		 * @param {Number} weight Number telling how much of a total {@link #_weight} is done.
		 */
		update: function( weight ) {
			// Note that newWeight can't be higher than _doneWeight.
			this._doneWeight = Math.min( this._weight, weight );
			// Aggregator UI needs to be updated.
			this.aggregator.update();
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
