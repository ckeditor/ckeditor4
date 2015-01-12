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
			assert.isInstanceOf( Array, aggr._threads, 'Created valid _threads property' );
		},

		'test instances does not share _threads': function() {
			var instance1 = new Aggregator( this.editor ),
				instance2 = new Aggregator( this.editor );

			instance1._threads.push( 1 );

			assert.areSame( 0, instance2._threads.length, 'instance2 _threads remains empty' );
		},

		'test createThread creates a notification without threads': function() {
			// If aggregate has no threads, it should create notification object in createThread method.
			var aggr = new Aggregator( this.editor, {} );
			aggr._getNotificationOptions = sinon.stub().returns( {} );

			aggr.createThread();

			assert.areSame( 1, NotificationMock.callCount, 'Notification constructor call count' );
			sinon.assert.calledWithExactly( NotificationMock, this.editor, {} );

			// Ensure that it used _getNotificationOptions().
			sinon.assert.calledOnce( aggr._getNotificationOptions );

			// Ensure thad notification show was called.
			sinon.assert.calledOnce( notificationInstanceMock.show );
		},

		'test createThread reuses a notification when have threads': function() {
			// If there is already at least one thread, we need to reuse notification.
			var aggr = new Aggregator( this.editor, {} );
			aggr._threads = [ 0 ];

			aggr.createThread();

			assert.areSame( 0, NotificationMock.callCount, 'Notification constructor call count' );
		},

		'test createThread return value': function() {
			var aggr = new Aggregator( this.editor, {} ),
				expectedCallback = function() {
				},
				ret;
			aggr._increaseThreads = sinon.stub().returns( expectedCallback );

			ret = aggr.createThread();

			assert.areSame( expectedCallback, ret, 'Return value' );
			// Ensure that methods was used.
			sinon.assert.calledOnce( aggr._increaseThreads );
		},

		'test _increaseThreads': function() {
			var instance = new Aggregator( this.editor, {} ),
				getNextId = sinon.stub( CKEDITOR.tools, 'getNextId' ).returns( 7 ),
				ret = instance._increaseThreads();

			getNextId.restore();

			assert.areSame( 1, instance._threads.length, '_threads array increased' );
			assert.isInstanceOf( Function, ret, 'Return type' );
			assert.areSame( 7, instance._threads[ 0 ], 'Return value in _threads[ 0 ]' );
		},

		'test _increaseThreads return fn': function() {
			var instance = new Aggregator( this.editor, {} ),
				ret = instance._increaseThreads();

			ret();

			assert.areSame( 0, instance._threads.length, '_threads array increased' );
		},

		'test _increaseThreads returned fn multiple calls': function() {
			// Ensure that if function returned by _increaseThreads() will be called multiple times, it won't
			// cause any exception.
			var instance = new Aggregator( this.editor, {} ),
				restoreCallback;

			restoreCallback = instance._increaseThreads();

			restoreCallback();
			restoreCallback();
			restoreCallback();

			assert.isTrue( true );
		},
	} );

} )();