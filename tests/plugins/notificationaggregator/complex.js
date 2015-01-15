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
				ret = instance.createTask( { weight: 50 } );

			assert.isInstanceOf( Object, ret, 'Returned type' );
			assert.isInstanceOf( Function, ret.done, 'ret.done' );
			assert.isInstanceOf( Function, ret.update, 'ret.update' );

			assert.areSame( 50, ret._weight, 'ret._weight' );
		},

		'test getPercentage': function() {
			var instance = new AggregatorComplex( this.editor ),
				ret;

			instance._tasks = [ this._getTaskMock( 123.45, 1000 ) ];
			instance._getDoneWeights = sinon.stub().returns( 123.45 );
			instance._getWeights = sinon.stub().returns( 1000 );

			ret = instance.getPercentage();

			// By default result should not be rounded.
			assert.areSame( 12.345, ret, 'Invalid return value' );
		},

		'test getPercentage rounded': function() {
			var instance = new AggregatorComplex( this.editor ),
				ret;

			instance._tasks = [ this._getTaskMock( 123.45, 1000 ) ];
			instance._getDoneWeights = sinon.stub().returns( 123.45 );
			instance._getWeights = sinon.stub().returns( 1000 );

			ret = instance.getPercentage( true );

			assert.areSame( 12, ret, 'Invalid return value' );
		},

		'test getPercentage empty': function() {
			// Ensure that nothing bad happens if htere are no weights at all.
			var instance = new AggregatorComplex( this.editor ),
				ret = instance.getPercentage();

			assert.areSame( 100, ret, 'Invalid return value' );
		},

		'test _getDoneWeights': function() {
			var instance = new AggregatorComplex( this.editor );

			instance._tasks = [
				this._getTaskMock( 10, 15 ),
				this._getTaskMock( 15, 15 )
			];

			assert.areSame( 25, instance._getDoneWeights(), 'Invalid return value' );
		},

		'test _getWeights': function() {
			var instance = new AggregatorComplex( this.editor );

			instance._tasks = [
				this._getTaskMock( 0, 10 ),
				this._getTaskMock( 0, 15 )
			];

			assert.areSame( 25, instance._getWeights(), 'Invalid return value' );
		},

		'test _removeTask': function() {
			var instance = new AggregatorComplex( this.editor );

			instance._updateNotification = sinon.spy();
			instance._tasks = [
				this._getTaskMock( 0, 10 ),
				this._getTaskMock( 0, 15 ),
				this._getTaskMock( 0, 20 )
			];
			instance._tasksCount = 3;

			instance._removeTask( instance._tasks[ 1 ] );

			assert.areSame( 2, instance._tasks.length, 'instance._tasks length' );
			assert.areSame( 2, instance._tasksCount, 'instance._tasksCount updated' );

			// Identify tasks and ensure that the correct one was removed.
			assert.areSame( 10, instance._tasks[ 0 ]._weight, 'Invalid weight of first task' );
			assert.areSame( 20, instance._tasks[ 1 ]._weight, 'Invalid weight of second task' );

			assert.areSame( 1, instance._updateNotification.callCount, 'instance._updateNotification call count' );

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
				_weight: weight
			};
		}
	} );

} )();