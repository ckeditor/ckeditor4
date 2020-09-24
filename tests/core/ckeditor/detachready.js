/* bender-tags: editor */

( function() {
	'use strict';

	// Ignore tests on IE8 since sinon can't spy window/documents method there
	// throwing an error (https://github.com/sinonjs/sinon/issues/186). Also ignoring takes
	// place on the very beginning to simplify further code (due to addEventListener vs attachEvent in IE8, etc).
	if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
		bender.ignore();
		return;
	}

	// Since "bender.test" is usually run after ready events ('DOMContentLoaded', 'load')
	// happen, we need to attach spies as soon as possible.
	var documentRemoveListenerSpy = sinon.spy( document, 'removeEventListener' ),
	windowRemoveListenerSpy = sinon.spy( window, 'removeEventListener' );

	// Make sure tests are run after 'load' event so listeners had time to be detached by "onReady()" function.
	window.addEventListener( 'load', function() {

		setTimeout( function() {

			bender.test( {
				init: function() {
					// Restore spied methods since we don't need spying here anymore.
					documentRemoveListenerSpy.restore();
					windowRemoveListenerSpy.restore();
				},

				'document DOMContentLoaded listener should be removed after document ready': function() {
					var removeListenerCalls = findOnReadyListener( documentRemoveListenerSpy.getCalls(), 'DOMContentLoaded' );

					assert.areSame( 1, removeListenerCalls.length, 'document DOMContentLoaded removeEventListener should be called exactly once' );
				},

				'window load listener should be removed after document ready': function() {
					var removeListenerCalls = findOnReadyListener( windowRemoveListenerSpy.getCalls(), 'load' );

					assert.areSame( 1, removeListenerCalls.length, 'window load removeEventListener should be called exactly once' );
				}
			} );

		}, 25 );
	} );

	function findOnReadyListener( fnCalls, eventName ) {
		return CKEDITOR.tools.array.filter( fnCalls, function( fnCall ) {
			var event = fnCall.args[ 0 ],
				functionBody = fnCall.args[ 1 ];

			return event === eventName && functionBody.toString().indexOf( 'removeEventListener' ) !== -1;
		} );
	}
} )();
