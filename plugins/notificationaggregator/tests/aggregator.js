/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,undo,notificationaggregator */

( function() {

	'use strict';

	bender.editor = {};

	var notificationInstanceMock = {
			show: sinon.spy(),
			hide: sinon.spy()
		},
		NotificationMock,
		Aggregator;

	bender.test( {
		setUp: function() {
			// Assign type to more convenient variable.
			Aggregator = CKEDITOR.plugins.notificationaggregator;
			// We'll replace original notification type so we can track calls, and
			// reduce dependencies.
			// Recreate stub each TC, so eg. callCount will be reset.
			NotificationMock = sinon.stub().returns( notificationInstanceMock );
			CKEDITOR.plugins.notification = NotificationMock;

			notificationInstanceMock.show.reset();
			notificationInstanceMock.hide.reset();
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
			var aggr = new Aggregator( this.editor, {} );
			aggr._getNotificationOptions = sinon.stub().returns( {} );
			aggr._updateNotification = sinon.spy();

			aggr.createTask();

			assert.areSame( 1, NotificationMock.callCount, 'Notification constructor call count' );
			sinon.assert.calledWithExactly( NotificationMock, this.editor, {} );

			// Ensure that it used _getNotificationOptions().
			sinon.assert.calledOnce( aggr._getNotificationOptions );

			// Ensure thad notification show was called.
			sinon.assert.calledOnce( notificationInstanceMock.show );
			assert.areSame( 1, aggr._updateNotification.callCount, '_updateNotification call count' );
		},

		'test createTask reuses a notification when have tasks': function() {
			// If there is already at least one task, we need to reuse notification.
			var aggr = new Aggregator( this.editor, {} );
			aggr._tasks = [ 0 ];
			// Create a dummy notification, so aggregate will think it have one.
			aggr.notification = {};
			aggr._updateNotification = sinon.spy();

			aggr.createTask();

			assert.areSame( 0, NotificationMock.callCount, 'Notification constructor call count' );
			assert.areSame( 1, aggr._updateNotification.callCount, '_updateNotification call count' );
		},

		'test createTask return value': function() {
			var aggr = new Aggregator( this.editor, {} ),
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

		'test finished': function() {
			var instance = new Aggregator( this.editor, {} ),
				notif = {
					hide: sinon.spy()
				};
			instance._reset = sinon.spy();
			instance.notification = notif;

			instance.finished();

			assert.areSame( 1, instance._reset.callCount, '_reset call count' );
			assert.areSame( 1, notif.hide.callCount, 'notification.update call count' );
		},

		'test isFinished': function() {
			var instance = new Aggregator( this.editor, {} );
			instance._tasks = [ 1, 2 ];
			assert.isFalse( instance.isFinished(), 'Return value' );
		},

		'test isFinished empty': function() {
			var instance = new Aggregator( this.editor, {} );
			instance._tasks = [];
			assert.isTrue( instance.isFinished(), 'Return value' );
		},

		'test _increaseTasks': function() {
			var instance = new Aggregator( this.editor, {} ),
				getNextId = sinon.stub( CKEDITOR.tools, 'getNextId' ).returns( 7 ),
				ret = instance._increaseTasks();

			getNextId.restore();

			assert.areSame( 1, instance._tasks.length, '_tasks array increased' );
			assert.isInstanceOf( Function, ret, 'Return type' );
			assert.areSame( 7, instance._tasks[ 0 ], 'Return value in _tasks[ 0 ]' );
			assert.areSame( 1, instance._tasksCount, '_tasksCount increased' );

		},

		'test _increaseTasks return fn': function() {
			var instance = new Aggregator( this.editor, {} ),
				ret;

			instance._updateNotification = sinon.spy();

			ret = instance._increaseTasks();

			ret();

			assert.areSame( 0, instance._tasks.length, '_tasks array increased' );
			assert.areSame( 1, instance._tasksCount, '_tasksCount remains the same' );
			assert.areSame( 1, instance._updateNotification.callCount, '_updateNotification call count' );
		},

		'test _increaseTasks returned fn multiple calls': function() {
			// Ensure that if function returned by _increaseTasks() will be called multiple times, it won't
			// cause any exception.
			var instance = new Aggregator( this.editor, {} ),
				restoreCallback;

			instance._updateNotification = sinon.spy();

			restoreCallback = instance._increaseTasks();

			restoreCallback();
			restoreCallback();
			restoreCallback();

			assert.areSame( 1, instance._updateNotification.callCount, '_updateNotification call count' );
		},

		'test _updateNotification template calls': function() {
			var instance = new Aggregator( this.editor, {} ),
				expectedParams = {
					max: 4,
					current: 3,
					percentage: 75
				};
			instance._message.output = sinon.spy();
			instance.notification = {
				update: sinon.spy()
			};

			instance._tasks = [ 1 ];
			instance._tasksCount = 4;

			instance._updateNotification();

			sinon.assert.calledWithExactly( instance._message.output, expectedParams );

			assert.areSame( 1, instance._message.output.callCount );
		},

		'test _updateNotification notification update': function() {
			var instance = new Aggregator( this.editor );
			instance._message.output = sinon.stub().returns( 'foo' );
			instance.notification = {
				update: sinon.spy()
			};

			instance._tasks = [ 1, 2, 3 ];
			instance._tasksCount = 4;

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
			instance._finish = sinon.spy();
			instance._tasks = [];
			instance._tasksCount = 2;

			instance._updateNotification();

			assert.areSame( 1, instance._finish.callCount, 'notification.finished call count' );
		},

		'test _finish': function() {
			var instance = new Aggregator( this.editor ),
				finishedListener = sinon.spy();

			instance.finished = sinon.spy();
			instance.on( 'finished', finishedListener );

			instance._finish();

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

		'test _reset': function() {
			var instance = new Aggregator( this.editor );
			instance._tasks = [ 1, 2 ];
			instance._tasksCount = 3;

			instance._reset();

			assert.areSame( 0, instance._tasksCount, 'instance._tasksCount zeroed' );
			assert.areSame( 0, instance._tasks.length, 'instance._tasks cleared' );
		},

		//_getMock: function() {
		//	var ret = new Aggregator( this.editor );
		//	ret.notification = {
		//		update: sinon.spy()
		//	};
		//
		//	return ret;
		//}
	} );

} )();