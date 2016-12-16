/* bender-tags: editor,unit */

bender.test(
{
	test_inherit: function() {
		// Create a testClass that inherits from CKEDITOR.event.
		var testClass = function() {
			CKEDITOR.event.call( this );
		};
		testClass.prototype = CKEDITOR.event.prototype;

		var calls = [];

		var testInstance = new testClass();

		testInstance.on( 'someEvent', function( ev ) {
			assert.areSame( testInstance, this, 'Scope 1 is not valid' );

			assert.areSame( 'someEvent', ev.name, 'ev.name (1) is wrong' );
			assert.areSame( testInstance, ev.sender, 'ev.sender (1) is wrong' );
			assert.isUndefined( ev.editor, 'ev.editor (1) is wrong' );
			assert.isUndefined( ev.data, 'ev.data (1) is wrong' );
			assert.isUndefined( ev.listenerData, 'ev.listenerData (1) is wrong' );

			calls.push( 'a' );
		} );

		testInstance.on( 'someEvent', function( ev ) {
			assert.areSame( testInstance, this, 'Scope 2 is not valid' );

			assert.areSame( 'someEvent', ev.name, 'ev.name (2) is wrong' );
			assert.areSame( testInstance, ev.sender, 'ev.sender (2) is wrong' );
			assert.isUndefined( ev.editor, 'ev.editor (2) is wrong' );
			assert.isUndefined( ev.data, 'ev.data (2) is wrong' );
			assert.isUndefined( ev.listenerData, 'ev.listenerData (2) is wrong' );

			calls.push( 'b' );
		} );

		assert.areSame( true, testInstance.fire( 'someEvent' ) );

		assert.areSame( 2, calls.length, 'number of calls doesn\'t match' );
		assert.areSame( 'a,b', calls.toString() );
	},

	test_implementOn: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = { someprop: 'Test' };
		CKEDITOR.event.implementOn( testObject );

		assert.areSame( 'Test', testObject.someprop );

		var calls = [];

		testObject.on( 'someEvent', function( ev ) {
			assert.areSame( testObject, this, 'Scope 1 is not valid' );

			assert.areSame( 'someEvent', ev.name, 'ev.name (1) is wrong' );
			assert.areSame( testObject, ev.sender, 'ev.sender (1) is wrong' );
			assert.isUndefined( ev.editor, 'ev.editor (1) is wrong' );
			assert.isUndefined( ev.data, 'ev.data (1) is wrong' );
			assert.isUndefined( ev.listenerData, 'ev.listenerData (1) is wrong' );

			calls.push( 'a' );
		} );

		testObject.on( 'someEvent', function( ev ) {
			assert.areSame( testObject, this, 'Scope 2 is not valid' );

			assert.areSame( 'someEvent', ev.name, 'ev.name (2) is wrong' );
			assert.areSame( testObject, ev.sender, 'ev.sender (2) is wrong' );
			assert.isUndefined( ev.editor, 'ev.editor (2) is wrong' );
			assert.isUndefined( ev.data, 'ev.data (2) is wrong' );
			assert.isUndefined( ev.listenerData, 'ev.listenerData (2) is wrong' );

			calls.push( 'b' );
		} );

		assert.areSame( true, testObject.fire( 'someEvent' ) );

		assert.areSame( 2, calls.length, 'number of calls doesn\'t match' );
		assert.areSame( 'a,b', calls.toString() );
	},

	test_eventNameCase: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		var counter = 0;

		// Event Names are case sensitive.

		testObject.on( 'someEvent', function( ev ) {
			assert.areSame( 'someEvent', ev.name, 'ev.name (someEvent) is wrong' );
			counter++;
		} );

		testObject.on( 'SomeEvent', function( ev ) {
			assert.areSame( 'SomeEvent', ev.name, 'ev.name (SomeEvent) is wrong' );
			counter++;
		} );

		testObject.fire( 'someEvent' );
		assert.areSame( 1, counter, '"someEvent" calls doesn\'t match' );

		counter = 0;

		testObject.fire( 'SomeEvent' );
		assert.areSame( 1, counter, '"SomeEvent" calls doesn\'t match' );
	},

	test_scope: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		// Counter used just to check that the calls are effectively done.
		var counter = 0;

		var testScope = {};

		testObject.on( 'someEvent', function( ev ) {
			assert.areSame( testObject, this, 'scope (testObject) is wrong' );
			assert.areSame( testObject, ev.sender, 'sender (testObject) is wrong' );
			counter++;
		} );

		testObject.on( 'someEvent', function( ev ) {
			assert.areSame( testScope, this, 'scope (testScope) is wrong' );
			assert.areSame( testObject, ev.sender, 'sender (testScope) is wrong' );
			counter++;
		}, testScope );

		testObject.fire( 'someEvent' );

		assert.areSame( 2, counter, 'wrong number of calls' );
	},

	test_listenerData: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		// Counter used just to check that the calls are effectively done.
		var counter = 0;

		testObject.on( 'someEvent', function( ev ) {
			assert.areSame( 'Test1', ev.listenerData, 'listenerData (1) is wrong' );
			counter++;
		}, null, 'Test1'  );

		testObject.on( 'someEvent', function( ev ) {
			assert.areSame( 'Test2', ev.listenerData, 'listenerData (2) is wrong' );
			counter++;
		}, null, 'Test2' );

		testObject.fire( 'someEvent' );

		assert.areSame( 2, counter, 'wrong number of calls' );
	},

	test_data: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		// Counter used just to check that the calls are effectively done.
		var counter = 0;

		testObject.on( 'someEvent', function( ev ) {
			assert.areSame( 'Test data', ev.data, 'data (1) is wrong' );
			counter++;
		} );

		testObject.on( 'someEvent', function( ev ) {
			assert.areSame( 'Test data', ev.data, 'data (2) is wrong' );
			counter++;
		} );

		testObject.fire( 'someEvent', 'Test data' );

		assert.areSame( 2, counter, 'wrong number of calls' );
	},

	test_editor: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		// Counter used just to check that the calls are effectively done.
		var counter = 0;

		var editor = {};

		testObject.on( 'someEvent', function( ev ) {
			assert.areSame( editor, ev.editor, 'editor is wrong' );
			counter++;
		} );

		testObject.fire( 'someEvent', null, editor );

		assert.areSame( 1, counter, 'wrong number of calls' );
	},

	test_stop: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		var counter = 0;

		testObject.on( 'someEvent', function( ev ) {
			ev.stop();
			counter++;
		} );

		testObject.on( 'someEvent', function() {
			counter++;
		} );

		assert.areSame( true, testObject.fire( 'someEvent' ), 'fire must return "false"' );
		assert.areSame( 1, counter, 'number of calls doesn\'t match' );
	},

	test_cancel: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		var counter = 0;

		testObject.on( 'someEvent', function( ev ) {
			ev.cancel();
			counter++;
		} );

		testObject.on( 'someEvent', function() {
			counter++;
		} );

		assert.areSame( false, testObject.fire( 'someEvent' ), 'fire must return "true"' );
		assert.areSame( 1, counter, 'number of calls doesn\'t match' );
	},

	test_dataManipulation: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		var counter = 0;

		testObject.on( 'someEvent', function( ev ) {
			assert.areSame( 'Test1', ev.data );
			ev.data = 'Test2';
			counter++;
		} );

		testObject.on( 'someEvent', function( ev ) {
			assert.areSame( 'Test2', ev.data );
			ev.data = 'Test3';
			counter++;
		} );

		testObject.on( 'someEvent', function( ev ) {
			assert.areSame( 'Test3', ev.data );
			ev.data = 'Test4';
			counter++;
		} );

		assert.areSame( 'Test4', testObject.fire( 'someEvent', 'Test1' ), 'fire must return "Test4"' );
		assert.areSame( 3, counter, 'number of calls doesn\'t match' );
	},

	test_priority: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		var calls = [];

		testObject.on( 'someEvent', function() {
			calls.push( 'e' );
		}, null, null, 11 );

		testObject.on( 'someEvent', function() {
			calls.push( 'c' );
		} );

		testObject.on( 'someEvent', function() {
			calls.push( 'a' );
		}, null, null, 9 );

		testObject.on( 'someEvent', function() {
			calls.push( 'f' );
		}, null, null, 11 );

		testObject.on( 'someEvent', function() {
			calls.push( 'd' );
		} );

		testObject.on( 'someEvent', function() {
			calls.push( 'b' );
		}, null, null, 9 );

		testObject.fire( 'someEvent', 'Test data' );
		assert.areSame( 'a,b,c,d,e,f', calls.toString() );
	},

	test_removeListener: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		var calls = [];

		var listener = function() {
			calls.push( 'a' );
		};

		testObject.on( 'someEvent', listener );

		testObject.on( 'someEvent', function() {
			calls.push( 'b' );
		} );

		testObject.fire( 'someEvent', 'Test data' );
		assert.areSame( 'a,b', calls.toString() );

		testObject.removeListener( 'someEvent', listener );

		calls = [];

		testObject.fire( 'someEvent', 'Test data' );
		assert.areSame( 'b', calls.toString() );
	},

	test_fireOnce: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		var counter = 0;

		testObject.on( 'someEvent', function() {
			counter++;
		} );

		testObject.on( 'someEvent', function() {
			counter++;
		} );

		assert.areSame( true, testObject.fireOnce( 'someEvent' ), 'fireOnce must return "false"' );
		assert.areSame( 2, counter, 'number of calls doesn\'t match' );

		counter = 0;

		assert.areSame( true, testObject.fire( 'someEvent' ), 'fire must return "false"' );
		assert.areSame( 0, counter, 'number of calls doesn\'t match' );
	},

	test_nestedCancel: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		var isCanceledA,
			isCanceledB,
			isCanceledC;

		testObject.on( 'A', function() {
			isCanceledB = testObject.fire( 'B' );
			isCanceledC = testObject.fire( 'C' );
		} );

		testObject.on( 'B', function( ev ) {
			ev.cancel();
		} );

		testObject.on( 'C', function() {
		} );

		isCanceledA = testObject.fire( 'A' );

		assert.areSame( true, isCanceledA, 'event A must not be canceled' );
		assert.areSame( false, isCanceledB, 'event B must be canceled' );
		assert.areSame( true, isCanceledC, 'event C must not be canceled' );
	},

	test_event_removeListener: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		var counter = 0;

		// Add two listeners for the same event "A".

		testObject.on( 'A', function( ev ) {
			counter++;
			ev.removeListener();
		} );

		testObject.on( 'A', function() {
			counter++;
		} );

		// Fire the event twice.
		testObject.fire( 'A' );
		testObject.fire( 'A' );

		assert.areSame( 3, counter );
	},

	test_once: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		var fired = '',
			context1, context2,
			contextPassed = {};

		// Add two listeners for the same event "A".

		testObject.once( 'A', function() {
			context1 = this;
			fired += '1';
		} );

		testObject.once( 'A', function() {
			context2 = this;
			fired += '2';
		}, contextPassed, null, 1 );

		// Fire the event twice.
		testObject.fire( 'A' );
		testObject.fire( 'A' );

		assert.areSame( '21', fired );
		assert.areSame( context1, testObject );
		assert.areSame( context2, contextPassed );
	},

	test_once_2: function() {
		// Create a testObject and implement CKEDITOR.event on it.
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		var fired2 = false;

		// Add two listeners for the same event "A".

		testObject.once( 'A', function() {
			return false; // Cancel event.
		} );

		testObject.once( 'A', function() {
			fired2 = true;
		} );

		testObject.fire( 'A' );

		assert.isFalse( fired2 );
	},

	test_removeAllListeners: function() {
		var testObject = {};
		CKEDITOR.event.implementOn( testObject );

		var evtCouter = 0;

		testObject.on( 'evt', function() {
			evtCouter++;
		} );

		testObject.fire( 'evt' );
		assert.areSame( 1, evtCouter, 'After fist event.' );

		testObject.removeAllListeners();

		testObject.fire( 'evt' );
		assert.areSame( 1, evtCouter, 'After removeAllListeners.' );
	}
} );