/* bender-tags: editor,unit */
/* global console */

( function() {
	'use strict';

	var error,
		warn,
		_console,
		consoleEnabled = !!window.console,
		ignore = !consoleEnabled,
		errorPrefix = '[CKEDITOR] ',
		errorCodeLabel = 'Error code: ';

	// Binds function to provided object and wraps it with new function.
	// @param {Function} fn Function to be wrapped.
	// @param {Object}  object Object to bind.
	// @returns {Function}
	function wrap( fn, object ) {
		return function() {
			var args = Array.prototype.slice.call( arguments );
			args.unshift( object );

			// Call function's prototype method 'call' on stored function.
			Function.prototype.call.apply( fn, args );
		};
	}

	bender.test( {

		// Ignore tests when window.console is not enabled.
		// In ie8/ie9 console is available only when development tools are opened.
		_should: {
			ignore: {
				'no log event and output after CKEDITOR.warn() when verbosity = 0': ignore,
				'log event and output from CKEDITOR.warn() when verbosity = VERBOSITY_WARN': ignore,
				'log event and output from CKEDITOR.warn() when verbosity = VERBOSITY_WARN | VERBOSITY_ERROR': ignore,
				'no log event and output after CKEDITOR.error() when verbosity = 0': ignore,
				'log event and output from CKEDITOR.error() when verbosity = VERBOSITY_ERROR': ignore,
				'log event and output from CKEDITOR.error() when verbosity = VERBOSITY_WARN | VERBOSITY_ERROR': ignore,
				'block default log event handler': ignore
			}
		},

		init: function() {
			// Check if console.error is present. Use console.log as fallback.
			if ( consoleEnabled ) {
				error = console.error ? 'error' : 'log';
				warn = console.warn ? 'warn' : 'log';
			}
		},

		setUp: function() {
			// In IE <= 9 console methods log(), warn() and error() are pseudo-functions that do not have
			// call/apply methods. This leads to situation when spy methods cannot work properly.
			// Because of that each function should be wrapped before use.
			// The console object should be also stubbed because newer sinon version cannot work on that object in
			// IE <= 9 (#13917).
			if ( consoleEnabled && CKEDITOR.env.ie && CKEDITOR.env.version <= 9 ) {
				_console = window.console;
				window.console = {
					log: wrap( _console.log, _console ),
					warn: wrap( _console[ warn ], _console ),
					error: wrap( _console[ error ], _console )
				};
			}
		},

		tearDown: function() {
			// Cleaning wrapping made in setUp function for ie <= 9.
			if ( consoleEnabled && CKEDITOR.env.ie && CKEDITOR.env.version <= 9 ) {
				window.console = _console;
			}
		},

		'is defined': function() {
			assert.isFunction( CKEDITOR.error, 'CKEDTIOR.error function should be defined.' );
			assert.isFunction( CKEDITOR.warn, 'CKEDTIOR.warn function should be defined.' );
		},

		'no log event and output after CKEDITOR.warn() when verbosity = 0': function() {
			var warnStub = sinon.stub( console, warn ),
				logEventSpy = sinon.spy();

			CKEDITOR.on( 'log', logEventSpy );
			CKEDITOR.verbosity = 0;
			CKEDITOR.warn( 'warn' );


			// Log event should not be fired.
			assert.isFalse( logEventSpy.called, 'Log event should not be fired.' );

			// Console.error should not be called.
			assert.isFalse( warnStub.called, 'Console.warn function should not be called.' );

			warnStub.restore();
			CKEDITOR.removeListener( 'log', logEventSpy );
		},

		'log event and output from CKEDITOR.warn() when verbosity = VERBOSITY_WARN': function() {
			var warnStub = sinon.stub( console, warn ),
				logEventSpy = sinon.spy(),
				errorCode = 'error-code',
				additionalData = {},
				data;

			CKEDITOR.on( 'log', logEventSpy );
			CKEDITOR.verbosity = CKEDITOR.VERBOSITY_WARN;
			CKEDITOR.warn( errorCode, additionalData );

			// Check if event was fired.
			assert.isTrue( logEventSpy.calledOnce, 'Log event should be fired once.' );
			data = logEventSpy.firstCall.args[ 0 ].data;
			assert.areEqual( 'warn', data.type, 'Event data.type should be equal to "warn".' );
			assert.areEqual( errorCode, data.errorCode, 'Event data.errorCode should match provided errorCode.' );
			assert.areEqual( additionalData, data.additionalData, 'Event data.additionalData should match provided additionalData.' );

			// Console.warn should be called twice:
			// - first to show errorCode and data passed to CKEDITOR.warn function,
			// - second call is to show link to the documentation providing more information about errorCode.
			assert.isTrue( warnStub.calledTwice, 'Console.warn function should be called twice.' );
			assert.isTrue( warnStub.firstCall.calledWith( errorPrefix + errorCodeLabel + errorCode + '.', additionalData ), 'Console.warn should be called with errorCode and additionalData.' );

			warnStub.restore();
			CKEDITOR.removeListener( 'log', logEventSpy );
		},

		'log event and output from CKEDITOR.warn() when verbosity = VERBOSITY_WARN | VERBOSITY_ERROR': function() {
			var warnStub = sinon.stub( console, warn ),
				logEventSpy = sinon.spy(),
				errorCode = 'error-code',
				additionalData = {},
				data;

			CKEDITOR.on( 'log', logEventSpy );
			CKEDITOR.verbosity = CKEDITOR.VERBOSITY_WARN | CKEDITOR.VERBOSITY_ERROR;
			CKEDITOR.warn( errorCode, additionalData );

			// Check if event was fired.
			assert.isTrue( logEventSpy.calledOnce, 'Log event should be fired once.' );
			data = logEventSpy.firstCall.args[ 0 ].data;
			assert.areEqual( 'warn', data.type, 'Event data.type should be equal to "warn".' );
			assert.areEqual( errorCode, data.errorCode, 'Event data.errorCode should match provided errorCode.' );
			assert.areEqual( additionalData, data.additionalData, 'Event data.additionalData should match provided additionalData.' );

			// Console.warn should be called twice:
			// - first to show errorCode and data passed to CKEDITOR.warn function,
			// - second call is to show link to the documentation providing more information about errorCode.
			assert.isTrue( warnStub.calledTwice, 'Console.warn function should be called twice.' );
			assert.isTrue( warnStub.firstCall.calledWith( errorPrefix + errorCodeLabel + errorCode + '.', additionalData ), 'Console.warn should be called with errorCode and additionalData.' );

			warnStub.restore();
			CKEDITOR.removeListener( 'log', logEventSpy );
		},

		'no log event and output after CKEDITOR.error() when verbosity = 0': function() {
			var errorStub = sinon.stub( console, error ),
				logEventSpy = sinon.spy();

			CKEDITOR.on( 'log', logEventSpy );
			CKEDITOR.verbosity = 0;
			CKEDITOR.error( 'error' );

			// Log event should not be fired.
			assert.isFalse( logEventSpy.called, 'Log event should not be fired.' );

			// Console.error should not be called.
			assert.isFalse( errorStub.called, 'Console.error function should not be called.' );

			errorStub.restore();
			CKEDITOR.removeListener( 'log', logEventSpy );

		},

		'log event and output from CKEDITOR.error() when verbosity = VERBOSITY_ERROR': function() {
			var errorStub = sinon.stub( console, error ),
				logEventSpy = sinon.spy(),
				errorCode = 'error-code',
				additionalData = {},
				data;

			CKEDITOR.on( 'log', logEventSpy );
			CKEDITOR.verbosity = CKEDITOR.VERBOSITY_ERROR;
			CKEDITOR.error( errorCode, additionalData );

			// Check if event was fired.
			assert.isTrue( logEventSpy.calledOnce, 'Log event should be fired once.' );
			data = logEventSpy.firstCall.args[ 0 ].data;
			assert.areEqual( 'error', data.type, 'Event data.type should be equal to "error".' );
			assert.areEqual( errorCode, data.errorCode, 'Event data.errorCode should match provided errorCode.' );
			assert.areEqual( additionalData, data.additionalData, 'Event data.additionalData should match provided additionalData.' );

			// Console.error should be called twice:
			// - first to show errorCode and data passed to CKEDITOR.error function,
			// - second call is to show link to the documentation providing more information about errorCode.
			assert.isTrue( errorStub.calledTwice, 'Console.error function should be called twice.' );
			assert.isTrue( errorStub.firstCall.calledWith( errorPrefix + errorCodeLabel + errorCode + '.', additionalData ), 'Console.error should be called with errorCode and additionalData.' );

			errorStub.restore();
			CKEDITOR.removeListener( 'log', logEventSpy );

		},

		'log event and output from CKEDITOR.error() when verbosity = VERBOSITY_WARN | VERBOSITY_ERROR': function() {
			var errorStub = sinon.stub( console, error ),
				logEventSpy = sinon.spy(),
				errorCode = 'error-code',
				additionalData = {},
				data;

			CKEDITOR.on( 'log', logEventSpy );
			CKEDITOR.verbosity = CKEDITOR.VERBOSITY_WARN | CKEDITOR.VERBOSITY_ERROR;
			CKEDITOR.error( errorCode, additionalData );

			// Check if event was fired.
			assert.isTrue( logEventSpy.calledOnce, 'Log event should be fired once.' );
			data = logEventSpy.firstCall.args[ 0 ].data;
			assert.areEqual( 'error', data.type, 'Event data.type should be equal to "error".' );
			assert.areEqual( errorCode, data.errorCode, 'Event data.errorCode should match provided errorCode.' );
			assert.areEqual( additionalData, data.additionalData, 'Event data.additionalData should match provided additionalData.' );

			// Console.error should be called twice:
			// - first to show errorCode and data passed to CKEDITOR.error function,
			// - second call is to show link to the documentation providing more information about errorCode.
			assert.isTrue( errorStub.calledTwice, 'Console.error function should be called twice.' );
			assert.isTrue( errorStub.firstCall.calledWith( errorPrefix + errorCodeLabel + errorCode + '.', additionalData ), 'Console.error should be called with errorCode and additionalData.' );

			errorStub.restore();
			CKEDITOR.removeListener( 'log', logEventSpy );

		},

		'block default log event handler': function() {
			var spy,
				errorStub = sinon.stub( console, error ),
				warnStub = sinon.stub( console, warn ),
				errorCode = [ 'error-1', 'error-2' ],
				additionalData = [ {}, {} ],
				data;

			// Create log event handler that will block default handler's execution.
			spy = sinon.spy( function( evt ) {
				evt.cancel();
			} );
			CKEDITOR.on( 'log', spy );

			CKEDITOR.verbosity = CKEDITOR.VERBOSITY_WARN | CKEDITOR.VERBOSITY_ERROR;
			CKEDITOR.error( errorCode[ 0 ], additionalData[ 0 ] );
			CKEDITOR.warn( errorCode[ 1 ], additionalData[ 1 ] );

			assert.isFalse( errorStub.called, 'Console.error should not be called when default "log" event handler is blocked.' );
			assert.isFalse( warnStub.called, 'Console.warn should not be called when default "log" event handler is blocked.' );

			assert.isTrue( spy.calledTwice, 'Event handler should be called twice.' );

			data = spy.firstCall.args[ 0 ].data;
			assert.areEqual( 'error', data.type, 'Event data.type should be equal to "error".' );
			assert.areEqual( errorCode[ 0 ], data.errorCode, 'Event data.errorCode should match provided errorCode.' );
			assert.areEqual( additionalData[ 0 ], data.additionalData, 'Event data.additionalData should match provided additionalData.' );

			data = spy.secondCall.args[ 0 ].data;
			assert.areEqual( 'warn', data.type, 'Event data.type should be equal to "warn".' );
			assert.areEqual( errorCode[ 1 ], data.errorCode, 'Event data.errorCode should match provided errorCode.' );
			assert.areEqual( additionalData[ 1 ], data.additionalData, 'Event data.additionalData should match provided additionalData.' );

			errorStub.restore();
			warnStub.restore();
			CKEDITOR.removeListener( 'log', spy );
		}
	} );
} )();
