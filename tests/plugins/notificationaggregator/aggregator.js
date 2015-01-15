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
			Aggregator = CKEDITOR.plugins.notificationaggregator;
			Task = CKEDITOR.plugins.notificationaggregator.Task;
			// We don't need real editor, just mock it.
			this.editor = {};
			// We'll replace original notification type so we can track calls, and
			// reduce dependencies.
			// Reassign and reset the spy each TC, so eg. callCount will be reset.
			CKEDITOR.plugins.notification = NotificationMock;
			NotificationMock.reset();
		},

		'test exposes Aggregator type': function() {
			assert.isInstanceOf( Function, CKEDITOR.plugins.notificationaggregator, 'Aggregator type is not exposed' );
		},

		'test constructor': function() {
			var notifConfig = {},
				aggr = new Aggregator( this.editor, notifConfig );

			assert.areSame( this.editor, aggr.editor, 'Correct editor is stored' );
			assert.isInstanceOf( Array, aggr._tasks, 'Created valid _tasks property' );
			assert.areSame( 0, aggr._tasksCount, 'Initial _tasksCount value' );

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
			var aggr = new Aggregator( this.editor );
			aggr._updateNotification = sinon.spy();

			aggr.createTask();

			assert.areSame( 1, NotificationMock.callCount, 'Notification constructor call count' );
			sinon.assert.calledWithExactly( NotificationMock, this.editor, {
				type: 'progress'
			} );

			// Ensure thad notification show was called.
			sinon.assert.calledOnce( NotificationMock.lastCall.returnValue.show );

			assert.areSame( 1, aggr._updateNotification.callCount, '_updateNotification call count' );
		},

		'test createTask reuses a notification when have tasks': function() {
			// If there is already at least one task, we need to reuse notification.
			var aggr = new Aggregator( this.editor );
			aggr._tasks = [ 0 ];
			// Create a dummy notification, so aggregate will think it have one.
			aggr.notification = {};
			aggr._updateNotification = sinon.spy();

			aggr.createTask();

			assert.areSame( 0, NotificationMock.callCount, 'Notification constructor call count' );
			assert.areSame( 1, aggr._updateNotification.callCount, '_updateNotification call count' );
		},

		'test createTask return value': function() {
			var aggr = new Aggregator( this.editor ),
				expectedCallback = function() {
				},
				ret;
			aggr._increaseTasks = sinon.stub().returns( expectedCallback );
			aggr._updateNotification = sinon.spy();

			ret = aggr.createTask();

			assert.areSame( expectedCallback, ret, 'Return value' );
			// Ensure that methods was used.
			sinon.assert.calledOnce( aggr._increaseTasks );
		},

		'test getPercentage rounded': function() {
			var instance = new Aggregator( this.editor ),
				ret;

			instance._tasks = [ this._getTaskMock( 123.45, 1000 ) ];
			instance._getDoneWeights = sinon.stub().returns( 123.45 );
			instance._getWeights = sinon.stub().returns( 1000 );

			ret = instance.getPercentage( true );

			assert.areSame( 12, ret, 'Invalid return value' );
		},

		'test getPercentage empty': function() {
			// Ensure that nothing bad happens if htere are no weights at all.
			var instance = new Aggregator( this.editor ),
				ret = instance.getPercentage();

			assert.areSame( 100, ret, 'Invalid return value' );
		},

		'test finished': function() {
			var instance = new Aggregator( this.editor ),
				notif = new NotificationMock();
			instance.notification = notif;

			instance.finished();

			assert.areSame( 1, notif.hide.callCount, 'notification.update call count' );
		},

		'test isFinished': function() {
			var instance = new Aggregator( this.editor );
			instance._getDoneTasks = sinon.stub().returns( 2 );
			instance._tasksCount = 2;
			assert.isTrue( instance.isFinished(), 'Return value' );
		},

		'test isFinished falsy': function() {
			var instance = new Aggregator( this.editor );
			instance._getDoneTasks = sinon.stub().returns( 1 );
			instance._tasksCount = 2;
			assert.isFalse( instance.isFinished(), 'Return value' );
		},

		'test isFinished empty': function() {
			var instance = new Aggregator( this.editor );
			instance._getDoneTasks = sinon.stub().returns( 0 );
			instance._tasksCount = 0;
			assert.isTrue( instance.isFinished(), 'Return value' );
		},

		'test _increaseTasks': function() {
			var instance = new Aggregator( this.editor ),
				ret = instance._increaseTasks( { weight: 20 } );

			assert.areSame( 1, instance._tasks.length, '_tasks array increased' );
			assert.isInstanceOf( Task, ret, 'Return type' );
			assert.areSame( ret, instance._tasks[ 0 ], 'Return value in _tasks[ 0 ]' );
			assert.areSame( 1, instance._tasksCount, '_tasksCount increased' );
			assert.areSame( 20, ret._weight );
		},

		'test _increaseTasks default value': function() {
			var instance = new Aggregator( this.editor ),
				ret = instance._increaseTasks( {} );

			assert.areSame( 1, ret._weight );
		},

		'test _updateNotification template calls': function() {
			var instance = new Aggregator( this.editor ),
				expectedParams = {
					max: 4,
					current: 3,
					percentage: 75
				};
			instance._message.output = sinon.spy();
			instance._tasksCount = 4;
			instance._getDoneTasks = sinon.stub().returns( 3 );
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
			instance._tasksCount = 4;
			instance.getPercentage = sinon.stub().returns( 25 );
			instance.notification = new NotificationMock();

			instance._updateNotification();

			sinon.assert.calledWithExactly( instance.notification.update, {
				message: 'foo',
				progress: 0.25
			} );

			assert.areSame( 1, instance.notification.update.callCount, 'notification.update call count' );
		},

		'test _updateNotification finished': function() {
			// When there are no more tasks, notification should be considered as finished.
			var instance = new Aggregator( this.editor );
			instance.notification = new NotificationMock();
			instance._finish = sinon.spy();
			instance.isFinished = sinon.stub().returns( true );

			instance._updateNotification();

			assert.areSame( 1, instance._finish.callCount, 'notification.finished call count' );
		},

		'test _finish': function() {
			var editor = this.editor,
				instance = new Aggregator( editor ),
				finishedListener = sinon.spy( function( evt ) {
					assert.areSame( editor, evt.editor, 'Correct editor assinged to the event' );
				} );

			instance._reset = sinon.spy();
			instance.finished = sinon.spy();
			instance.on( 'finished', finishedListener );

			instance._finish();

			assert.areSame( 1, instance._reset.callCount, 'instance._reset call count' );
			assert.areSame( 1, instance.finished.callCount, 'instance.finished call count' );
			assert.areSame( 1, finishedListener.callCount, 'finished listener call count' );
		},

		'test _finish canceling event': function() {
			var instance = new Aggregator( this.editor );

			instance.finished = sinon.spy();
			instance.on( 'finished', function( evt ) {
				evt.cancel();
			} );

			instance._finish();

			assert.areSame( 0, instance.finished.callCount, 'instance.finished was not called' );
		},

		'test _removeTask': function() {
			var instance = new Aggregator( this.editor );

			instance._updateNotification = sinon.spy();
			instance._tasks = [ 1, 2, 3 ];
			instance._tasksCount = 3;

			instance._removeTask( 2 );

			assert.areSame( 2, instance._tasks.length, 'instance._tasks length' );
			assert.areSame( 2, instance._tasksCount, 'instance._tasksCount updated' );
			arrayAssert.itemsAreSame( [ 1, 3 ], instance._tasks );
			assert.areSame( 1, instance._updateNotification.callCount, 'instance._updateNotification call count' );

		},

		'test _removeTask subsequent': function() {
			// Ensure that subsequent remove attempt for the same task won't result with an error.
			var instance = new Aggregator( this.editor );

			instance._updateNotification = sinon.spy();
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

			assert.areSame( 25, instance._getWeights(), 'Invalid return value' );
		},

		'test _getDoneWeights': function() {
			var instance = new Aggregator( this.editor );

			instance._tasks = [
				this._getTaskMock( 10, 15 ),
				this._getTaskMock( 15, 15 )
			];

			assert.areSame( 25, instance._getDoneWeights(), 'Invalid return value' );
		},

		'test _reset': function() {
			var instance = new Aggregator( this.editor );
			instance._tasks = [ 1, 2 ];
			instance._tasksCount = 3;

			instance._reset();

			assert.areSame( 0, instance._tasksCount, 'instance._tasksCount zeroed' );
			assert.areSame( 0, instance._tasks.length, 'instance._tasks cleared' );
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