
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
		/**
		 * @readonly
		 * @property {CKEDITOR.editor} editor
		 */
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
		 * @param [options] Options object for the task creation.
		 * @returns {Function}
		 */
		createTask: function( options ) {
			var initialTask = !this.notification,
				ret;

			if ( initialTask ) {
				// It's a first call.
				this.notification = new CKEDITOR.plugins.notification( this.editor, {
					type: 'progress'
				} );
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
			var tasksCount = this._tasksCount,
				ret;

			if ( this.isFinished() ) {
				return 100;
			}

			ret = (tasksCount - this._tasks.length ) / tasksCount  * 100;

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
		 * Increases task count, and returns a callback for the created task entry.
		 *
		 * @private
		 * @param options
		 * @returns {Function}
		 */
		_increaseTasks: function( options ) {
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
		 * Returns the count of done tasks.
		 *
		 * @returns {Number}
		 */
		_getDoneTasks: function() {
			return this._tasksCount - this._tasks.length;
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
		}
	};

	CKEDITOR.event.implementOn( Aggregator.prototype );

	/**
	 * This is more powerful Aggregator class that allows you to update progress of your tasks
	 * more frequently, rather than update them only once they are done. Therefore it allows you
	 * to provide a better feedback for the end user.
	 *
	 * @since 4.5.0
	 * @class CKEDITOR.plugins.notificationaggregator.Complex
	 * @extends CKEDITOR.plugins.notificationaggregator
	 * @constructor Creates a complex notification aggregator instance.
	 */
	function AggregatorComplex( editor, message ) {
		Aggregator.call( this, editor, message );

		/**
		 * An array storing the calculated progress of tasks weights.
		 * @type {Number[]}
		 */
		this._doneWeights = [];

		/**
		 * An array storing maximal weights declared per task.
		 * @type {Number[]}
		 */
		this._weights = [];
	}

	AggregatorComplex.prototype = new Aggregator();

	/**
	 * Creates a new task that can be updated to indicate the progress.
	 *
	 * @param [options]
	 * @param [options.weight=1]
	 * @returns {Object} An object with a set of functions for updating the task state.
	 * @returns {Function} return.done A function to be called once the task is done.
	 * @returns {Function} return.update A function to be called to let aggregator know,
	 * that the this single tash has made an progression.
	 *
	 * It takes a single parameter:
	 *
	 * * **weight** - Number - A number between `0` and `weight` given to the `createTask` method.
	 */
	AggregatorComplex.prototype.createTask = function( options ) {
		// Override method only to set the default values if needed.
		options = options || {};
		options.weight = options.weight || 1;

		return Aggregator.prototype.createTask.call( this, options );
	};

	AggregatorComplex.prototype._increaseTasks = function( options ) {
		// _increaseTasks should return an Task instance.
		var tasks = this._tasks,
			ret =  new Task( this, options.weight );
		tasks.push( ret );
		this._tasksCount = tasks.length;
		return ret;
	};

	/**
	 * Note: For an empty aggregator (without any tasks created) it will return 100.
	 *
	 * @param {Boolean} round If `true`, returned number will be rounded.
	 * @returns {Number} Returns done percentage as a number ranging from `0` to `100`.
	 */
	AggregatorComplex.prototype.getPercentage = function( rounded ) {
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
	};

	AggregatorComplex.prototype._getDoneTasks = function() {
		var ret = 0;
		for ( var i = this._tasks.length - 1; i >= 0; i-- ) {
			if ( this._tasks[ i ].isDone() ) {
				ret += 1;
			}
		}
		return ret;
	};

	/**
	 * Sums done weight properties from all the contained tasks.
	 *
	 * @returns {Number}
	 */
	AggregatorComplex.prototype._getDoneWeights = function() {
		var ret = 0;
		for ( var i = this._tasks.length - 1; i >= 0; i-- ) {
			ret += this._tasks[ i ]._doneWeight;
		}
		return ret;
	};

	/**
	 * Sums weight properties from all the contained tasks.
	 *
	 * @returns {Number}
	 */
	AggregatorComplex.prototype._getWeights = function() {
		var ret = 0;
		for ( var i = this._tasks.length - 1; i >= 0; i-- ) {
			ret += this._tasks[ i ]._weight;
		}
		return ret;
	};

	/**
	 * This type represents a Task, and exposes methods to manipulate task state.
	 *
	 * @since 4.5.0
	 * @class CKEDITOR.plugins.notificationaggregator
	 * @constructor Creates a notification aggregator instance.
	 * @param {CKEDITOR.plugins.notificationaggregator} aggregator Aggregator instance owning the
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
			// Note that newWeight can't be higher than that._weights[ weightIndex ]!
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

		isDone: function() {
			return this._weight === this._doneWeight;
		}
	};

	// Expose Aggregator type.
	CKEDITOR.plugins.notificationaggregator = Aggregator;
	CKEDITOR.plugins.notificationaggregator.Complex = AggregatorComplex;
	CKEDITOR.plugins.notificationaggregator.Task = Task;
} )();
