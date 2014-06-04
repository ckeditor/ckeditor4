/* bender-tags: editor,unit */

CKEDITOR.replaceClass = 'ckeditor';
bender.editor = true;

bender.test(
{

	test_name : function() {
		assert.areSame( 'editor1', CKEDITOR.instances.editor1.name );
	},

	test_element : function() {
		assert.areSame( document.getElementById( 'editor1' ), CKEDITOR.instances.editor1.element.$ );
	},

	'ignore:test_config' : function() {
		// The instance default config must match the CKEDITOR.config.

		var config = CKEDITOR.instances.editor1.config;

		for ( var prop in CKEDITOR.config )
			assert.areSame( CKEDITOR.config[ prop ], config[ prop ], '"' + prop + '" doesn\'t match' );
	},

	'ignore:test_config_inpage' : function() {
		var self = this;

		CKEDITOR.replace( 'editor2',
			{
				// The custom setting to be checked.
				test1 : 'ball',
				baseHref : 'test',

				on :
				{
					instanceReady : function() {
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

	test_config_customConfig : function() {
		var tc = this;
		// Pass in-page settings to the instance.
		CKEDITOR.replace( 'editor3', { customConfig : '%TEST_DIR%_assets/custom_config_1.js', test1 : 'ball', baseHref : 'test',
			on :
			{
				configLoaded : function( event ) {
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
							if ( prop != 'plugins'
									 && prop != 'customConfig' && prop != 'test_custom1' && prop != 'test_custom2' && prop != 'test1' && prop != 'baseHref' )
								assert.areSame( CKEDITOR.config[ prop ], config[ prop ], '"' + prop + '" doesn\'t match' );
						}
					} );
				}
			}
		} );

		this.wait();
	},

	/**
	 * Test editor core data retrieval and manipulation functionality.
	 */
	test_getData : function() {
		var events = [];
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

		var editor =
			new CKEDITOR.editor( {},
			  CKEDITOR.document.getById( 'editor4' ),
			  CKEDITOR.ELEMENT_MODE_REPLACE );

		// Events are fired on setData call.
		var checker = checkEventData();

		var listeners = [];
		var allEvents = [ 'setData', 'afterSetData', 'beforeGetData', 'getData' ];
		for ( var i = 0; i < allEvents.length; i++ )
			listeners.push( editor.on( allEvents[ i ], checker ) );

		// Set/get data internally.
		editor.setData( 'foo', null, true );
		assert.areSame( 'foo', editor.getData( true ), 'setData internally' );

		// No events should be fired.
		arrayAssert.itemsAreEqual( [], events );

		for ( i = 0; i < listeners.length; i++ )
			listeners[ i ].removeListener();

		// Events are fired on setData call.
		editor.on( 'setData', checkEventData( 'foo' ) );
		editor.on( 'afterSetData', checkEventData( 'bar' ) );
		editor.setData( 'foo' );

		arrayAssert.itemsAreEqual( [ 'setData', 'afterSetData' ], events );
		assert.areSame( 'bar', editor.getData(), 'setData listener change data value' );

		events = [];
		// Events are fired on getData call.
		editor.on( 'beforeGetData', checkEventData() );
		editor.on( 'getData', checkEventData( 'bar' ) );
		editor.getData();

		arrayAssert.itemsAreEqual( [ 'beforeGetData', 'getData' ], events );

	},

	updateElement: function( element, mode ) {
		var editor = new CKEDITOR.editor( {}, element, mode );
		editor.setData( 'foo' );

		// Test update element explicit call.
		if ( editor.updateElement() )
			assert.areSame( 'foo', element.is( 'textarea' ) ? element.getValue() : element.getHtml(), 'editor data update to element' );

		// Test update element implicitly on editor destroy.
		editor.setData( 'bar' );
		editor.destroy();

		assert.areSame( 'bar', element.is( 'textarea' ) ? element.getValue() : element.getHtml(), 'editor destroy should trigger data update' );
		element.remove();
	},

	'test blockless editor' : function() {
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

	test_updateElement : function() {
		var body = CKEDITOR.document.getBody();
		this.updateElement( body.append( new CKEDITOR.dom.element( 'textarea' ) ),
								 CKEDITOR.ELEMENT_MODE_REPLACE );
		this.updateElement( body.append( CKEDITOR.dom.element.createFromHtml( '<div contenteditable="true"></div>' ) ),
								 CKEDITOR.ELEMENT_MODE_INLINE );
	},

	'test editor.getResizable' : function() {
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
	}

} );