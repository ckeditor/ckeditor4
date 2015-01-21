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

		/**
		 * Stores the sum of wieght for all the contained tasks.
		 *
		 * @private
		 */
		this._totalWeights = 0;

		/**
		 * Stores the sum of done wieght for all the contained tasks.
		 *
		 * @private
		 */
		this._doneWeights = 0;

		/**
		 * Stores a count of done tasks.
		 *
		 * @private
		 */
		this._doneTasks = 0;
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
				that = this,
				task;

			if ( initialTask ) {
				// It's a first call.
				this.notification = this._createNotification();
			}

			task = this._addTask( options );

			task.on( 'updated', function( evt ) {
				that._onTaskUpdate( this, evt );
			} );

			task.on( 'done', this._onTaskDone, this );

			task.on( 'canceled', function() {
				that._removeTask( this );
			} );

			// Update the aggregator.
			this.update();

			if ( initialTask ) {
				this.notification.show();
			}

			return task;
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

			var ret = this._doneWeights / this._totalWeights * 100;

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
			return this.getDoneTasksCount() === this.getTasksCount();
		},

		/**
		 * Called when all tasks are done. The default implementation is to hide the notification.
		 */
		finished: function() {
			this.notification.hide();
			this.notification = null;
		},

		/**
		 * @returns {Number} Returns a total tasks count.
		 */
		getTasksCount: function() {
			return this._tasks.length;
		},

		/**
		 * @returns {Number} Returns number of done tasks.
		 */
		getDoneTasksCount: function() {
			return this._doneTasks;
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
				doneTasks = this.getDoneTasksCount(),
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
			var task = new Task( options.weight );
			this._tasks.push( task );
			this._totalWeights += options.weight;
			return task;
		},

		/**
		 * Resets the internal state of an aggregator.
		 *
		 * @private
		 */
		_reset: function() {
			this._tasks = [];
			this._totalWeights = 0;
			this._doneWeights = 0;
			this._doneTasks = 0;
		},

		/**
		 * Removes given task from the {@link #_tasks} array and updates the ui.
		 *
		 * @param task Task to be removed.
		 */
		_removeTask: function( task ) {
			var key = CKEDITOR.tools.indexOf( this._tasks, task );

			if ( key !== -1 ) {
				// If task was already updated with some weight, we need to remove
				// this weight from our cache.
				if ( task._doneWeight ) {
					this._doneWeights -= task._doneWeight;
				}

				this._tasks.splice( key, 1 );
				// And we also should inform the UI about this change.
				this.update();
			}
		},

		/**
		 * A listener called when {@link CKEDITOR.plugins.notificationAggregator.Task#update}
		 * event.
		 *
		 * @private
		 * @param {CKEDITOR.plugins.notificationAggregator.Task} task
		 * @param evt Event object for {@link CKEDITOR.plugins.notificationAggregator.Task#update}.
		 */
		_onTaskUpdate: function( task, evt ) {
			this._doneWeights += evt.data;
			this.update();
		},

		/**
		 * A listener called when {@link CKEDITOR.plugins.notificationAggregator.Task#done}
		 * event.
		 *
		 * Note: function is executed with {@link CKEDITOR.plugins.notificationAggregator.Task}
		 * instance in a scope.
		 *
		 * @private
		 */
		_onTaskDone: function( evt ) {
			this._doneTasks += 1;
			this.update();
		}
	};

	CKEDITOR.event.implementOn( Aggregator.prototype );

	/**
	 * This type represents a single task in aggregator, and exposes methods to manipulate its state.
	 *
	 * @since 4.5.0
	 * @class CKEDITOR.plugins.notificationAggregator
	 * @mixins CKEDITOR.event
	 * @constructor Creates a notification aggregator instance.
	 * @param {Number} weight
	 */
	function Task( weight ) {
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
			// If task is already done there is no need to update it, and we don't expect
			// progress to be reversed.
			if ( this.isDone() ) {
				return;
			}

			// Note that newWeight can't be higher than _doneWeight.
			var newWeight = Math.min( this._weight, weight ),
				weightChange = newWeight - this._doneWeight;

			this._doneWeight = newWeight;

			// Fire updated event even if task, despite task being done with this update.
			this.fire( 'updated', weightChange );

			if ( this.isDone() ) {
				this.fire( 'done' );
			}
		},

		/**
		 * Cancels the task.
		 */
		cancel: function() {
			// We'll fire cancel event it's up to aggregator to listen for this event,
			// and remove the task.
			this.fire( 'canceled' );
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

	CKEDITOR.event.implementOn( Task.prototype );

	/**
	 * Fired when the loading is done.
	 *
	 * It can be canceled, in this case {@link #finished} won't be called.
	 *
	 * @event finished
	 * @member CKEDITOR.plugins.notificationAggregator
	 */

	/**
	 * Fired upon each weight update of the task.
	 *
	 *		var myTask = new Task( 100 );
	 *		myTask.update( 30 );
	 *		// Fires updated event with evt.data = 30.
	 *		myTask.update( 10 );
	 *		// Fires updated event with evt.data = 10.
	 *
	 * @event updated
	 * @param {Number} data The difference between new weight and the last one.
	 * @member CKEDITOR.plugins.notificationAggregator.Task
	 */

	/**
	 * Fired when the task is done.
	 *
	 * @event done
	 * @member CKEDITOR.plugins.notificationAggregator.Task
	 */

	// Expose Aggregator type.
	CKEDITOR.plugins.notificationAggregator = Aggregator;
	CKEDITOR.plugins.notificationAggregator.task = Task;
} )();
