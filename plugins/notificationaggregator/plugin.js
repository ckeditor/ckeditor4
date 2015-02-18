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
	 * An aggregator of multiple tasks (progresses) which should be displayed using one
	 * {@link CKEDITOR.plugins.notification notification}.
	 *
	 * Once all the tasks are done, it means that the whole process is finished.
	 * Once finished the aggregator state will be reset and the {@link #finished} event will be fired.
	 *
	 * New tasks can be created after the previous set of tasks was finished. This will reopen the
	 * notification with message describing only the tasks that are currently in progress.
	 * Thanks to this a developer does not have to create multiple aggregator instances.
	 *
	 * Simple usage example:
	 *
	 *		// Create a new notification aggregator instance.
	 *		var aggregator = new CKEDITOR.plugins.notificationAggregator( editor, 'Loading process, step {current} of {max}...' );
	 *
	 *		// Create 3 tasks.
	 *		var taskA = aggregator.createTask(),
	 *			taskB = aggregator.createTask(),
	 *			taskC = aggregator.createTask();
	 *
	 *		// At this point notification has a message: "Loading process, step 0 of 3...".
	 *
	 *		// Let's close first one immediately.
	 *		taskA.done(); // "Loading process, step 1 of 3...".
	 *
	 *		// One second later message will be "Loading process, step 2 of 3...".
	 *		setTimeout( function() {
	 *			taskB.done();
	 *		}, 1000 );
	 *
	 *		// Two seconds after the previous message last task will be completed, meaining that
	 *		// notification will be closed.
	 *		setTimeout( function() {
	 *			taskC.done();
	 *		}, 3000 );
	 *
	 * @since 4.5.0
	 * @class CKEDITOR.plugins.notificationAggregator
	 * @mixins CKEDITOR.event
	 * @constructor Creates a notification aggregator instance.
	 * @param {CKEDITOR.editor} editor
	 * @param {String} message A template for message to be displayed in notification. The template can use the
	 * the following variables:
	 *
	 * * `{current}` - Number of completed tasks.
	 * * `{max}` - Number of tasks.
	 * * `{percentage}` - The progress (number 0-100).
	 *
	 * @param {String/null} [singularMessage=null] An optional template for message to be displayed in notification
	 * when there is only one task remaining.  This template can use the same variables as the `message` template.
	 * If `null`, then the `message` template will be used.
	 */
	function Aggregator( editor, message, singularMessage ) {
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
		 * @readonly
		 * @property {CKEDITOR.plugins.notification/null}
		 */
		this.notification = null;

		/**
		 * A template for the notification message.
		 *
		 * Template can use the following variables:
		 *
		 * * `{current}` - Number of completed tasks.
		 * * `{max}` - Number of tasks.
		 * * `{percentage}` - The progress (number 0-100).
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
		 * For example, you might want to show a message "Translating a widget" rather than
		 * "Translating widgets (1 of 1)", but still you would want to have a message
		 * "Translating widgets (2 of 3)" if more widgets are being translated at the same
		 * time.
		 *
		 * Template variables are the same as in {@link #_message}.
		 *
		 * @private
		 * @property {CKEDITOR.template/null}
		 */
		this._singularMessage = singularMessage ? new CKEDITOR.template( singularMessage ) : null;

		// Set the _tasks, _totalWeights, _doneWeights, _doneTasks properties.
		this.reset();

		/**
		 * Array of tasks tracked by the aggregator.
		 *
		 * @private
		 * @property {CKEDITOR.plugins.notificationAggregator.task[]} _tasks
		 */

		/**
		 * Stores the sum of declared weights for all the contained tasks.
		 *
		 * @private
		 * @property {Number} _totalWeights
		 */

		/**
		 * Stores the sum of done weights for all the contained tasks.
		 *
		 * @private
		 * @property {Number} _doneWeights
		 */

		/**
		 * Stores a count of done tasks.
		 *
		 * @private
		 * @property {Number} _doneTasks
		 */
	}

	Aggregator.prototype = {
		/**
		 * Creates a new task that can be updated to indicate the progress.
		 *
		 * @param [options] Options object for the task creation.
		 * @param [options.weight] For more information about weight, see
		 * {@link CKEDITOR.plugins.notificationAggregator.task} overview.
		 * @returns {CKEDITOR.plugins.notificationAggregator.task} An object that represents the task state, and allows
		 * for it manipulation.
		 */
		createTask: function( options ) {
			options = options || {};

			var initialTask = !this.notification,
				task;

			if ( initialTask ) {
				// It's a first call.
				this.notification = this._createNotification();
			}

			task = this._addTask( options );

			task.on( 'updated', this._onTaskUpdate, this );
			task.on( 'done', this._onTaskDone, this );
			task.on( 'canceled', function() {
				this._removeTask( task );
			}, this );

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
		 * When all the tasks are done, the {@link #finished} event is fired.
		 */
		update: function() {
			this._updateNotification();

			if ( this.isFinished() ) {
				this._finish();
			}
		},

		/**
		 * Returns a number from `0` to `1` representing the done weights to total weights ratio
		 * (how much of the tasks is done).
		 *
		 * Note: For an empty aggregator (without any tasks created) it will return `1`.
		 *
		 * @returns {Number} Returns done percentage as a number ranging from `0` to `1`.
		 */
		getPercentage: function() {
			// In case there are no weights at all we'll return 1.
			if ( this.getTasksCount() === 0 ) {
				return 1;
			}

			return this._doneWeights / this._totalWeights;
		},

		/**
		 * @returns {Boolean} Returns `true` if all the notification tasks are done
		 * (or there are no tasks at all).
		 */
		isFinished: function() {
			return this.getDoneTasksCount() === this.getTasksCount();
		},

		/**
		 * @returns {Number} Returns a total tasks count.
		 */
		getTasksCount: function() {
			return this._tasks.length;
		},

		/**
		 * @returns {Number} Returns the number of done tasks.
		 */
		getDoneTasksCount: function() {
			return this._doneTasks;
		},

		/**
		 * Resets the state of the aggregator.
		 */
		reset: function() {
			this._tasks = [];
			this._totalWeights = 0;
			this._doneWeights = 0;
			this._doneTasks = 0;
		},

		/**
		 * Should be called when all tasks are done.
		 */
		_finish: function() {
			if ( this.fire( 'finished' ) !== false ) {
				this.notification.hide();
				this.notification = null;
			}

			this.reset();
		},

		/**
		 * Updates the notification content.
		 *
		 * @private
		 */
		_updateNotification: function() {
			this.notification.update( {
				message: this._getNotificationMessage(),
				progress: this.getPercentage()
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
				templateParams = {
					current: doneTasks,
					max: tasksCount,
					percentage: Math.round( this.getPercentage() * 100 )
				},
				template;

			// If there's only one remaining task and we have a singular message, we should use it.
			if ( tasksCount == 1 && this._singularMessage ) {
				template = this._singularMessage;
			} else {
				template = this._message;
			}

			return template.output( templateParams );
		},

		/**
		 * Creates a notification object.
		 *
		 * @private
		 * @returns {CKEDITOR.plugins.notification}
		 */
		_createNotification: function() {
			return new CKEDITOR.plugins.notification( this.editor, {
				type: 'progress'
			} );
		},

		/**
		 * Creates a {@link CKEDITOR.plugins.notificationAggregator.task} instance based
		 * on `options`, and adds it to the tasks list.
		 *
		 * @private
		 * @param options Options object coming from the {@link #createTask} method.
		 * @returns {CKEDITOR.plugins.notificationAggregator.task}
		 */
		_addTask: function( options ) {
			var task = new Task( options.weight );
			this._tasks.push( task );
			this._totalWeights += task._weight;
			return task;
		},

		/**
		 * Removes given task from the {@link #_tasks} array and updates the UI.
		 *
		 * @private
		 * @param {CKEDITOR.plugins.notificationAggregator.task} task Task to be removed.
		 */
		_removeTask: function( task ) {
			var index = CKEDITOR.tools.indexOf( this._tasks, task );

			if ( index !== -1 ) {
				// If task was already updated with some weight, we need to remove
				// this weight from our cache.
				if ( task._doneWeight ) {
					this._doneWeights -= task._doneWeight;
				}

				this._tasks.splice( index, 1 );
				// And we also should inform the UI about this change.
				this.update();
			}
		},

		/**
		 * A listener called on the {@link CKEDITOR.plugins.notificationAggregator.task#update} event.
		 *
		 * @private
		 * @param {CKEDITOR.eventInfo} evt Event object of the {@link CKEDITOR.plugins.notificationAggregator.task#update}.
		 */
		_onTaskUpdate: function( evt ) {
			this._doneWeights += evt.data;
			this.update();
		},

		/**
		 * A listener called on the {@link CKEDITOR.plugins.notificationAggregator.task#event-done} event.
		 *
		 * @private
		 * @param {CKEDITOR.eventInfo} evt Event object of the {@link CKEDITOR.plugins.notificationAggregator.task#event-done} event.
		 */
		_onTaskDone: function() {
			this._doneTasks += 1;
			this.update();
		}
	};

	CKEDITOR.event.implementOn( Aggregator.prototype );

	/**
	 * # Overview
	 *
	 * This type represents a single task in aggregator, and exposes methods to manipulate its state.
	 *
	 * ## Weights
	 *
	 * Task progess is based on its **weight**.
	 *
	 * As you create a task, you need to declare its weight. As you want to update to inform about the
	 * progress, you'll need to {@link #update} the task, telling how much of this weight is done.
	 *
	 * Eg. if you declare that your task has a weight equal `50` and then call `update` with `10`,
	 * you'll end up with telling that the task is done in 20%.
	 *
	 * ### Example Usage of Weights
	 *
	 * Lets say that you use tasks for file uploading.
	 *
	 * A single task is associated to a single file upload. You can use file size in bytes as a weight,
	 * and then as a file upload progresses you just call `update` method with number of bytes actually
	 * downloaded.
	 *
	 * @since 4.5.0
	 * @class CKEDITOR.plugins.notificationAggregator.task
	 * @mixins CKEDITOR.event
	 * @constructor Creates a task instance for notification aggregator.
	 * @param {Number} [weight=1]
	 */
	function Task( weight ) {
		/**
		 * Total weight of the task.
		 *
		 * @private
		 * @property {Number}
		 */
		this._weight = weight || 1;

		/**
		 * Done weight.
		 *
		 * @private
		 * @property {Number}
		 */
		this._doneWeight = 0;
	}

	Task.prototype = {
		/**
		 * Marks the task as done.
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

			// Fire updated event even if task is done in order to correctly trigger updating the
			// notification's message. If we wouldn't do this, then the last weight change would be ignored.
			this.fire( 'updated', weightChange );

			if ( this.isDone() ) {
				this.fire( 'done' );
			}
		},

		/**
		 * Cancels the task (task will be removed from the aggregator).
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
	 * Fired when all tasks are done.
	 *
	 * It can be canceled to customize how the notification should be closed.
	 *
	 * This event might be used eg. to display a follow-up success message.
	 *
	 *		aggregator.on( 'finished', function() {
	 *			editor.showNotification( 'Uploaded ' + this.getDoneTasksCount() + ' files.', 'success', 2000 );
	 *		} );
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
	 *		myTask.update( 40 );
	 *		// Fires updated event with evt.data = 10.
	 *		myTask.update( 20 );
	 *		// Fires updated event with evt.data = -20.
	 *
	 * @event updated
	 * @param {Number} data The difference between new weight and the last one.
	 * @member CKEDITOR.plugins.notificationAggregator.task
	 */

	/**
	 * Fired when the task is done.
	 *
	 * @event done
	 * @member CKEDITOR.plugins.notificationAggregator.task
	 */

	/**
	 * Fired when the task is canceled.
	 *
	 * @event canceled
	 * @member CKEDITOR.plugins.notificationAggregator.task
	 */

	// Expose Aggregator type.
	CKEDITOR.plugins.notificationAggregator = Aggregator;
	CKEDITOR.plugins.notificationAggregator.task = Task;
} )();
