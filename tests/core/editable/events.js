/* bender-tags: editor,unit */

'use strict';

function addTests( tcs, creator ) {
	var editor,
		eventsRecorder;

	tcs[ 'test events order on start - ' + creator ] = function() {
		var el = CKEDITOR.document.getById( 'editor_' + creator );

		if ( creator == 'inline' )
			el.setAttribute( 'contenteditable', 'true' );

		editor = CKEDITOR[ creator == 'inline' ? 'inline' : 'replace' ]( el, {
			plugins:
				creator == 'replace' ?	'wysiwygarea,sourcearea' :
				creator == 'divarea' ?	'divarea,sourcearea' :
										'',
			on: {
				instanceReady: function() {
					resume( function() {
						eventsRecorder.assert(
							creator == 'replace' ?	[ 'setData', 'afterSetData', 'contentDom', 'dataReady' ] :
													[ 'setData', 'afterSetData', 'dataReady', 'contentDom' ] );
					} );
				}
			}
		} );
		eventsRecorder = bender.tools.recordEvents( editor,
			[ 'setData', 'afterSetData', 'dataReady', 'contentDom', 'loadSnapshot' ] );

		wait();
	};

	tcs[ 'test events order on loadSnapshot - ' + creator ] = function() {
		eventsRecorder.reset();
		editor.loadSnapshot( 'foo' );
		eventsRecorder.assert( [ 'loadSnapshot', 'dataReady' ] );
	};

	tcs[ 'test events order on setData - ' + creator ] = function() {
		eventsRecorder.reset();
		editor.setData( 'bar', function() {
			resume( function() {
				eventsRecorder.assert(
					creator == 'replace' ?	[ 'setData', 'afterSetData', 'contentDom', 'dataReady' ] :
											[ 'setData', 'afterSetData', 'dataReady' ]
				);
			} );
		} );
		wait();
	};

	tcs[ 'test events order on setMode to source - ' + creator ] = function() {
		if ( creator == 'inline' )
			assert.ignore();

		eventsRecorder.reset();
		editor.setMode( 'source', function() {
			resume( function() {
				eventsRecorder.assert( [ 'dataReady' ] );
			} );
		} );
		wait();
	};

	tcs[ 'test events order on setMode to wysiwyg - ' + creator ] = function() {
		if ( creator == 'inline' )
			assert.ignore();

		eventsRecorder.reset();
		editor.setMode( 'wysiwyg', function() {
			resume( function() {
				eventsRecorder.assert(
					creator == 'replace' ?	[ 'setData', 'afterSetData', 'contentDom', 'dataReady' ] :
											[ 'setData', 'afterSetData', 'dataReady', 'contentDom' ]
				);
			} );
		} );
		wait();
	};

	tcs[ 'test events on editable detach - ' + creator ] = function() {
		var eventFiredTimes = 0;

		editor.on( 'contentDomUnload', function() {
			eventFiredTimes++;
		} );
		editor.editable().detach();

		assert.areSame( 1, eventFiredTimes, 'after calling editable.detach() contentDomUnload should be fired exactly once' );
	};
}

var tcs = {};

addTests( tcs, 'inline' );
addTests( tcs, 'replace' );
addTests( tcs, 'divarea' );

bender.test( tcs );