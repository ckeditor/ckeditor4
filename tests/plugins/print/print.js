/* bender-tags: editor */
/* bender-ckeditor-plugins: print */

bender.editor = {
	startupData: '<p>Foo</p>'
};

bender.test( {
	// (#3661)
	'test print command uses CKEDITOR.plugins.preview#createPreview()': function() {
		var editor = this.editor,
			createPreviewStub = sinon.stub( CKEDITOR.plugins.preview, 'createPreview', function() {
				return {
					$: {
						print: function() {},
						close: function() {},
						document: {
							execCommand: function() {}
						}
					}
				};
			} );

		editor.once( 'afterCommandExec', function() {
			resume( function() {
				createPreviewStub.restore();

				assert.areSame( 1, createPreviewStub.callCount );
			} );
		} );

		editor.execCommand( 'print' );
		wait();
	},

	// (#3661)
	'test returning false from CKEDITOR.plugins.preview#createPreview cancels printing': function() {
		var editor = this.editor,
			createPreviewStub = sinon.stub( CKEDITOR.plugins.preview, 'createPreview', function() {
				return false;
			} );

		editor.once( 'afterCommandExec', function() {
			resume( function() {
				createPreviewStub.restore();

				assert.pass();
			} );
		} );

		editor.execCommand( 'print' );
		wait();
	},

	// (#3661)
	'test print command is available in inline editor': function() {
		bender.editorBot.create( {
			name: 'inline',
			creator: 'inline',
			startupData: '<p>Foo</p>',
			config: {
				plugins: 'print'
			}
		}, function( bot ) {
			assert.isNotUndefined( bot.editor.getCommand( 'print' ), 'Command is registered' );
		} );
	}
} );
