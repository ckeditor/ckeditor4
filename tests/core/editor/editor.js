/* bender-tags: editor */

CKEDITOR.replaceClass = 'ckeditor';
bender.editor = true;

bender.test( {
	tearDown: function() {
		if ( typeof window.alert.restore === 'function' ) {
			window.alert.restore();
		}
	},

	test_name: function() {
		assert.areSame( 'editor1', CKEDITOR.instances.editor1.name );
	},

	test_element: function() {
		assert.areSame( document.getElementById( 'editor1' ), CKEDITOR.instances.editor1.element.$ );
	},

	'ignore:test_config': function() {
		// The instance default config must match the CKEDITOR.config.

		var config = CKEDITOR.instances.editor1.config;

		for ( var prop in CKEDITOR.config )
			assert.areSame( CKEDITOR.config[ prop ], config[ prop ], '"' + prop + '" doesn\'t match' );
	},

	'ignore:test_config_inpage': function() {
		var self = this;

		CKEDITOR.replace( 'editor2', {
			// The custom setting to be checked.
			test1: 'ball',
			baseHref: 'test',

			on: {
				instanceReady: function() {
					self.resume( function() {
						var config = CKEDITOR.instances.editor2.config;

						assert.areSame( 'ball', config.test1, '"test1" doesn\'t match' );
						assert.areSame( 'test', config.baseHref, '"baseHref" doesn\'t match' );

						// All other settings must match CKEDITOR.config.
						for ( var prop in CKEDITOR.config ) {
							if ( prop != 'test1' && prop != 'baseHref' )
								assert.areSame( CKEDITOR.config[ prop ], config[ prop ], '"' + prop + '" doesn\'t match' );
						}
					} );
				}
			}
		} );

		this.wait();
	},

	test_config_customConfig: function() {
		var tc = this;
		// Pass in-page settings to the instance.
		CKEDITOR.replace( 'editor3', {
			customConfig: '%TEST_DIR%_assets/custom_config_1.js',
			test1: 'ball',
			baseHref: 'test',
			on: {
				configLoaded: function( event ) {
					tc.resume( function() {
						var config = event.editor.config;

						assert.areSame( 'Ok', config.test_custom1, '"test_custom1" doesn\'t match' );
						assert.areSame( 'Ok', config.test_custom2, '"test_custom1" doesn\'t match' );
						assert.areSame( 'ball', config.test1, '"test1" doesn\'t match' );
						assert.areSame( 'test', config.baseHref, '"baseHref" doesn\'t match' );

						// All other settings must match CKEDITOR.config.
						for ( var prop in CKEDITOR.config ) {
							if ( !Object.hasOwnProperty( CKEDITOR.config, prop ) )
								continue;

							// Creators might add required plugin to core.
							if ( prop != 'plugins' && prop != 'customConfig' && prop != 'test_custom1' &&
								prop != 'test_custom2' && prop != 'test1' && prop != 'baseHref' ) {
								assert.areSame( CKEDITOR.config[ prop ], config[ prop ], '"' + prop + '" doesn\'t match' );
							}
						}
					} );
				}
			}
		} );

		this.wait();
	},

	'test getData/setData() - events and arguments': function() {
		var events = [],
			editor = new CKEDITOR.editor( {}, CKEDITOR.document.getById( 'editor4' ), CKEDITOR.ELEMENT_MODE_REPLACE );

		function checkEventData( value ) {
			return function( evt  ) {
				events.push( evt.name );
				// Check data value.
				if ( value )
					assert.areSame( value, evt.data.dataValue, 'check data on event: ' + evt.name );
				// Alter the data value.
				if ( evt.name == 'setData' )
					evt.data.dataValue = 'bar';
			};
		}

		// This function allows to call either older API or new object based setData().
		// It takes setData() params in new format (as editor#setData()).
		function callSetData( data, params, legacyInterface ) {
			if ( legacyInterface )
				editor.setData( data, params.callback, params.internal );
			else
				editor.setData( data, params );
		}

		var listeners = [],
			allEvents = [ 'setData', 'afterSetData', 'beforeGetData', 'getData', 'saveSnapshot' ],
			listener = checkEventData();

		for ( var i = 0; i < allEvents.length; i++ )
			listeners.push( editor.on( allEvents[ i ], listener ) );

		for ( i = 0; i <= 1; i++ ) {
			var useOldAPI = Boolean( i ),
				// Helper var with human-readable info what interface version is called.
				interfaceName = useOldAPI ? 'old API params inline' : 'new API params as object';

			events = [];

			// Test setData/getData internal.
			callSetData( 'foo', { internal: true }, useOldAPI );
			assert.areSame( 'foo', editor.getData( true ), 'setData internally - ' + interfaceName );
			// No events should be fired.
			assert.areSame( '', events.join( ',' ), 'Events fired - ' + interfaceName );

			events = [];
			// Test non-internal setData() - snapshot is expected.
			callSetData( 'foo', {}, useOldAPI );

			assert.areSame( 'saveSnapshot,setData,afterSetData', events.join( ',' ),
				'Invalid events for setData() - ' + interfaceName );

			// Test non-internal getData().
			events = [];

			assert.areSame( 'bar', editor.getData(), 'setData listener change data value - ' + interfaceName );
			assert.areSame( 'beforeGetData,getData', events.join( ',' ) );
		}

		// New API provides params.noSnapshot, which should prevent saveSnapshot event.
		events = [];
		callSetData( 'foo', { noSnapshot: true } );

		assert.areSame( 'setData,afterSetData', events.join( ',' ), 'Invalid events with params.noSnapshot = true' );
	},

	'test setData() callback - new API': function() {
		var callbackCalledTimes = 0,
			callback = function() {
				callbackCalledTimes += 1;
			},
			listener;

		listener = this.editor.on( 'dataReady', function() {
			listener.removeListener();

			resume( function() {
				assert.areEqual( 1, callbackCalledTimes, 'callback called once' );
			} );
		} );

		this.editor.setData( '<p>setData</p>', { callback: callback } );
		wait();
	},

	'test setData() callback - old API': function() {
		var callbackCalledTimes = 0,
			callback = function() {
				callbackCalledTimes += 1;
			},
			listener;

		listener = this.editor.on( 'dataReady', function() {
			listener.removeListener();

			resume( function() {
				assert.areEqual( 1, callbackCalledTimes, 'callback called once' );
			} );
		} );

		this.editor.setData( '<p>setData</p>', callback );
		wait();
	},

	'test blockless editor': function() {
		var tc = this;
		var el = CKEDITOR.dom.element.createFromHtml( '<h1>heading</h1>' );
		CKEDITOR.document.getBody().append( el );

		var editor = new CKEDITOR.editor( {}, el, CKEDITOR.ELEMENT_MODE_INLINE );
		editor.on( 'loaded', function( evt ) {
			tc.resume( function() {
				evt.removeListener();
				assert.isTrue( editor.blockless );
			} );
		} );
		this.wait();
	},

	assertUpdatingElement: function( bot ) {
		var editor = bot.editor,
			element = editor.element;

		bot.setData( '<p>foo</p>', function() {
			// Test update element explicit call.
			if ( editor.updateElement() )
				assert.areSame( '<p>foo</p>', getHtml( element ),
					'editor data update to element' );

			// Test update element implicitly on editor destroy.
			bot.setData( '<p>bar</p>', function() {
				editor.destroy();

				assert.areSame( '<p>bar</p>', getHtml( element ),
					'editor destroy should trigger data update' );
			} );
		} );

		function getHtml( element ) {
			return element.is( 'textarea' ) ? element.getValue() : bender.tools.compatHtml( element.getHtml() );
		}
	},

	'test updating element - mode replace': function() {
		var body = CKEDITOR.document.getBody(),
			element = body.append( new CKEDITOR.dom.element( 'textarea' ) );

		element.setAttribute( 'id', 'test_updateelement_replace' );

		bender.editorBot.create( {
			name: 'test_updateelement_replace'
		}, this.assertUpdatingElement );
	},

	'test updating element - mode inline': function() {
		var body = CKEDITOR.document.getBody(),
			element = body.append( new CKEDITOR.dom.element( 'div' ) );

		element.setAttributes( {
			id: 'test_updateelement_inline',
			contenteditable: 'true'
		} );

		bender.editorBot.create( {
			name: 'test_updateelement_inline',
			creator: 'inline'
		}, this.assertUpdatingElement );
	},

	'test editor.getResizable': function() {
		var editor = CKEDITOR.instances.editor1,
			resizeable = editor.getResizable(),
			innerResizeable = editor.getResizable( true );

		assert.isTrue( editor.container.equals( resizeable ) );
		assert.isTrue( editor.ui.space( 'contents' ).equals( innerResizeable ) );
	},

	'test editor.activeEnterMode': function() {
		var editor = this.editor,
			activeEnterModeChanged = 0;

		assert.areSame( CKEDITOR.ENTER_P, editor.activeEnterMode, 'initial activeEnterMode' );
		assert.areSame( CKEDITOR.ENTER_BR, editor.activeShiftEnterMode, 'initial activeShiftEnterMode' );

		editor.on( 'activeEnterModeChange', function() {
			activeEnterModeChanged += 1;
		} );


		editor.setActiveEnterMode( CKEDITOR.ENTER_BR );

		assert.areSame( CKEDITOR.ENTER_BR, editor.activeEnterMode, '1st activeEnterMode' );
		assert.areSame( CKEDITOR.ENTER_BR, editor.activeShiftEnterMode, '1st activeShiftEnterMode' );
		assert.areSame( 1, activeEnterModeChanged, 'activeEnterModeChange was fired once' );


		editor.setActiveEnterMode( CKEDITOR.ENTER_DIV, CKEDITOR.ENTER_P );

		assert.areSame( CKEDITOR.ENTER_DIV, editor.activeEnterMode, '2nd activeEnterMode' );
		assert.areSame( CKEDITOR.ENTER_P, editor.activeShiftEnterMode, '2nd activeShiftEnterMode' );
		assert.areSame( 2, activeEnterModeChanged, 'activeEnterModeChange was fired once' );


		editor.setActiveEnterMode( CKEDITOR.ENTER_DIV, CKEDITOR.ENTER_P );

		assert.areSame( CKEDITOR.ENTER_DIV, editor.activeEnterMode, '2nd activeEnterMode - no change' );
		assert.areSame( CKEDITOR.ENTER_P, editor.activeShiftEnterMode, '2nd activeShiftEnterMode - no change' );
		assert.areSame( 2, activeEnterModeChanged, 'activeEnterModeChange was not fired' );


		editor.setActiveEnterMode( null, CKEDITOR.ENTER_DIV );

		assert.areSame( CKEDITOR.ENTER_P, editor.activeEnterMode, '3rd activeEnterMode - reseted' );
		assert.areSame( CKEDITOR.ENTER_DIV, editor.activeShiftEnterMode, '3rd activeShiftEnterMode' );
		assert.areSame( 3, activeEnterModeChanged, 'activeEnterModeChange was fired once' );


		editor.setActiveEnterMode( null, null );

		assert.areSame( CKEDITOR.ENTER_P, editor.activeEnterMode, '4th activeEnterMode' );
		assert.areSame( CKEDITOR.ENTER_BR, editor.activeShiftEnterMode, '4th activeShiftEnterMode' );
		assert.areSame( 4, activeEnterModeChanged, 'activeEnterModeChange was fired once' );
	},

	'test blockless editor always works in BR mode': function() {
		bender.editorBot.create( {
			name: 'test_blockless_enter',
			creator: 'inline',
			config: {
				enterMode: CKEDITOR.ENTER_DIV,
				shiftEnterMode: CKEDITOR.ENTER_P
			}
		}, function( bot ) {
			var editor = bot.editor;

			assert.isTrue( editor.blockless, 'it is a blockless editor' );
			assert.areSame( CKEDITOR.ENTER_BR, editor.activeEnterMode, 'initial activeEnterMode' );
			assert.areSame( CKEDITOR.ENTER_BR, editor.activeShiftEnterMode, 'initial activeShiftEnterMode' );

			editor.setActiveEnterMode( CKEDITOR.ENTER_P, CKEDITOR.ENTER_DIV );
			assert.areSame( CKEDITOR.ENTER_BR, editor.activeEnterMode, '1st activeEnterMode' );
			assert.areSame( CKEDITOR.ENTER_BR, editor.activeShiftEnterMode, '1st activeShiftEnterMode' );

			editor.setActiveEnterMode( null, null );
			assert.areSame( CKEDITOR.ENTER_BR, editor.activeEnterMode, '2nd activeEnterMode' );
			assert.areSame( CKEDITOR.ENTER_BR, editor.activeShiftEnterMode, '2nd activeShiftEnterMode' );
		} );
	},

	'test showNotification': function() {
		bender.editorBot.create( {
			name: 'no_notification',
			creator: 'inline',
			config: {
				plugins: 'wysiwygarea'
			}
		}, function( bot ) {
			var editor = bot.editor,
				alert = sinon.stub( window, 'alert' );

			editor.showNotification( 'foo' );

			assert.areSame( 1, alert.callCount );
			assert.isTrue( alert.calledWith( 'foo' ) );
		} );
	},

	'test insertHtml': function() {
		var editor = this.editor,
			insertHtml = sinon.stub( editor.editable(), 'insertHtml' ),
			insertHtmlEventListener = sinon.spy(),
			range = sinon.spy();

		editor.on( 'insertHtml', insertHtmlEventListener );

		editor.insertHtml( 'foo', 'html', range );

		assert.areSame( 'foo', insertHtmlEventListener.firstCall.args[ 0 ].data.dataValue, 'event dataValue' );
		assert.areSame( 'html', insertHtmlEventListener.firstCall.args[ 0 ].data.mode, 'event mode' );
		assert.areSame( range, insertHtmlEventListener.firstCall.args[ 0 ].data.range, 'event range' );

		assert.areSame( 'foo', insertHtml.firstCall.args[ 0 ], 'insertHtml dataValue' );
		assert.areSame( 'html', insertHtml.firstCall.args[ 1 ], 'insertHtml mode' );
		assert.areSame( range, insertHtml.firstCall.args[ 2 ], 'insertHtml range' );
	},

	'test isDestroyed method should return proper value': function() {
		bender.editorBot.create( {
			name: 'test_isdestroyed'
		}, function( bot ) {
			var editor = bot.editor;

			assert.isFalse( editor.isDestroyed() );

			editor.destroy();

			assert.isTrue( editor.isDestroyed() );
		} );
	}
} );
