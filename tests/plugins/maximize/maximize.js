/* bender-tags: editor */
/* bender-ckeditor-plugins: maximize,sourcearea */

bender.editor = true;

bender.test( {
	setUp: function() {
		// Maximize plugin is disabled on iOS (https://dev.ckeditor.com/ticket/8307).
		if ( CKEDITOR.env.iOS ) {
			assert.ignore();
		}
	},

	tearDown: function() {
		var editors = CKEDITOR.tools.object.values( CKEDITOR.instances );

		CKEDITOR.tools.array.forEach( editors, function( editor ) {
			if ( editor.getCommand( 'maximize' ).state === CKEDITOR.TRISTATE_ON ) {
				editor.execCommand( 'maximize' );
			}
		} );
	},

	// https://dev.ckeditor.com/ticket/4355
	'test command exec not require editor focus': function() {
		if ( this.editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
			assert.ignore();

		var bot = this.editorBot, editor = this.editor;

		var focused = false;
		editor.on( 'focus', function() {
			focused = true;
		} );

		// Maximize command will take some time.
		bot.execCommand( 'maximize' );
		wait(
			function() {
				bot.execCommand( 'maximize' );
				assert.isFalse( focused );
			}, 0
		);
	},

	'test maximize in source mode': function() {
		if ( this.editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
			assert.ignore();

		var bot = this.editorBot;
		// Switch to source mode.
		this.editor.setMode( 'source', function() {
			// Maximize command will take some time.
			bot.execCommand( 'maximize' );
			setTimeout( function() {
				resume( function() {
					bot.execCommand( 'maximize' );

					assert.isTrue( true );
				} );
			}, 0 );
		} );

		wait();
	},

	'test maximize fire resize event with proper properties': function() {
		bender.editorBot.create( {
			name: 'editor_resize_event',
			config: {
				// Set the empty toolbar, so bazillions of buttons in the build mode will not
				// break this test (the height comparison).
				toolbar: [ [ 'Bold' ] ]
			}
		},
		function( bot ) {
			var editor = bot.editor,
				calls = 0,
				lastResizeData;

			editor.on( 'resize', function( e ) {
				calls++;
				lastResizeData = e.data;
			} );

			editor.resize( 200, 400 );

			editor.execCommand( 'maximize' );
			assert.areEqual( window.innerHeight || document.documentElement.clientHeight, lastResizeData.outerHeight, 'Height should be same as window height.' );
			assert.areEqual( window.innerWidth || document.documentElement.clientWidth, lastResizeData.outerWidth, 'Width should be same as window height.' );

			editor.execCommand( 'maximize' );
			assert.areEqual( 200, lastResizeData.outerWidth, 'Width should be restored.' );
			assert.areEqual( 400, lastResizeData.outerHeight, 'Height should be restored.' );
		} );
	},

	'test maximize command work when config title is set to empty string': function() {
		bender.editorBot.create( {
			name: 'editor2',
			config: {
				title: ''
			}
		}, function( bot ) {
			var inner = bot.editor.container.getFirst( function( node ) {
				return node.hasClass( 'cke_inner' );
			} );

			bot.editor.execCommand( 'maximize' );
			assert.isTrue( inner.hasClass( 'cke_maximized' ) );

			bot.editor.execCommand( 'maximize' );
			assert.isFalse( inner.hasClass( 'cke_maximized' ) );
		} );
	},

	// (#4374)
	'test maximize integrates with native History API by default': function() {
		bender.editorBot.create( {
			name: 'editor_historyDefault'
		}, function( bot ) {
			var ckeWindow = CKEDITOR.document.getWindow(),
				editor = bot.editor,
				maximizeCommand = editor.getCommand( 'maximize' );

			ckeWindow.on( 'popstate', function() {
				assert.areSame( CKEDITOR.TRISTATE_OFF, maximizeCommand.state, 'Maximize has correct state – OFF' );
			}, null, null, 999 );

			editor.execCommand( 'maximize' );

			ckeWindow.fire( 'popstate' );
		} );
	},

	// (#4374)
	'test maximize integrates with native History API if config.maximize_historyIntegration is set to native value': function() {
		bender.editorBot.create( {
			name: 'editor_historyNative',
			config: {
				maximize_historyIntegration: CKEDITOR.HISTORY_NATIVE
			}
		}, function( bot ) {
			var ckeWindow = CKEDITOR.document.getWindow(),
				editor = bot.editor,
				maximizeCommand = editor.getCommand( 'maximize' );

			ckeWindow.on( 'popstate', function() {
				assert.areSame( CKEDITOR.TRISTATE_OFF, maximizeCommand.state, 'Maximize has correct state – OFF' );
			}, null, null, 999 );

			editor.execCommand( 'maximize' );

			ckeWindow.fire( 'popstate' );
		} );
	},

	// (#4374)
	'test maximize integrates with hash-based navigation if config.maximize_historyIntegration is set to hash value': function() {
		bender.editorBot.create( {
			name: 'editor_historyHash',
			config: {
				maximize_historyIntegration: CKEDITOR.HISTORY_HASH
			}
		}, function( bot ) {
			var ckeWindow = CKEDITOR.document.getWindow(),
				editor = bot.editor,
				maximizeCommand = editor.getCommand( 'maximize' );

			ckeWindow.on( 'hashchange', function() {
				assert.areSame( CKEDITOR.TRISTATE_OFF, maximizeCommand.state, 'Maximize has correct state – OFF' );
			}, null, null, 999 );

			editor.execCommand( 'maximize' );
			ckeWindow.fire( 'hashchange' );
		} );
	},

	// (#4374)
	'test maximize does not integrates with history if config.maximize_historyIntegration is set to off value': function() {
		bender.editorBot.create( {
			name: 'editor_historyOff',
			config: {
				maximize_historyIntegration: CKEDITOR.HISTORY_OFF
			}
		}, function( bot ) {
			var ckeWindow = CKEDITOR.document.getWindow(),
				editor = bot.editor,
				maximizeCommand = editor.getCommand( 'maximize' );

			ckeWindow.on( 'popstate', function() {
				assert.areSame( CKEDITOR.TRISTATE_ON, maximizeCommand.state, 'Maximize has correct state – ON' );

				ckeWindow.fire( 'hashchange' );
			}, null, null, 999 );

			ckeWindow.on( 'hashchange', function() {
				assert.areSame( CKEDITOR.TRISTATE_ON, maximizeCommand.state, 'Maximize has correct state – ON' );
			}, null, null, 999 );

			editor.execCommand( 'maximize' );
			ckeWindow.fire( 'popstate' );
		} );
	},

	// (#5396)
	'test maximize removes \'popstate\' event handler when editor instance is destroyed': function() {
		bender.editorBot.create( {
			name: 'editor_destroy_popstate',
			config: {
				maximize_historyIntegration: CKEDITOR.HISTORY_NATIVE
			}
		}, function( bot ) {
			var ckeWindow = CKEDITOR.document.getWindow(),
				editor = bot.editor,
				initialPopstateListenersLength = ckeWindow.getPrivate().events.popstate.listeners.length;

			editor.destroy();

			var popstateListenersLength = ckeWindow.getPrivate().events.popstate.listeners.length;

			assert.areSame( initialPopstateListenersLength - 1, popstateListenersLength, 'the popstate listener should be removed' );
		} );
	},

	// (#5396)
	'test maximize removes \'hashchange\' event handler when editor instance is destroyed': function() {
		bender.editorBot.create( {
			name: 'editor_destroy_hash',
			config: {
				maximize_historyIntegration: CKEDITOR.HISTORY_HASH
			}
		}, function( bot ) {
			var ckeWindow = CKEDITOR.document.getWindow(),
				editor = bot.editor,
				listeners = ckeWindow.getPrivate().events.hashchange.listeners,
				initialHashchangeListenersLength = listeners.length;

			editor.destroy();

			var hashchangeListenersLength = listeners.length;

			assert.areSame( initialHashchangeListenersLength - 1, hashchangeListenersLength, 'The hashchange listener be removed' );
		} );
	},

	// (#5396)
	'test maximize does not add \'hashchange\' and \'popstate\' listeners when config.maximize_historyIntegration is set to off value': function() {
		bender.editorBot.create( {
			name: 'editor_destroy_hash',
			config: {
				maximize_historyIntegration: CKEDITOR.HISTORY_OFF
			}
		}, function( bot ) {
			var ckeWindow = CKEDITOR.document.getWindow(),
				editor = bot.editor,
				hashchangeListeners = ckeWindow.getPrivate().events.hashchange.listeners,
				popstateListeners = ckeWindow.getPrivate().events.popstate.listeners,
				initialHashchangeListenersLength = hashchangeListeners.length,
				initialPopstateListenersLength = popstateListeners.length;

			editor.destroy();

			var hashchangeListenersLength = hashchangeListeners.length;
			var popstateListenersLength = popstateListeners.length;

			assert.areSame(
				initialHashchangeListenersLength, hashchangeListenersLength,
				'The hashchange listeners length should be equal with the initial length'
			);
			assert.areSame(
				initialPopstateListenersLength, popstateListenersLength,
				'The popstate listeners length should be equal with the initial length'
			);
		} );
	}
} );
