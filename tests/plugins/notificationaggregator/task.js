/* bender-tags: unit */
/* bender-ckeditor-plugins: notificationaggregator */

( function() {

	'use strict';

	var Task,
		Aggregator;

	bender.test( {
		setUp: function() {
			// Assign types to more convenient variable.
			Aggregator = CKEDITOR.plugins.notificationaggregator;
			Task = Aggregator.Task;
			// We don't need real editor, just mock it.
			this.editor = {};
			// Aggregator mock.
			this.aggregator = {
				_updateNotification: sinon.spy()
			};
		},

		'test subsequent update': function() {
			// In this test we'll make 2 calls to update() method, and ensure that weight DO NOT sum internally,
			// but each value replaces the previous one.
			var instance = new Task( this.aggregator, 300 );

			instance.done = sinon.spy();

			instance.update( 50 );
			assert.areSame( 50, instance._doneWeight, 'Invalid value in _doneWeight after first call' );

			// Perform a subsequent call.
			instance.update( 200 );
			assert.areSame( 200, instance._doneWeight, 'Invalid value in _doneWeight after second call' );

			assert.areSame( 0, instance.done.callCount, 'instance.done was not called' );
			assert.areSame( 2, instance.aggregator._updateNotification.callCount, 'instance.aggregator._updateNotification call count' );
		},

		'test update with full weight': function() {
			// Here we'll call update with a full weight, that should result with callind done() method.
			var instance = new Task( this.aggregator, 200 );

			// ALright we have task object, before moving forward lets replace done method with a spy.
			instance.done = sinon.spy();

			instance.update( 200 );

			assert.areSame( 200, instance._doneWeight, 'instance._doneWeight' );
			assert.areSame( 1, instance.done.callCount, 'instance.done call count' );
		},

		'test update with too big weight': function() {
			// If a task is created with maximal weight of 200, we need to ensure that if developer
			// calls ret.update( 201 ) it will update the _doneWeights entry will be updated to the
			// maximal weight, instead of incorrect value.
			var instance = new Task( this.aggregator, 200 );

			instance.update( 201 );

			assert.areEqual( 200, instance._doneWeight, 'Invalid value in _doneWeight' );
		},

		'test done': function() {
			var instance = new Task( this.aggregator, 300 );

			instance.done();

			assert.areSame( 300, instance._doneWeight, 'Invalid value in _doneWeight' );
		},

		'test isDone': function() {
			var instance = new Task( this.aggregator, 300 );
			instance._doneWeight = 300;
			assert.isTrue( instance.isDone(), 'Invalid return value' );
		},

		'test isDone falsy': function() {
			var instance = new Task( this.aggregator, 300 );
			instance._doneWeight = 100;
			assert.isFalse( instance.isDone(), 'Invalid return value' );
		}
	} );

} )();