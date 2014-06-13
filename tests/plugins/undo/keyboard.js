/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: undo,basicstyles,toolbar,wysiwygarea */

( function() {
	'use strict';

	var changeCounter = 0,
		keystrokesPerSnapshotLimit = 25;

	bender.editor = {
		startupData: '<p>foo</p>',
		config: {
			on: {
				change: function() {
					changeCounter++;
				}
			}
		}
	};

	// Simple mapping of key codes to human readable identifiers.
	var keyCodesEnum = {
		BACKSPACE: 8,
		DELETE: 46,

		KEY_D: 68,
		KEY_G: 71,

		RIGHT: 39,
		LEFT: 37,
		DOWN: 40,
		UP: 38,

		HOME: 36,
		END: 35,
		PAGEUP: 33,
		PAGEDOWN: 34
	};

	var tcs = {
		// This function assumes that your editor has only a paragraph with a text node.
		// It changes selection in this text node
		_moveTextNodeRange: function( newStartOffset, newEndOffset ) {
			var editor = bender.editor,
				rng = new CKEDITOR.dom.range( editor.document ),
				textNode = editor.editable().getFirst().getFirst(),
				sel = editor.getSelection();

			rng.setStart( textNode, newStartOffset );
			rng.setEnd( textNode, newEndOffset === undefined ? newStartOffset : newEndOffset );

			sel.selectRanges( [ rng ] );
		},

		setUp: function() {
			// Inits tools used to mimic events if needed.
			if ( !this.tools ) {
				this.tools = undoEventDispatchTestsTools( this );
				// Alias for more convenient accesss.
				this.keyTools = this.tools.key;
			}

			changeCounter = 0;
			this.undoManager = bender.editor.undoManager;

			this.editorBot.setHtmlWithSelection( '<p>_^_</p>' );

			// For each TC we want to reset undoManager.
			this.undoManager.reset();
			// This will reset command objects states.
			this.undoManager.onChange();
		},

		_should: {
			ignore: {
				'test function keys typing counter': CKEDITOR.env.ie,
				'test buggy Android keyboard model': !CKEDITOR.env.webkit
			}
		},

		'test undoManager.strokesRecorded initialization': function() {
			var undoManager = this.undoManager;

			assert.isInstanceOf( Array, undoManager.strokesRecorded, 'Type' );
			assert.areSame( 2, undoManager.strokesRecorded.length, 'Length' );
			arrayAssert.itemsAreSame( [ 0, 0 ], undoManager.strokesRecorded, 'Value' );
		},

		'test character typing counter': function() {
			// strokesRecorded should reflect count of chars written.
			var undoManager = this.undoManager;
			assert.areSame( 0, undoManager.strokesRecorded[ 0 ], 'Initial undoManager.strokesRecorded[ 0 ] val is invalid' );
			// Count of pressed functional keys, should not change during whole TC.
			assert.areSame( 0, undoManager.strokesRecorded[ 1 ], 'Initial undoManager.strokesRecorded[ 1 ] val is invalid' );

			// Typing...
			this.keyTools.keyEvent( keyCodesEnum.KEY_D );
			assert.areSame( 1, undoManager.strokesRecorded[ 0 ], 'undoManager.strokesRecorded[ 0 ] was not correctly' );
			assert.areSame( 0, undoManager.strokesRecorded[ 1 ], 'Count of functional keystrokes should remain unchanged' );

			this.keyTools.keyEvent( keyCodesEnum.KEY_G );
			assert.areSame( 2, undoManager.strokesRecorded[ 0 ], 'undoManager.strokesRecorded[ 0 ] was not correctly' );
			assert.areSame( 0, undoManager.strokesRecorded[ 1 ], 'Count of functional keystrokes should remain unchanged' );
		},

		'test undoManager.resetType() strokesRecorded reseting': function() {
			var undoManager = this.undoManager;

			undoManager.strokesRecorded = [ 3, 0 ];
			undoManager.resetType();

			arrayAssert.itemsAreSame( [ 0, 0 ], undoManager.strokesRecorded, 'strokesRecorded were not zeroed' );
		},

		'test undoManager change event firing': tcWithExpectedChanges( 30, function() {
			// Change event should be fired on each key.
			var keyPressesCount = 30;

			for ( var i = 0; i < keyPressesCount; i++ )
				this.keyTools.keyEvent( keyCodesEnum.KEY_D );
		} ),

		'test undoManager change event for functional keys': tcWithExpectedChanges( 2, function() {
			var textNode = bender.editor.editable().getFirst().getFirst(),
				// Because we have caret in the middle, text node is splitted into two parts.
				secondTextNode = textNode.getNext();
			this.keyTools.keyEvent( keyCodesEnum.BACKSPACE, null, null, function() { textNode.setText( '' ); } );
			this.keyTools.keyEvent( keyCodesEnum.DELETE, null, null, function() { secondTextNode.setText( '' ); } );
		} ),

		'test buggy Android keyboard model': tcWithExpectedChanges( 1, function() {
			// Andoid has messed up events order.
			// I.e. input fires before `keydown`, and all the key events have no
			// keyCode (it's set to 0).
			// (Chrome 35.0.1916.122, Android 4.4.2)

			// DOM should be already modified, events firing and no snapshot should be made.
			bender.editor.fire( 'lockSnapshot' );
			bender.editor.insertText( 'G' );
			bender.editor.fire( 'unlockSnapshot' );

			this.keyTools.singleEvent( 'input' );
			this.keyTools.singleKeyEvent( 0, { type: 'keydown' } );
			this.keyTools.singleKeyEvent( 0, { type: 'keyup' } );
			// Now expect change event to be checked.
		} ),

		'test function keys typing counter': tcWithExpectedChanges( 3, function() {
			// IE will fail this TC, because we would need to modify DOM each time.
			assert.areSame( 0, this.undoManager.strokesRecorded[ 1 ], 'Initial undoManager.strokesRecorded[ 1 ] value' );

			this.keyTools.keyEventMultiple( 3, keyCodesEnum.BACKSPACE );

			assert.areSame( 3, this.undoManager.strokesRecorded[ 1 ], 'undoManager.strokesRecorded[ 1 ] should be increased' );

		} ),

		'test undoManager.strokesRecorded reseting': function() {
			var undoManager = this.undoManager,
				textNode = bender.editor.editable().getFirst().getFirst();
			// If we'll type few characters, and then press any functional key
			// (i.e. del/backspace), undoManager should reset characters counter.
			// This also works in reversed case.
			this.keyTools.typingEvents( 'FOO' );

			this.keyTools.keyEvent( keyCodesEnum.BACKSPACE, null, null, function( e ) {
				// Textnode change required by IE.
				textNode.setText( 'FO' );
			} );

			assert.areSame( 0, undoManager.strokesRecorded[ 0 ], 'undoManager.strokesRecorded for characters not zeroed' );
			// Hit backspace once more.
			this.keyTools.keyEvent( keyCodesEnum.BACKSPACE );
			// Then type a character and ensure that functional keys counter was restarted.
			this.keyTools.keyEvent( keyCodesEnum.KEY_D );
			assert.areSame( 0, undoManager.strokesRecorded[ 1 ], 'undoManager.strokesRecorded for functional keys not zeroed' );
		},

		'test strokesRecorded reset after exceeding limit': tcWithExpectedChanges( keystrokesPerSnapshotLimit, function() {
			// This count should be equal to limit of keys inbetween snapshot.
			var keyStrokesCount = keystrokesPerSnapshotLimit,
				snapshotEventsCount = 0,
				undoManager = this.undoManager;

			bender.editor.on( 'saveSnapshot', function() {
				snapshotEventsCount++;
			}, null, null, -1000 );

			this.keyTools.keyEventMultiple( keyStrokesCount, keyCodesEnum.KEY_D );

			assert.areSame( 0, undoManager.strokesRecorded[ 0 ], 'undoManager.strokesRecorded[ 0 ] is not zeroed' );
			assert.areSame( 1, snapshotEventsCount, 'Wrong editor#saveSnapshot events count' );
		} ),

		'test undoManager.typing property': function() {
			var undoManager = this.undoManager,
				iterationsCount = 15,
				i;

			assert.isFalse( undoManager.typing, 'Invalid undoManager.typing val' );

			for ( i = 0; i < iterationsCount; i++ ) {
				this.keyTools.keyEvent( keyCodesEnum.KEY_D );
				assert.isTrue( undoManager.typing, 'Invalid undoManager.typing at character key ' + i + '. iteration' );
			}
			// Now lets use functional keys and ensure that typing is still true.
			for ( i = 0; i < iterationsCount; i++ ) {
				this.keyTools.keyEvent( keyCodesEnum.BACKSPACE );
				assert.isTrue( undoManager.typing, 'Invalid undoManager.typing at functional keys ' + i + '. iteration' );
			}
		},

		'test undoManager selection overwriting': function() {
			// Ensures that pressing navigation key will update selection in
			// latest snapshot (known during navigation key).
			this.editorBot.setData( '<p>foo bar</p>', function() {
				var undoManager = bender.editor.undoManager,
					textNode = bender.editor.editable().getFirst().getFirst(),
					that = this;

				// Initis with: foo^ bar
				that._moveTextNodeRange( 3 );

				this.keyTools.keyEvent( keyCodesEnum.RIGHT, null, true, function() {
					// Pressing right arrow should move caret to 4 offset.
					that._moveTextNodeRange( 4 );
				} );

				this.keyTools.keyEvent( keyCodesEnum.KEY_D, null, false, function() {
					// Should insert letter to text node, and move the caret.
					textNode.setText( 'foo Dbar' );
					that._moveTextNodeRange( 5 );
				} );

				assert.areEqual( 2, undoManager.snapshots.length, 'Invalid snapshots count' );

				var interestingSnapshot = undoManager.snapshots[ 1 ];
				assert.isTrue( !!interestingSnapshot, 'No snapshot at 1 index' );

				assert.areEqual( 4, interestingSnapshot.bookmarks[ 0 ].startOffset, 'Invalid bookmark start offset' );
				assert.areEqual( 4, interestingSnapshot.bookmarks[ 0 ].endOffset, 'Invalid bookmark start offset' );
			} );
		},

		'test undoManager extra snapshot on navigation key after recordable keystroke': function() {
			this.editorBot.setData( '<p>foo bar</p>', function() {
				var undoManager = bender.editor.undoManager,
					textNode = bender.editor.editable().getFirst().getFirst(),
					that = this;

				// Initis with: foo ^bar
				this._moveTextNodeRange( 4 );

				this.keyTools.keyEvent( keyCodesEnum.KEY_D, null, false, function() {
					// Should insert letter to text node, and move the caret.
					textNode.setText( 'foo Dbar' );
					that._moveTextNodeRange( 5 );
				} );
				this.keyTools.keyEvent( keyCodesEnum.KEY_D, null, false, function() {
					// Should insert letter to text node, and move the caret.
					textNode.setText( 'foo DDbar' );
					that._moveTextNodeRange( 6 );
				} );

				assert.areEqual( 2, undoManager.snapshots.length, 'Invalid snapshots count' );

				// Left arrow three times.
				this.keyTools.keyEvent( keyCodesEnum.LEFT, null, true, function() {
					that._moveTextNodeRange( 5 );
				} );

				assert.areEqual( 3, undoManager.snapshots.length, 'Extra snapshot not created' );

				// Extra snapshot should also reset: undoManager.strokesRecorded array and undoManager.typing
				assert.areEqual( false, undoManager.typing, 'undoManager.typing wasn\'t changed' );
				arrayAssert.itemsAreSame( [ 0, 0 ], undoManager.strokesRecorded, 'Invalid undoManager.strokesRecorded' );
			} );
		},

		'test undoManager.amendSelection': function() {
			// Initial editor content is: "<p>__</p>"
			// and selection start/end offset is 1.
			var img1 = new CKEDITOR.plugins.undo.Image( bender.editor ),
				img2 = new CKEDITOR.plugins.undo.Image( bender.editor ),
				img2bookmark = img2.bookmarks[ 0 ],
				undoManager = bender.editor.undoManager;

			undoManager.snapshots = [ img1 ];

			// First - identical images, nothing should happen.
			undoManager.amendSelection( img2 );
			assert.areEqual( 1, undoManager.snapshots.length, 'Snapshots count should not change' );
			assert.areEqual( 1, undoManager.snapshots[ 0 ].bookmarks[ 0 ].startOffset, 'Invalid bookmark startOffset' );
			assert.areEqual( 1, undoManager.snapshots[ 0 ].bookmarks[ 0 ].endOffset, 'Invalid bookmark endOffset' );

			// Reset snapshots array.
			undoManager.snapshots = [ img1 ];

			// Now - diffrent selection, same content.
			img2bookmark.startOffset = 2;
			img2bookmark.endOffset = 2;

			undoManager.amendSelection( img2 );
			assert.areEqual( 1, undoManager.snapshots.length, 'Snapshots count should not change' );
			assert.areEqual( 2, undoManager.snapshots[ 0 ].bookmarks[ 0 ].startOffset, 'Bookmark startOffset not updated' );
			assert.areEqual( 2, undoManager.snapshots[ 0 ].bookmarks[ 0 ].endOffset, 'Bookmark endOffset not updated' );

			// Reset snapshots array.
			undoManager.snapshots = [ img1 ];

			// Now - same selection, diffrent content.
			img2bookmark.startOffset = 1;
			img2bookmark.endOffset = 1;
			img2.contents = '<p>____</p>';

			undoManager.amendSelection( img2 );
			assert.areEqual( 1, undoManager.snapshots.length, 'Snapshots should not change' );
			assert.areEqual( 1, undoManager.snapshots[ 0 ].bookmarks[ 0 ].startOffset, 'Invalid bookmark startOffset' );
			assert.areEqual( 1, undoManager.snapshots[ 0 ].bookmarks[ 0 ].endOffset, 'Invalid bookmark endOffset' );

			// Ensure that it does not breaks when snapshots array is empty.
			undoManager.snapshots = [];
			undoManager.amendSelection( img2 );
		},

		'test backspace snapshot content': function() {
			// In this test we'll type few characters, and then press backspace
			// (functional key) few times, so it will trigger key group change,
			// and extra snapshot. We need to ensure.
			this.editorBot.setData( '<p>foo bar</p>', function() {
				var undoManager = bender.editor.undoManager,
					textNode = bender.editor.editable().getFirst().getFirst(),
					// Some browsers inserts extra BR.
					extraBr = ( CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.version >= 11 ) ? '<br>' : '',
					that = this;

				// Initis with: foo ^bar
				that._moveTextNodeRange( 4 );

				this.keyTools.keyEvent( keyCodesEnum.KEY_D, null, false, function() {
					// Should insert letter to text node, and move the caret.
					textNode.setText( 'foo Dbar' );
					that._moveTextNodeRange( 5 );
				} );

				// Now delete three times.
				this.keyTools.keyEvent( keyCodesEnum.BACKSPACE, null, false, function() {
					// Should insert letter to text node, and move the caret.
					textNode.$.ownerDocument.body.normalize();
					textNode.setText( 'foo bar' );
					that._moveTextNodeRange( 4 );
				} );
				this.keyTools.keyEvent( keyCodesEnum.BACKSPACE, null, false, function() {
					textNode.$.ownerDocument.body.normalize();
					// Should insert letter to text node, and move the caret.
					textNode.setText( 'foobar' );
					that._moveTextNodeRange( 3 );
				} );

				assert.areEqual( 3, undoManager.snapshots.length, 'Invalid snapshots count' );
				assert.areEqual( '<p>foo bar' + extraBr + '</p>', undoManager.snapshots[ 1 ].contents, 'Invalid content for undoManager.snapshot[1]' );
				assert.areEqual( '<p>foo Dbar' + extraBr + '</p>', undoManager.snapshots[ 2 ].contents, 'Invalid content for undoManager.snapshot[2]' );
			} );
		},

		'test affecting commands state': function() {
			// Ensures that undo/redo command state is correctly changed.
			var undoCommand = bender.editor.getCommand( 'undo' ),
				redoCommand = bender.editor.getCommand( 'redo' );

			this._moveTextNodeRange( 0 );

			// Initially both disabled.
			assert.areEqual( CKEDITOR.TRISTATE_DISABLED, undoCommand.state, 'Invalid undo command state' );
			assert.areEqual( CKEDITOR.TRISTATE_DISABLED, redoCommand.state, 'Invalid redo command state' );

			// Now type something.
			this.keyTools.keyEvent( keyCodesEnum.KEY_D );
			assert.areEqual( CKEDITOR.TRISTATE_OFF, undoCommand.state, 'Invalid undo command state after typing character' );
			assert.areEqual( CKEDITOR.TRISTATE_DISABLED, redoCommand.state, 'Invalid redo command state after typing character' );
		},

		'test no snapshot on dummy backspace': function() {
			// Backspace which does not remove anything, shouln'd create snapshot.
			var undoCommand = bender.editor.getCommand( 'undo' ),
				undoManager = bender.editor.undoManager,
				// IE will send keypress for backspace, which is treated as "input" event.
				skipInputEvent = CKEDITOR.env.ie ? false : true;

			this._moveTextNodeRange( 0 );

			// Repeat it multiple time, so we'll ensure that snapshot will not be created
			// after exceeding the chars in snapshot limit.
			this.keyTools.keyEventMultiple( 30, keyCodesEnum.BACKSPACE, null, skipInputEvent );

			assert.areEqual( 0, undoManager.snapshots.length, 'Invalid snapshots count' );

			assert.areEqual( CKEDITOR.TRISTATE_DISABLED, undoCommand.state, 'Invalid undo command state after typing character' );
		},

		'test undoManager.isNavigationKey': function() {
			var naviKeys = [ 'HOME', 'END', 'RIGHT', 'LEFT', 'DOWN', 'UP', 'PAGEDOWN', 'PAGEUP' ],
				undoManager = bender.editor.undoManager,
				curKey;

			for ( var i=0; i < naviKeys.length; i++ ) {
				curKey = naviKeys[ i ];
				assert.isTrue( undoManager.isNavigationKey( keyCodesEnum[ curKey ] ), 'Invalid result for ' + curKey );
			}

			assert.isFalse( undoManager.isNavigationKey( keyCodesEnum.BACKSPACE ), 'Invalid result for Backspace' );
			assert.isFalse( undoManager.isNavigationKey( keyCodesEnum.KEY_D ), 'Invalid result for D key' );
		}
	};

	/**
	 * Returns a TC fn decorated with change events checking function.
	 *
	 * @param {Number} expectedEventsCount Expected count of change events which should be called
	 * *synchronously* after tcFunction execution.
	 * @param {Function} tcFunction Basically TC function to be executed.
	 */
	function tcWithExpectedChanges( expectedEventsCount, tcFunction ) {
		return function() {
			tcFunction.call( this );
			assert.areSame( expectedEventsCount, changeCounter, 'Invalid change events count' );
		};
	}

	bender.test( tcs );
} )();