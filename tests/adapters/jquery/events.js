/* bender-tags: editor,jquery */
/* bender-ckeditor-adapters: jquery */
/* bender-ckeditor-plugins: wysiwygarea */
/* global $ */

'use strict';

var FOO = '<p>foo</p>';
var BAR = '<p>bar</p>';

bender.test( {
	'async:init': function() {
		var tc = this;
		this.editor = $( '#editor' ).ckeditor( function() {
			tc.callback();
		} );
		this.tearDownListeners = [];
	},

	'tearDown': function() {
		var listener;

		while ( ( listener = this.tearDownListeners.pop() ) )
			this.editor.unbind( listener[ 0 ], listener[ 1 ] );
	},

	'test event instanceReady': function() {
		$( '#instanceReadyEditor' ).ckeditor().on( 'instanceReady.ckeditor', function( event, editor ) {
			resume( function() {
				assert.areSame( 'instanceReady', event.type, 'Event type should be \'instanceReady\'.' );
				assert.areSame( 'ckeditor', event.namespace, 'Event namespace should be \'ckeditor\'.' );
				assert.areSame( CKEDITOR.instances.instanceReadyEditor.name, editor.name, 'Given editor should match.' );
			} );
		} );

		wait();
	},

	'test event instanceReady of the editor being created': function() {
		var callCount = 0;

		// Create an editor. It's just initializing...
		$( '#beingCreated' ).ckeditor();

		// ...then try to create it again. This callback must wait
		// for the editor to initialize. It's postponed.
		$( '#beingCreated' ).ckeditor( function() {
			callCount++;

			// See whether this callback won't be executed again, when
			// we'll initialize editor on the same element 2nd time.
			this.destroy();

			$( '#beingCreated' ).ckeditor( function() {
				resume( function() {
					assert.areSame( 1, callCount, 'InstanceReady callback for the editor being created cannot be called more than once.' );
				} );
			} );
		} );

		wait();
	},

	'test event getData': function() {
		var oldData,
			type,
			namespace,
			editorName;

		$( '#editor' ).val( FOO ).done( function() {
			resume( function() {
				assert.areSame( BAR, bender.tools.compatHtml( $( '#editor' ).val() ), 'Data should be modified.' );
				assert.areSame( FOO, bender.tools.compatHtml( oldData ), 'Event was carrying data' );
				assert.areSame( 'getData', type, 'Event\'s type' );
				assert.areSame( 'ckeditor', namespace, 'Event\'s namespace' );
				assert.areSame( 'editor', editorName, 'Event was fired on correct editor' );
			} );
		} );

		this.editor.on( 'getData.ckeditor', onGetData );
		this.tearDownListeners.push( [ 'getData.ckeditor', onGetData ] );

		wait();

		function onGetData( event, editor, data ) {
			oldData = data.dataValue;
			type = event.type;
			namespace = event.namespace;
			editorName = editor.name;

			data.dataValue = BAR;
		}
	},

	'test event setData': function() {
		var oldData,
			type,
			namespace,
			editorName;

		this.editor.on( 'setData.ckeditor', onSetData );
		this.tearDownListeners.push( [ 'setData.ckeditor', onSetData ] );

		$( '#editor' ).val( FOO ).done( function() {
			resume( function() {
				assert.areSame( BAR, bender.tools.compatHtml( $( '#editor' ).val() ), 'Data should be modified.' );
				assert.areSame( FOO, bender.tools.compatHtml( oldData ), 'Event was carrying data' );
				assert.areSame( 'setData', type, 'Event\'s type' );
				assert.areSame( 'ckeditor', namespace, 'Event\'s namespace' );
				assert.areSame( 'editor', editorName, 'Event was fired on correct editor' );
			} );
		} );

		wait();

		function onSetData( event, editor, data ) {
			oldData = data.dataValue;
			type = event.type;
			namespace = event.namespace;
			editorName = editor.name;

			data.dataValue = BAR;
		}
	},

	'test event dataReady': function() {
		this.editor.on( 'dataReady.ckeditor', onDataReady );
		this.tearDownListeners.push( [ 'setData.ckeditor', onDataReady ] );

		$( '#editor' ).val( FOO );
		wait();

		function onDataReady( event, editor ) {
			resume( function() {
				assert.areSame( 'dataReady', event.type, 'Event\'s type' );
				assert.areSame( 'ckeditor', event.namespace, 'Event\'s namespace' );
				assert.areSame( 'editor', editor.name, 'Event was fired on correct editor' );
			} );
		}
	},

	'test event destroy': function() {
		var instantiatedEditor;

		$( '#destroyEditor' ).ckeditor( function() {
			instantiatedEditor = CKEDITOR.instances.destroyEditor.name;
			this.destroy();
		} );

		$( '#destroyEditor' ).ckeditor().on( 'destroy.ckeditor', function( event ) {
			resume( function() {
				assert.areSame( 'destroyEditor', instantiatedEditor, 'Given editor should match.' );
				assert.areSame( 'destroy', event.type, 'Event type should be \'destroy\'.' );
				assert.areSame( 'ckeditor', event.namespace, 'Event namespace should be \'ckeditor\'.' );
			} );
		} );

		wait();
	}
} );
