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
		AggregatorComplex,
		Aggregator;

	bender.test( {
		setUp: function() {
			// Assign types to more convenient variable.
			Aggregator = CKEDITOR.plugins.notificationaggregator;
			AggregatorComplex = Aggregator.Complex;
			// We don't need real editor, just mock it.
			this.editor = {};

			CKEDITOR.plugins.notification = NotificationMock;
		},

		'test createTask return value': function() {
			var instance = new AggregatorComplex( this.editor ),
				ret = instance.createTask();

			assert.isInstanceOf( Object, ret, 'Returned type' );
			assert.isInstanceOf( Function, ret.done, 'ret.done' );
			assert.isInstanceOf( Function, ret.update, 'ret.update' );
		},

		'test createTask creates weight entries': function() {
			var instance = new AggregatorComplex( this.editor );

			// We'll create a faked entries, so we ensure that new information will
			// be added to [ 1 ] index.
			instance._doneWeights = [ 2 ];
			instance._weights = [ 2 ];

			instance.createTask( 20 );

			assert.areSame( 2, instance._weights.length, 'instance.weights length' );
			assert.areSame( 2, instance._doneWeights.length, 'instance._doneWeights length' );

			arrayAssert.itemsAreSame( [ 2, 20 ], instance._weights, 'instance._weights items' );
			arrayAssert.itemsAreSame( [ 2, 0 ], instance._doneWeights, 'instance._doneWeights items' );
		},

		'test createTask ret.update': function() {
			// In this test we'll make 2 calls to update() method, and ensure that weight DO NOT sum internally,
			// but each call replaces previous value.
			var instance = new AggregatorComplex( this.editor ),
				ret = instance.createTask( 300 );

			ret.done = sinon.spy();
			instance._updateNotification = sinon.spy();

			// Force arrays to be correct.
			instance._weights = [ 300 ];
			instance._doneWeights = [ 0 ];

			ret.update( 50 );
			assert.areSame( 50, instance._doneWeights[ 0 ], 'Invalid value in _doneWeights after first call' );

			// Perform a subsequent call.
			ret.update( 200 );
			assert.areSame( 200, instance._doneWeights[ 0 ], 'Invalid value in _doneWeights after second call' );

			assert.areSame( 0, ret.done.callCount, 'ret.done was not called' );
			assert.areSame( 2, instance._updateNotification.callCount, 'instance._updateNotification call count' );
		},

		'test createTask ret.update with full weight': function() {
			// Here we'll call update with a full weight, that should result with callind done() method.
			var instance = new AggregatorComplex( this.editor ),
				ret = instance.createTask( 200 );

			// ALright we have task object, before moving forward lets replace done method with a spy.
			ret.done = sinon.spy();

			// Force arrays to be correct.
			instance._weights = [ 200 ];
			instance._doneWeights = [ 0 ];

			ret.update( 200 );

			assert.areSame( 1, ret.done.callCount, 'Invalid ret.done call count' );
		},

		'test createTask ret.update with too big weight': function() {
			// If a task is created with maximal weight of 200, we need to ensure that if developer
			// calls ret.update( 201 ) it will update the _doneWeights entry will be updated to the
			// maximal weight, instead of incorrect value.
			var originTaskCreate = sinon.stub( Aggregator.prototype, 'createTask' ).returns( sinon.spy() ),
				instance = new AggregatorComplex( this.editor ),
				ret = instance.createTask( 200 );

			// Force arrays to be correct.
			instance._weights = [ 200 ];
			instance._doneWeights = [ 0 ];

			ret.update( 201 );

			originTaskCreate.restore();
			assert.areEqual( 200, instance._doneWeights[ 0 ], 'Invalid value in _doneWeights' );
		},

		'test createTask ret.done': function() {
			var instance = new AggregatorComplex( this.editor ),
				originDone = sinon.spy(),
				originTaskCreate = sinon.stub( Aggregator.prototype, 'createTask' ).returns( originDone ),
				ret = instance.createTask( 300 );

			// Force arrays to be correct.
			instance._weights = [ 300 ];
			instance._doneWeights = [ 0 ];

			ret.done();

			// Restore original createTask in prototype.
			originTaskCreate.restore();

			assert.areSame( 300, instance._doneWeights[ 0 ], 'Invalid value in _doneWeights' );
			assert.areSame( 1, originDone.callCount, 'Aggregator.createTask callback call count' );
		},

		'test getPercentage one weight': function() {
			var instance = new AggregatorComplex( this.editor ),
				ret;

			instance._weights = [ 1000 ];
			instance._doneWeights = [ 123.45 ];

			ret = instance.getPercentage();

			// By default result should not be rounded.
			assert.areSame( 12.345, ret, 'Invalid return value' );
		},

		'test getPercentage rounded': function() {
			var instance = new AggregatorComplex( this.editor ),
				ret;

			instance._weights = [ 1000 ];
			instance._doneWeights = [ 123.41 ];

			ret = instance.getPercentage( true );

			assert.areSame( 12, ret, 'Invalid return value' );
		},

		'test getPercentage multiple weights': function() {
			var instance = new AggregatorComplex( this.editor ),
				ret;

			instance._weights = [ 50, 30, 20 ];
			instance._doneWeights = [ 10, 25 ];

			ret = instance.getPercentage();

			assert.areSame( 35, ret, 'Invalid return value' );
		},

		'test getPercentage empty': function() {
			// Ensure that nothing bad happens if htere are no weights at all.
			var instance = new AggregatorComplex( this.editor ),
				ret = instance.getPercentage();

			assert.areSame( 100, ret, 'Invalid return value' );
		},

		'test _reset': function() {
			var instance = new AggregatorComplex( this.editor );

			instance._weights = [ 1 ];
			instance._doneWeights = [ 1 ];

			instance._reset();

			assert.areSame( 0, instance._weights.length, 'Invalid instance._weights length' );
			assert.areSame( 0, instance._doneWeights.length, 'Invalid instance._doneWeights length' );
		}
	} );

} )();