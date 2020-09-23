/* bender-tags: editor */

( function() {
	'use strict';

	var documentRemoveListenerSpy,
		windowRemoveListenerSpy;

	// Since bender.tests are usually run after ready events ('DOMContentLoaded', 'load', 'onload', 'onreadystatechange')
	// happens, attach spies as soon as possible.
	if ( document.addEventListener ) {
		documentRemoveListenerSpy = sinon.spy( document, 'removeEventListener' );
		windowRemoveListenerSpy = sinon.spy( window, 'removeEventListener' );
	} else if ( document.attachEvent ) {
		documentRemoveListenerSpy = sinon.spy( document, 'detachEvent' );
		windowRemoveListenerSpy = sinon.spy( window, 'detachEvent' );
	}

	// Make sure tests are run after 'load' event so listeners had time to be detached.
	window.addEventListener( 'load', function() {

		setTimeout( function() {

			bender.test( {
				init: function() {
					// Restore spied methods since we don't need spies anymore here.
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
