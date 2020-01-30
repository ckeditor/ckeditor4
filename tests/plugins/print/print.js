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
					once: function( event, cb ) {
						if ( event === 'load' ) {
							cb();
						}
					},
					$: {
						print: function() {},
						close: function() {},
						document: {
							readyState: 'interactive',
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
	},

	// (#3661)
	'test print command is executed after the document\'s load event': function() {
		var isLoaded = false,
			isLoadedOnPrint = null,
			createPreviewStub = sinon.stub( CKEDITOR.plugins.preview, 'createPreview', function() {
				return {
					once: function( event, cb ) {
						if ( event !== 'load' ) {
							return;
						}

						isLoaded = true;

						cb();

					},
					$: {
						print: function() {
							isLoadedOnPrint = isLoaded;
						},
						close: function() {},
						document: {
							readyState: 'interactive',
							execCommand: function( name ) {
								if ( name.toLowerCase() !== 'print' ) {
									return;
								}

								isLoadedOnPrint = isLoaded;
							}
						}
					}
				};
			} );

		bender.editorBot.create( {
			name: 'load-test',
			startupData: '<p>Foo</p>',
			config: {
				plugins: 'print,image'
			}
		}, function( bot ) {
			bot.editor.on( 'afterCommandExec', function() {
				resume( function() {
					createPreviewStub.restore();

					assert.isNotNull( isLoadedOnPrint, 'Print was performed' );
					assert.isTrue( isLoadedOnPrint, 'Print was performed without load event' );
				} );
			} );

			bot.editor.execCommand( 'print' );
			wait();
		} );
	},

	// (#3661)
	'test print command is executed immediately if document is in complete mode': function() {
		var isLoaded = false,
			isLoadedOnPrint = null,
			createPreviewStub = sinon.stub( CKEDITOR.plugins.preview, 'createPreview', function() {
				return {
					once: function( event, cb ) {
						if ( event !== 'load' ) {
							return;
						}

						isLoaded = true;

						cb();

					},
					$: {
						print: function() {
							isLoadedOnPrint = isLoaded;
						},
						close: function() {},
						document: {
							readyState: 'complete',
							execCommand: function( name ) {
								if ( name.toLowerCase() !== 'print' ) {
									return;
								}

								isLoadedOnPrint = isLoaded;
							}
						}
					}
				};
			} );

		bender.editorBot.create( {
			name: 'complete-test',
			startupData: '<p>Foo</p>',
			config: {
				plugins: 'print,image'
			}
		}, function( bot ) {
			bot.editor.on( 'afterCommandExec', function() {
				resume( function() {
					createPreviewStub.restore();

					assert.isNotNull( isLoadedOnPrint, 'Print was performed' );
					assert.isFalse( isLoadedOnPrint, 'Print was performed without load event' );
				} );
			} );

			bot.editor.execCommand( 'print' );
			wait();
		} );
	},

	// (#3661)
	'test print command is not available in source mode': function() {
		bender.editorBot.create( {
			name: 'source-test',
			startupData: '<p>Foo</p>',
			config: {
				startupMode: 'source',
				plugins: 'preview,print,sourcearea'
			}
		}, function( bot ) {
			var editor = bot.editor,
				printCommand = editor.getCommand( 'print' );

			assert.isNotUndefined( printCommand, 'Command is registered' );
			assert.areSame( printCommand.state, CKEDITOR.TRISTATE_DISABLED, 'Command is disabled' );
		} );
	}
} );
