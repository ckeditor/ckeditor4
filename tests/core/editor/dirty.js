/* bender-tags: editor,unit */

bender.editor = true;
bender.test( {
	'#9872: test editor dirty flag during editor init': function() {
		// We need to check checkDirty() immediately on instanceReady,
		// not inside editorBot.create() callback, because it's executed
		// after a short while.
		bender.editorBot.create( {
			name: 'editor1',
			startupData: 'foo',
			config: {
				plugins: 'wysiwygarea',
				on: {
					loaded: function( evt ) {
						// We need to store this value, because resume() defers assertion.
						var wasDirty = evt.editor.checkDirty();
						resume( function() {
							assert.isFalse( wasDirty, 'On editor#loaded.' );
							wait();
						} );
					},
					instanceReady: function( evt ) {
						// We need to store this value, because resume() defers assertion.
						var wasDirty = evt.editor.checkDirty();
						resume( function() {
							assert.isFalse( wasDirty, 'On editor#instanceReady.' );
							wait();
						} );
					}
				}
			}
		},
		function( bot ) {
			// Check it again.. cause we can :).
			assert.isFalse( bot.editor.checkDirty(), 'After editor#instanceReady.' );
		} );
	},

	'test editor dirty flag after setMode': function() {
		// Scenario:
		// * Initially dirty should be false.
		// * Switch between modes - dirty should stay false.
		// * Set data - dirty should be true.
		// * Switch between modes - dirty should stay true.

		bender.editorBot.create( {
			name: 'editor3',
			creator: 'replace', // Force themedui creator - inline doesn't support modes.
			config: {
				plugins: 'wysiwygarea,sourcearea'
			}
		},
		function( bot ) {
			var editor = bot.editor,
				dirty = [];
			assert.isFalse( editor.checkDirty(), 'Initial value.' );

			setTimeout( function() {
				editor.setMode( 'source', function() {
					dirty.push( editor.checkDirty() ); // 0

					editor.setMode( 'wysiwyg', function() {
						dirty.push( editor.checkDirty() ); // 1

						editor.setData( 'new data', function() {
							dirty.push( editor.checkDirty() ); // 2

							editor.setMode( 'source', function() {
								dirty.push( editor.checkDirty() ); // 3

								editor.setMode( 'wysiwyg', function() {
									dirty.push( editor.checkDirty() ); // 4

									resume( function() {
										assert.isFalse( dirty[ 0 ], '0 - after mode switch to source.' );
										assert.isFalse( dirty[ 1 ], '1 - after mode switch to wysigwyg.' );
										assert.isTrue( dirty[ 2 ], '2 - after setData.' );
										assert.isTrue( dirty[ 3 ], '3 - after 2nd mode switch to source.' );
										assert.isTrue( dirty[ 4 ], '4 - after 2nd mode switch to wysiwyg.' );
									} );
								} );
							} );
						} );
					} );
				} );
			} );
			// </inception>

			wait();
		} );
	},

	'test editor dirty flag when focused': function() {
		var editor = this.editor;
		editor.focus();
		assert.isFalse( editor.checkDirty() );
	},

	'test editor dirty flag after load data': function() {
		var bot = this.editorBot,
			editor = this.editor;
		bot.setData( 'foo', function() {
			assert.isTrue( editor.checkDirty() );
		} );
	}
} );