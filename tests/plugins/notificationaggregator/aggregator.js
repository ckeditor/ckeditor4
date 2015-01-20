/* bender-tags: unit */
/* bender-ckeditor-plugins: notificationaggregator */

( function() {

	'use strict';

	// A type that is going to mimic generic notification type.
	var NotificationMock = sinon.spy( function() {
			return {
				show: sinon.spy(),
				hide: sinon.spy(),
				update: sinon.spy()
			};
		} ),
		Aggregator,
		Task;

	bender.test( {
		setUp: function() {
			// Assign type to more convenient variable.
			Aggregator = CKEDITOR.plugins.notificationAggregator;
			Task = CKEDITOR.plugins.notificationAggregator.task;
			// We don't need real editor, just mock it.
			this.editor = {};
			// We'll replace original notification type so we can track calls, and
			// reduce dependencies.
			// Reassign and reset the spy each TC, so eg. callCount will be reset.
			CKEDITOR.plugins.notification = NotificationMock;
			NotificationMock.reset();
		},

		'test exposes Aggregator type': function() {
			assert.isInstanceOf( Function, CKEDITOR.plugins.notificationAggregator, 'Aggregator type is not exposed' );
		},

		'test constructor': function() {
			var notifConfig = {},
				aggr = new Aggregator( this.editor, notifConfig );

			assert.areSame( this.editor, aggr.editor, 'Correct editor is stored' );
			assert.isInstanceOf( Array, aggr._tasks, 'Created valid _tasks property' );

			assert.isInstanceOf( CKEDITOR.template, aggr._message, '_message property type' );
		},

		'test instances does not share _tasks': function() {
			var instance1 = new Aggregator( this.editor ),
				instance2 = new Aggregator( this.editor );

			instance1._tasks.push( 1 );

			assert.areSame( 0, instance2._tasks.length, 'instance2 _tasks remains empty' );
		},

		'test createTask creates a notification': function() {
			// If aggregate has no tasks, it should create notification object in createTask method.
			var aggr = new Aggregator( this.editor ),
				notification = {
					show: sinon.spy()
				};
			aggr.update = sinon.spy();
			aggr._createNotification = sinon.stub().returns( notification );

			aggr.createTask();

			assert.areSame( 1, aggr._createNotification.callCount, '_createNotification call count' );
			assert.areSame( notification, aggr.notification, 'notification property' );

			// Ensure thad notification show was called.
			assert.areSame( 1, notification.show.callCount, 'notification show call count' );

			assert.areSame( 1, aggr.update.callCount, 'update call count' );
		},

		'test createTask reuses a notification when have tasks': function() {
			// If there is already at least one task, we need to reuse notification.
			var aggr = new Aggregator( this.editor );
			aggr._tasks = [ 0 ];
			// Create a dummy notification, so aggregate will think it have one.
			aggr.notification = {};
			aggr.update = sinon.spy();

			aggr.createTask();

			assert.areSame( 0, NotificationMock.callCount, 'Notification constructor call count' );
			assert.areSame( 1, aggr.update.callCount, 'update call count' );
		},

		'test createTask return value': function() {
			var aggr = new Aggregator( this.editor ),
				expectedCallback = function() {
				},
				ret;
			aggr._addTask = sinon.stub().returns( expectedCallback );
			aggr.update = sinon.spy();

			ret = aggr.createTask();

			assert.areSame( expectedCallback, ret, 'Return value' );
			// Ensure that methods was used.
			sinon.assert.calledOnce( aggr._addTask );
		},

		'test createTask default options.weight': function() {
			// Ensure that createTask will set a default value for options.weight.
			// We'll also ensure that inputOptions was not modified.
			var instance = new Aggregator( this.editor ),
				inputOptions = {},
				optionsArgument;

			instance._addTask = sinon.spy();
			instance.update = sinon.spy();

			instance.createTask( inputOptions );

			// Options object that was given to _addTask method.
			optionsArgument = instance._addTask.args[ 0 ][ 0 ];

			assert.areSame( 1, optionsArgument.weight, 'Default weight was assigned' );
			assert.isUndefined( inputOptions.weight, 'Input object was not modified' );
		},

		'test getPercentage rounded': function() {
			var instance = new Aggregator( this.editor );

			instance._getDoneWeights = sinon.stub().returns( 123.45 );
			instance._getWeights = sinon.stub().returns( 1000 );
			instance.getTasksCount = sinon.stub().returns( 1 );

			assert.areSame( 12, instance.getPercentage( true ), 'Invalid return value' );
		},

		'test getPercentage empty': function() {
			// Ensure that nothing bad happens if htere are no weights at all.
			var instance = new Aggregator( this.editor );

			instance.getTasksCount = sinon.stub().returns( 0 );

			assert.areSame( 100, instance.getPercentage(), 'Invalid return value' );
		},

		'test finished': function() {
			var instance = new Aggregator( this.editor ),
				notif = new NotificationMock();
			instance.notification = notif;

			instance.finished();

			assert.areSame( 1, notif.hide.callCount, 'notification.hide call count' );
		},

		'test isFinished': function() {
			var instance = new Aggregator( this.editor );
			instance.getDoneTasks = sinon.stub().returns( 2 );
			instance.getTasksCount = sinon.stub().returns( 2 );
			assert.isTrue( instance.isFinished(), 'Return value' );
		},

		'test isFinished falsy': function() {
			var instance = new Aggregator( this.editor );
			instance.getDoneTasks = sinon.stub().returns( 1 );
			instance.getTasksCount = sinon.stub().returns( 2 );
			assert.isFalse( instance.isFinished(), 'Return value' );
		},

		'test isFinished empty': function() {
			var instance = new Aggregator( this.editor );
			instance.getDoneTasks = sinon.stub().returns( 0 );
			instance.getTasksCount = sinon.stub().returns( 0 );
			assert.isTrue( instance.isFinished(), 'Return value' );
		},

		'test getTasksCount': function() {
			var instance = new Aggregator( this.editor );
			instance._tasks = [ 0, 0 ];

			assert.areSame( 2, instance.getTasksCount() );
		},

		'test _addTask': function() {
			var instance = new Aggregator( this.editor ),
				ret = instance._addTask( { weight: 20 } );

			assert.areSame( 1, instance._tasks.length, '_tasks array increased' );
			assert.isInstanceOf( Task, ret, 'Return type' );
			assert.areSame( ret, instance._tasks[ 0 ], 'Return value in _tasks[ 0 ]' );
			assert.areSame( 20, ret._weight );
		},

		'test update': function() {
			var instance = new Aggregator( this.editor );
			instance.isFinished = sinon.stub().returns( false );
			instance._updateNotification = sinon.spy();
			instance._reset = sinon.spy();

			instance.update();

			assert.areSame( 1, instance._updateNotification.callCount, '_updateNotification call count' );
			assert.areSame( 0, instance._reset.callCount, '_reset was not called' );
		},

		'test update finished': function() {
			var instance = new Aggregator( this.editor );
			instance.isFinished = sinon.stub().returns( true );
			instance._updateNotification = sinon.spy();
			instance._reset = sinon.spy();
			instance.fire = sinon.spy();
			instance.finished = sinon.spy();

			instance.update();

			assert.areSame( 1, instance._updateNotification.callCount, '_updateNotification call count' );
			assert.areSame( 1, instance._reset.callCount, '_reset was not called' );

			// Ensure that event was called.
			sinon.assert.calledWithExactly( instance.fire, 'finished', {}, this.editor );

			assert.areSame( 1, instance.finished.callCount, 'finished call count' );
		},

		'test update - cancel finished event': function() {
			var instance = new Aggregator( this.editor );
			instance.isFinished = sinon.stub().returns( true );
			instance._updateNotification = sinon.spy();
			instance._reset = sinon.spy();
			instance.fire = sinon.stub().returns( false );
			instance.finished = sinon.spy();

			instance.update();

			// Method finished should not be called.
			assert.areSame( 0, instance.finished.callCount, 'finished call count' );
		},

		'test _updateNotification template calls': function() {
			var instance = new Aggregator( this.editor ),
				expectedParams = {
					max: 4,
					current: 3,
					percentage: 75
				};
			instance._message.output = sinon.spy();
			instance.getTasksCount = sinon.stub().returns( 4 );
			instance.getDoneTasks = sinon.stub().returns( 3 );
			instance.getPercentage = sinon.stub().returns( 75 );
			instance.notification = new NotificationMock();

			instance._updateNotification();

			sinon.assert.calledWithExactly( instance._message.output, expectedParams );

			assert.areSame( 1, instance.getPercentage.callCount, 'instance.getPercentage call count' );
			assert.areSame( 1, instance._message.output.callCount, 'instance._message.output call count' );
		},

		'test _updateNotification notification call': function() {
			var instance = new Aggregator( this.editor );
			instance._message.output = sinon.stub().returns( 'foo' );
			instance.getDoneTasks = sinon.stub().returns( 1 );
			instance.getTasksCount = sinon.stub().returns( 4 );
			instance.getPercentage = sinon.stub().returns( 25 );
			instance.notification = new NotificationMock();

			instance._updateNotification();

			sinon.assert.calledWithExactly( instance.notification.update, {
				message: 'foo',
				progress: 0.25
			} );

			assert.areSame( 1, instance.notification.update.callCount, 'notification.update call count' );
		},

		'test _removeTask': function() {
			var instance = new Aggregator( this.editor );

			instance.update = sinon.spy();
			instance._tasks = [ 1, 2, 3 ];

			instance._removeTask( 2 );

			assert.areSame( 2, instance._tasks.length, 'instance._tasks length' );
			arrayAssert.itemsAreSame( [ 1, 3 ], instance._tasks );
			assert.areSame( 1, instance.update.callCount, 'instance.update call count' );

		},

		'test _removeTask subsequent': function() {
			// Ensure that subsequent remove attempt for the same task won't result with an error.
			var instance = new Aggregator( this.editor );

			instance.update = sinon.spy();
			instance._tasks = [ 1, 2 ];

			instance._removeTask( 1 );
			// And the second call.
			instance._removeTask( 1 );

			assert.areSame( 1, instance._tasks.length, 'instance._tasks length' );
		},

		'test _getWeights': function() {
			var instance = new Aggregator( this.editor );

			instance._tasks = [
				this._getTaskMock( 0, 10 ),
				this._getTaskMock( 0, 15 )
			];
			instance.getTasksCount = sinon.stub().returns( 2 );

			assert.areSame( 25, instance._getWeights(), 'Invalid return value' );
		},

		'test _getDoneWeights': function() {
			var instance = new Aggregator( this.editor );

			instance._tasks = [
				this._getTaskMock( 10, 15 ),
				this._getTaskMock( 15, 15 )
			];
			instance.getTasksCount = sinon.stub().returns( 2 );

			assert.areSame( 25, instance._getDoneWeights(), 'Invalid return value' );
		},

		'test _reset': function() {
			var instance = new Aggregator( this.editor );
			instance._tasks = [ 1, 2 ];

			instance._reset();

			assert.areSame( 0, instance._tasks.length, 'instance._tasks cleared' );
		},

		'test _createNotification': function() {
			var mock = {
					editor: {},
					_createNotification: Aggregator.prototype._createNotification
				},
				ret = mock._createNotification();

			assert.areSame( 1, NotificationMock.callCount, 'Notification constructor call count' );
			assert.isTrue( NotificationMock.returned( ret ), 'ret was returned by NotificationMock' );
		},

		_getTaskMock: function( doneWeight, weight ) {
			if ( typeof doneWeight != 'number' ) {
				doneWeight = 0;
			}
			if ( typeof weight != 'number' ) {
				weight = 1;
			}

			return {
				_doneWeight: doneWeight,
				_weight: weight,
				isDone: function() {
					return this._doneWeight === this._weight;
				}
			};
		}
	} );

} )();