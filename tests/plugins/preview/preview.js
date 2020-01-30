/* bender-tags: editor */
/* bender-ckeditor-plugins: preview */

bender.editor = {
	startupData: '<p>Foo</p>'
};

bender.test( {
	'test processing of data on contentPreview': function() {
		var tc = this,
			editor = tc.editor;

		editor.once( 'contentPreview', function( event ) {
			event.data.dataValue = event.data.dataValue.replace( 'Foo', 'Bar' );
		}, null, null, 1 );

		editor.once( 'contentPreview', function( event ) {
			tc.resume( function() {
				assert.isArray( event.data.dataValue.match( '<p>Bar</p>' ), 'Content has been altered.' );
			} );

			event.cancel();	// Don't open preview window.
		}, null, null, 2 );

		editor.execCommand( 'preview' );

		tc.wait();
	},

	// (#3661)
	'test createPreview returns new window': function() {
		// It's not possible to overwrite window.open in IE8.
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
			assert.ignore();
		}

		var openStub = sinon.stub( window, 'open', function() {
				return {
					document: {
						open: function() {},
						write: function() {},
						close: function() {}
					}
				};
			} ),
			returnValue = CKEDITOR.plugins.preview.createPreview( this.editor );

		openStub.restore();

		assert.isInstanceOf( CKEDITOR.dom.window, returnValue );
	},

	// (#3661)
	'test preview command is available in inline editor': function() {
		bender.editorBot.create( {
			name: 'inline',
			creator: 'inline',
			startupData: '<p>Foo</p>',
			config: {
				plugins: 'preview'
			}
		}, function( bot ) {
			assert.isNotUndefined( bot.editor.getCommand( 'preview' ), 'Command is registered' );
		} );
	},

	// (#3661)
	'test preview command is not available in source mode': function() {
		bender.editorBot.create( {
			name: 'source-test',
			startupData: '<p>Foo</p>',
			config: {
				startupMode: 'source',
				plugins: 'preview,sourcearea'
			}
		}, function( bot ) {
			var editor = bot.editor,
				previewCommand = editor.getCommand( 'preview' );

			assert.isNotUndefined( previewCommand, 'Command is registered' );
			assert.areSame( previewCommand.state, CKEDITOR.TRISTATE_DISABLED, 'Command is disabled' );
		} );
	}
} );
