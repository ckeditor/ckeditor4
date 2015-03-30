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
			var aggr = new Aggregator( this.editor, 'msg', 'single msg' );

			assert.areSame( this.editor, aggr.editor, 'Correct editor is stored' );
			assert.isInstanceOf( Array, aggr._tasks, 'Created valid _tasks property' );

			assert.isInstanceOf( CKEDITOR.template, aggr._message, '_message property type' );
			assert.isInstanceOf( CKEDITOR.template, aggr._singularMessage, '_singularMessage property type' );

			// Test message values.
			assert.areSame( 'msg', aggr._message.output() );
			assert.areSame( 'single msg', aggr._singularMessage.output() );
		},

		'test constructor no singular message': function() {
			var aggr = new Aggregator( this.editor, 'msg' );

			assert.isNull( aggr._singularMessage, '_singularMessage value' );
		},

		'test instances does not share _tasks': function() {
			var instance1 = new Aggregator( this.editor, '' ),
				instance2 = new Aggregator( this.editor, '' );

			instance1._tasks.push( 1 );

			assert.areSame( 0, instance2._tasks.length, 'instance2 _tasks remains empty' );
		},

		// If aggregate has no tasks, it should create notification object in createTask method.
		'test createTask creates a notification': function() {
			var aggr = new Aggregator( this.editor, '' ),
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

		// If there is already at least one task, we need to reuse notification.
		'test createTask reuses a notification when have tasks': function() {
			var aggr = new Aggregator( this.editor, '' );
			aggr._tasks = [ 0 ];
			// Create a dummy notification, so aggregate will think it have one.
			aggr.notification = {};
			aggr.update = sinon.spy();

			aggr.createTask();

			assert.areSame( 0, NotificationMock.callCount, 'Notification constructor call count' );
			assert.areSame( 1, aggr.update.callCount, 'update call count' );
		},

		'test createTask returns value': function() {
			var aggr = new Aggregator( this.editor, '' ),
				taskMock = {
					on: sinon.spy()
				},
				ret;
			aggr._addTask = sinon.stub().returns( taskMock );
			aggr.update = sinon.spy();

			ret = aggr.createTask();

			assert.areSame( taskMock, ret, 'Return value' );
			// Ensure that methods was used.
			sinon.assert.calledOnce( aggr._addTask );
		},

		// Ensure that task will get listeners in createTask.
		'test createTask adds listeners': function() {
			var aggr = new Aggregator( this.editor, '' ),
				taskMock = {
					on: sinon.spy()
				},
				ret;
			aggr._addTask = sinon.stub().returns( taskMock );
			aggr.update = sinon.spy();

			ret = aggr.createTask();

			assert.areSame( 3, taskMock.on.callCount, 'Added listeners count' );
			sinon.assert.calledWithExactly( taskMock.on, 'done', aggr._onTaskDone, aggr );
		},

		// Ensure that nothing bad happens if htere are no weights at all.
		'test getPercentage empty': function() {
			var instance = new Aggregator( this.editor, '' );

			instance.getTaskCount = sinon.stub().returns( 0 );

			assert.areSame( 1, instance.getPercentage(), 'Invalid return value' );
		},

		'test isFinished': function() {
			var instance = new Aggregator( this.editor, '' );
			instance.getDoneTaskCount = sinon.stub().returns( 2 );
			instance.getTaskCount = sinon.stub().returns( 2 );
			assert.isTrue( instance.isFinished(), 'Return value' );
		},

		'test isFinished falsy': function() {
			var instance = new Aggregator( this.editor, '' );
			instance.getDoneTaskCount = sinon.stub().returns( 1 );
			instance.getTaskCount = sinon.stub().returns( 2 );
			assert.isFalse( instance.isFinished(), 'Return value' );
		},

		'test isFinished empty': function() {
			var instance = new Aggregator( this.editor, '' );
			instance.getDoneTaskCount = sinon.stub().returns( 0 );
			instance.getTaskCount = sinon.stub().returns( 0 );
			assert.isTrue( instance.isFinished(), 'Return value' );
		},

		'test getTaskCount': function() {
			var instance = new Aggregator( this.editor, '' );
			instance._tasks = [ 0, 0 ];

			assert.areSame( 2, instance.getTaskCount() );
		},

		'test getDoneTaskCount': function() {
			var instance = new Aggregator( this.editor, '' );
			instance._doneTasks = 3;

			assert.areSame( 3, instance.getDoneTaskCount() );
		},

		'test _addTask': function() {
			var instance = new Aggregator( this.editor, '' ),
				ret = instance._addTask( { weight: 20 } );

			assert.areSame( 1, instance._tasks.length, '_tasks array increased' );
			assert.isInstanceOf( Task, ret, 'Return type' );
			assert.areSame( ret, instance._tasks[ 0 ], 'Return value in _tasks[ 0 ]' );
			assert.areSame( 20, ret._weight );
		},

		// Ensure that aggregator weight cache (_totalWeights) is increased by the
		// addTask call.
		'test _addTask increases weight': function() {
			var instance = new Aggregator( this.editor, '' );

			instance._addTask( { weight: 20 } );

			assert.areSame( 20, instance._totalWeights );
		},

		'test update': function() {
			var instance = new Aggregator( this.editor, '' );
			instance.isFinished = sinon.stub().returns( false );
			instance._updateNotification = sinon.spy();
			instance._finish = sinon.spy();

			instance.update();

			assert.areSame( 1, instance._updateNotification.callCount, '_updateNotification call count' );
			assert.areSame( 0, instance._finish.callCount, '_finish was not called' );
		},

		'test update finished': function() {
			var instance = new Aggregator( this.editor, '' ),
				finishSpy = sinon.spy();

			instance.isFinished = sinon.stub().returns( true );
			instance._updateNotification = sinon.spy();

			instance.on( 'finished', finishSpy );

			instance.update();

			assert.areSame( 1, instance._updateNotification.callCount, '_updateNotification call count' );
			assert.areSame( 1, finishSpy.callCount, 'finished events count' );
		},

		'test update - cancel finished event': function() {
			var instance = new Aggregator( this.editor, '' );
			instance.isFinished = sinon.stub().returns( true );
			instance._updateNotification = sinon.spy();
			instance.fire = sinon.stub().returns( false );
			instance.finished = sinon.spy();

			instance.update();

			// Method finished should not be called.
			assert.areSame( 0, instance.finished.callCount, 'finished call count' );
		},

		'test _updateNotification': function() {
			var instance = new Aggregator( this.editor, '' ),
				expectedParams = {
					message: 'foo',
					progress: 0.75
				};

			instance._getNotificationMessage = sinon.stub().returns( 'foo' );
			instance.getPercentage = sinon.stub().returns( 0.75 );
			instance.notification = new NotificationMock();

			instance._updateNotification();

			sinon.assert.calledWithExactly( instance.notification.update, expectedParams );

			assert.areSame( 1, instance.getPercentage.callCount, 'instance.getPercentage call count' );
		},

		'test _updateNotification notification call': function() {
			var instance = new Aggregator( this.editor, '' );
			instance._message.output = sinon.stub().returns( 'foo' );
			instance.getDoneTaskCount = sinon.stub().returns( 1 );
			instance.getTaskCount = sinon.stub().returns( 4 );
			instance.getPercentage = sinon.stub().returns( 0.25 );
			instance.notification = new NotificationMock();

			instance._updateNotification();

			sinon.assert.calledWithExactly( instance.notification.update, {
				message: 'foo',
				progress: 0.25
			} );

			assert.areSame( 1, instance.notification.update.callCount, 'notification.update call count' );
		},

		'test _removeTask': function() {
			var instance = new Aggregator( this.editor, '' );

			instance.update = sinon.spy();
			instance._tasks = [ 1, 2, 3 ];

			instance._removeTask( 2 );

			assert.areSame( 2, instance._tasks.length, 'instance._tasks length' );
			arrayAssert.itemsAreSame( [ 1, 3 ], instance._tasks );
			assert.areSame( 1, instance.update.callCount, 'instance.update call count' );
		},

		// If aggregator has some _doneWeights already added, and removed task
		// has non-zero _doneWeight then it should be subtracted from the aggregator.
		'test _removeTask subtracts doneWeight': function() {
			var instance = new Aggregator( this.editor, '' ),
				taskMock = {
					_doneWeight: 10
				};

			instance.update = sinon.spy();
			instance._tasks = [ taskMock ];
			instance._doneWeights = 30;

			instance._removeTask( taskMock );

			assert.areSame( 20, instance._doneWeights, 'instance._doneWeights reduced' );
		},

		'test cancel() subtracts from totalWeight': function() {
			var aggregator = new Aggregator( this.editor, '' ),
				task1 = aggregator.createTask( { weight: 10 } ),
				task2 = aggregator.createTask( { weight: 10 } );

			aggregator.createTask( { weight: 10 } ); // task 3
			aggregator.createTask( { weight: 10 } ); // task 4

			task1.done();

			assert.areSame( 25, Math.round( aggregator.getPercentage() * 100 ) );

			task2.cancel();

			assert.areSame( 33, Math.round( aggregator.getPercentage() * 100 ) );
		},

		'test cancel() subtracts from totalWeight and doneWeight': function() {
			var aggregator = new Aggregator( this.editor, '' ),
				task1 = aggregator.createTask( { weight: 10 } ),
				task2 = aggregator.createTask( { weight: 10 } );

			aggregator.createTask( { weight: 10 } ); // task 3
			aggregator.createTask( { weight: 10 } ); // task 4

			task1.done();
			task2.update( 6 );

			// 16 / 40
			assert.areSame( 40, Math.round( aggregator.getPercentage() * 100 ) );

			task2.cancel();

			// 10 / 30
			assert.areSame( 33, Math.round( aggregator.getPercentage() * 100 ) );
		},

		'test canceling the last task finishes aggregator': function() {
			var aggregator = new Aggregator( this.editor, '' ),
				task1 = aggregator.createTask( { weight: 10 } ),
				task2 = aggregator.createTask( { weight: 10 } ),
				finishedSpy = sinon.spy();

			aggregator.on( 'finished', finishedSpy );

			task1.done();
			task2.update( 5 );

			// 15 / 20
			assert.areSame( 75, Math.round( aggregator.getPercentage() * 100 ) );

			task2.cancel();

			// 10 / 10
			assert.areSame( 100, Math.round( aggregator.getPercentage() * 100 ) );
			assert.isTrue( aggregator.isFinished(), 'isFinished()' );
			assert.isTrue( finishedSpy.calledOnce, 'finished was fired' );
		},

		// Ensure that subsequent remove attempt for the same task won't result with an error.
		'test _removeTask subsequent': function() {
			var instance = new Aggregator( this.editor, '' );

			instance.update = sinon.spy();
			instance._tasks = [ 1, 2 ];

			instance._removeTask( 1 );
			// And the second call.
			instance._removeTask( 1 );

			assert.areSame( 1, instance._tasks.length, 'instance._tasks length' );
		},

		'test _getNotificationMessage': function() {
			var instance = new Aggregator( this.editor, '' );
			instance._message = {
				output: sinon.stub().returns( 'foo' )
			};
			instance.getTaskCount = sinon.stub().returns( 4 );
			instance.getDoneTaskCount = sinon.stub().returns( 1 );
			instance.getPercentage = sinon.stub().returns( 0.25 );

			assert.areSame( 'foo', instance._getNotificationMessage() );
			sinon.assert.calledWithExactly( instance._message.output, {
				current: 1,
				max: 4,
				percentage: 25
			} );
		},

		// When there is only one task and singular message was defined,
		// we should use the singular message.
		'test _getNotificationMessage single': function() {
			var instance = new Aggregator( this.editor, 'foo' );
			instance._singularMessage = {
				output: sinon.stub().returns( 'bar' )
			};
			instance.getTaskCount = sinon.stub().returns( 1 );
			instance.getDoneTaskCount = sinon.stub().returns( 0 );
			instance.getPercentage = sinon.stub().returns( 0.2 );

			assert.areSame( 'bar', instance._getNotificationMessage() );
			sinon.assert.calledWithExactly( instance._singularMessage.output, {
				current: 0,
				max: 1,
				percentage: 20
			} );
		},

		// When only a single task remained and singular message was defined,
		// we should still use the plural message.
		'test _getNotificationMessage plural message even if single message defined': function() {
			var instance = new Aggregator( this.editor, 'foo', 'bar' );

			instance.getTaskCount = sinon.stub().returns( 2 );
			instance.getDoneTaskCount = sinon.stub().returns( 1 );

			assert.areSame( 'foo', instance._getNotificationMessage() );
		},

		// When there is only one task, BUT NO SINGULAR MESSAGE was
		// defined, the standard message is used.
		'test _getNotificationMessage missing singular': function() {
			var instance = new Aggregator( this.editor, 'foo' );
			instance.getTaskCount = sinon.stub().returns( 1 );
			instance.getDoneTaskCount = sinon.stub().returns( 0 );

			assert.areSame( 'foo', instance._getNotificationMessage() );
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

		'test _onTaskUpdate': function() {
			var instance = new Aggregator( this.editor, '' ),
				updateEvent = {
					data: 30
				};

			instance.update = sinon.spy();
			instance._onTaskUpdate( updateEvent );

			assert.areSame( 30, instance._doneWeights, '_doneWeights was modified' );
			assert.areSame( 1, instance.update.callCount, 'instance.update called' );
		},

		'test _onTaskDone': function() {
			var instance = new Aggregator( this.editor, '' );

			instance.update = sinon.spy();

			instance._onTaskDone();

			assert.areSame( 1, instance._doneTasks, '_doneTasks was not incremented' );
			assert.areSame( 1, instance.update.callCount, 'instance.update call count' );
		}
	} );

} )();
