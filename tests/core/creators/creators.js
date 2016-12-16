/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea */

'use strict';

bender.test( {
	// Check modes switching support. (themedui creator only)
	checkEditorModes: function( editor, callback ) {
		assert.isFunction( editor.setMode );
		assert.isFunction( editor.addMode );

		// Check mode provider.
		editor.addMode( 'foo', function( callback ) {
			callback();
		} );

		// Check mode event fired.
		editor.on( 'mode', function( evt ) {
			evt.removeListener();
			assert.areSame( editor.mode, 'foo' );
		} );

		// Check mode switch succeed.
		editor.setMode( 'foo', function() {
			resume( function() {
				assert.areSame( editor.mode, 'foo' );
				callback();
			} );
		} );

		wait();
	},

	/**
	 * Check events fired on editor instance.
	 * @param editor
	 * @param events Expected editor events in firing order.
	 */
	checkEditorEvents: function( editor, events ) {
		var firedEvents = [];

		function eventChecker( evt ) {
			firedEvents.push( evt.name );
		}

		for ( var i = 0, evt, length = events.length; evt = events[ i ], i < length; i++ )
			editor.on( evt, eventChecker, null, null, -1 );

		return function() {
			arrayAssert.itemsAreEqual( events, firedEvents, 'events sequence doesn\'t match' );
		};
	},

	// Check theme related functionality. (themedui creator only)
	checkEditorTheme: function( editor ) {
		// Check API availability.
		assert.isFunction( editor.addMode );
		assert.isFunction( editor.setMode );
		assert.isFunction( editor.resize );
		assert.isFunction( editor.getResizable );

		assert.areSame( 'foo', editor.name, 'editor.name' );
		assert.areSame( CKEDITOR.config.startupMode, editor.mode, 'editor.mode should matches startup mode config.' );
		assert.areSame( CKEDITOR.instances.foo, editor, 'instance reference is globally available.' );
		assert.areSame( CKEDITOR.document.getById( 'foo' ).$, editor.element.$, 'editor.element' );
		assert.areSame( CKEDITOR.document.getById( 'foo' ).$, editor.element.$, 'editor.element' );
	},

	// Check theme related functionality. (themedui creator only)
	checkEditorUi: function( editor ) {
		// Check no "div" used inside of the main ui.
		if ( CKEDITOR.env.ie ) {
			var divs = editor.container.getElementsByTag( 'div' );
			assert.areSame( 0, divs.count() );
		}
	},

	// Check various editor mandatory fields that are filled by all creators. (all creators)
	checkEditorProperties: function( editor ) {
		assert.areSame( CKEDITOR.config.startupMode, editor.mode, 'editor.mode should matches startup mode config.' );
		assert.areSame( CKEDITOR.instances[ editor.name ], editor, 'instance reference is globally available.' );
		if ( editor.elementMode != CKEDITOR.ELEMENT_MODE_NONE )
			assert.isNotNull( editor.element, 'editor.element' );
		if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE || editor.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE )
			assert.areSame( CKEDITOR.document.getById( editor.name ), editor.element, 'editor.name matches id of editor.element.' );
	},

	checkEditorStatuses: function( editor ) {
		var statuses = [];

		statuses.push( editor.status );

		editor.on( 'loaded', function() {
			statuses.push( editor.status );
		}, null, null, 0 ); // Check with the highest priority.
		editor.on( 'instanceReady', function() {
			statuses.push( editor.status );
		}, null, null, 0 );
		editor.on( 'destroy', function() {
			statuses.push( editor.status );
		}, null, null, 0 );

		return function() {
			arrayAssert.itemsAreEqual( [ 'unloaded', 'loaded', 'ready', 'destroyed' ], statuses, 'Statuses values doesn\'t match' );
		};
	},

	'test APIs availability': function() {
		// check creation APIs.
		assert.isFunction( CKEDITOR.replace );
		assert.isFunction( CKEDITOR.appendTo );
		assert.isFunction( CKEDITOR.inline );

		assert.isFunction( CKEDITOR.replaceAll );
		assert.isFunction( CKEDITOR.inlineAll );

		// check creation modes enumerations.
		assert.areSame( CKEDITOR.ELEMENT_MODE_NONE, 0 );
		assert.areSame( CKEDITOR.ELEMENT_MODE_REPLACE, 1 );
		assert.areSame( CKEDITOR.ELEMENT_MODE_APPENDTO, 2 );
		assert.areSame( CKEDITOR.ELEMENT_MODE_INLINE, 3 );
	},

	'test creator replace': function() {
		var tc = this,
			target = CKEDITOR.document.getBody().append(
				CKEDITOR.dom.element.createFromHtml( '<textarea id="foo">&lt;p&gt;foo&lt;/p&gt;</textarea>' ) );

		var editor = CKEDITOR.replace( 'foo', {
			on: {
				instanceReady: function( evt ) {
					resume( function() {
						var editor = evt.editor;
						assert.areSame( 'foo', editor.name, 'editor.name' );
						assert.areSame( CKEDITOR.ELEMENT_MODE_REPLACE, editor.elementMode, 'editor.elementMode' );
						assert.areSame( editor.element.getNext().$, editor.container.$, 'editor.container should be the adjacent element of editor.element' );
						assert.isFalse( editor.element.isVisible(), 'editor.element should be hidden from view.' );
						checkEvents();
						tc.checkEditorProperties( editor );
						tc.checkEditorTheme( editor );
						tc.checkEditorModes( editor, function() {
							tc.checkEditorUi( editor );

							editor.destroy();
							checkStatuses();

							target.remove(); // Clean up before next test.
						} );

						assert.isFalse( true, 'This should not be executed.' );
						// DO NOT place more tests here - checkEditorModes is asynchronous. Use its callback.
					} );
				}
			}
		} );

		assert.areSame( '<p>foo</p>', editor.getData(), 'editor initial data doesn\'t match' );

		var checkEvents = this.checkEditorEvents( editor, [ 'configLoaded', 'langLoaded', 'pluginsLoaded', 'loaded', 'stylesSet', 'uiReady', 'setData', 'contentDom', 'mode', 'instanceReady' ] ),
			checkStatuses = this.checkEditorStatuses( editor );

		wait();
	},

	'test creator appendTo': function() {
		var tc = this,
			container = CKEDITOR.dom.element.createFromHtml( '<div id="foo"></div>' );

		CKEDITOR.document.getBody().append( container );

		var editor = CKEDITOR.appendTo( 'foo', {
			on: {
				instanceReady: function() {
					resume( function() {
						assert.areSame( 'editor1', editor.name, 'editor.name' );
						checkEvents();
						tc.checkEditorProperties( editor );
						tc.checkEditorUi( editor );
						assert.areSame( CKEDITOR.ELEMENT_MODE_APPENDTO, editor.elementMode, 'editor.elementMode' );
						assert.areSame( container.getLast(), editor.container, 'editor.container should be the last child element of editor.element' );

						editor.destroy();
						checkStatuses();
						assert.isNull( container.getFirst() );

						container.remove();
					} );
				}
			}
		} );

		var checkEvents = this.checkEditorEvents( editor, [ 'configLoaded', 'langLoaded', 'pluginsLoaded', 'loaded', 'stylesSet', 'uiReady', 'setData', 'contentDom', 'mode', 'instanceReady' ] ),
			checkStatuses = this.checkEditorStatuses( editor );

		wait();
	},

	'test creator inline': function() {
		var tc = this,
			target = CKEDITOR.document.getBody().append(
				CKEDITOR.dom.element.createFromHtml( '<div id="foo" contenteditable="true"><p>foo</p></div>' ) );

		var editor = CKEDITOR.inline( target.$, {
			on: {
				instanceReady: function() {
					resume( function() {
						assert.areSame( 'foo', editor.name, 'editor.name' );
						tc.checkEditorProperties( editor );
						assert.areSame( CKEDITOR.ELEMENT_MODE_INLINE, editor.elementMode, 'editor.elementMode' );
						assert.areSame( editor.editable().$, editor.element.$, 'editor.editable should be the same with editor.element' );
						checkEvents( editor );

						editor.destroy();
						checkStatuses();

						target.remove();
					} );
				}
			}
		} );

		assert.areSame( '<p>foo</p>', bender.tools.compatHtml( editor.getData() ), 'editor initial data doesn\'t match' );

		var checkEvents = this.checkEditorEvents( editor, [ 'configLoaded', 'langLoaded', 'pluginsLoaded', 'loaded', 'stylesSet', 'uiReady', 'setData', 'contentDom', 'mode', 'instanceReady' ] ),
			checkStatuses = this.checkEditorStatuses( editor );

		wait();
	},

	'test creator inline-textarea': function() {
		var tc = this,
			target = CKEDITOR.document.getBody().append(
				CKEDITOR.dom.element.createFromHtml( '<textarea id="foo">&lt;p&gt;foo&lt;/p&gt;</textarea>' ) );

		var editor = CKEDITOR.inline( target.$, {
			on: {
				instanceReady: function() {
					resume( function() {
						assert.areSame( 'foo', editor.name, 'editor.name' );
						tc.checkEditorProperties( editor );
						assert.areSame( CKEDITOR.ELEMENT_MODE_INLINE, editor.elementMode, 'editor.elementMode' );
						assert.areSame( editor.element.getNext().$, editor.container.$, 'editor.container should be the adjacent element of editor.element' );
						checkEvents( editor );

						editor.destroy();
						checkStatuses();

						target.remove();
					} );
				}
			}
		} );

		assert.areSame( '<p>foo</p>', bender.tools.compatHtml( editor.getData() ), 'editor initial data doesn\'t match' );

		var checkEvents = this.checkEditorEvents( editor, [ 'configLoaded', 'langLoaded', 'pluginsLoaded', 'loaded', 'stylesSet', 'uiReady', 'setData', 'contentDom', 'mode', 'instanceReady' ] ),
			checkStatuses = this.checkEditorStatuses( editor );

		wait();
	}

} );