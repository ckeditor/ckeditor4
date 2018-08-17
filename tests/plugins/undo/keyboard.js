/* bender-tags: editor */
/* bender-ckeditor-plugins: undo,basicstyles,toolbar,wysiwygarea */
/* global undoEventDispatchTestsTools */

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

	function removeLastCharFromTextNode( textNode ) {
		var text = textNode.getText();
		text = text.substring( 0, text.length - 1 );
		textNode.setText( text );
	}

	function addCharactersToTextNode( textNode, characters ) {
		textNode.setText( textNode.getText() + characters );
	}

	function curryAddCharactersToTextNode( textNode, characters ) {
		return function() {
			addCharactersToTextNode( textNode, characters );
		};
	}

	function simulateHoldKey( times, keyTools, keyCode, domModification, beforeKeyUp ) {
		var UndoManager = CKEDITOR.plugins.undo.UndoManager;

		while ( times-- ) {
			keyTools.singleKeyEvent( keyCode, { type: 'keydown' } );
			domModification();

			// On IE there is no any event fired when functional key is down.
			if ( !UndoManager.ieFunctionalKeysBug( keyCode ) ) {
				keyTools.singleKeyEvent( 0, { type: ( CKEDITOR.env.ie ? 'keypress' : 'input' ) } );
			}
		}

		beforeKeyUp && beforeKeyUp();

		keyTools.singleKeyEvent( keyCode, { type: 'keyup' } );
	}

	var keyCodesEnum, // keyCodesEnum will be inited in first setUp call.
		keyGroups, //
		tcs = {
			isIe8: CKEDITOR.env.ie && CKEDITOR.env.version == 8,
			// This function assumes that your editor has only a paragraph with a text node.
			// It changes selection in this text node
			_moveTextNodeRange: function( newStartOffset, newEndOffset ) {
				var editor = this.editor,
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
					keyCodesEnum = this.keyTools.keyCodesEnum;
				}

				changeCounter = 0;
				this.undoManager = this.editor.undoManager;

				if ( !keyGroups ) {
					keyGroups = CKEDITOR.plugins.undo.UndoManager.keyGroups;
				}

				bender.tools.selection.setWithHtml( this.editor, '<p>_{}_</p>' );

				// For each TC we want to reset undoManager.
				this.editor.resetUndo();
				// This will reset command objects states.
				this.undoManager.onChange();
			},

			_should: {
				ignore: {
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
				assert.areSame( 0, undoManager.strokesRecorded[ keyGroups.PRINTABLE ], 'Initial undoManager.strokesRecorded[ keyGroups.PRINTABLE ] val is invalid' );
				// Count of pressed functional keys, should not change during whole TC.
				assert.areSame( 0, undoManager.strokesRecorded[ keyGroups.FUNCTIONAL ], 'Initial undoManager.strokesRecorded[ keyGroups.FUNCTIONAL ] val is invalid' );

				// Typing...
				this.keyTools.keyEvent( keyCodesEnum.KEY_D );
				assert.areSame( 1, undoManager.strokesRecorded[ keyGroups.PRINTABLE ], 'undoManager.strokesRecorded[ keyGroups.PRINTABLE ] was not correctly' );
				assert.areSame( 0, undoManager.strokesRecorded[ keyGroups.FUNCTIONAL ], 'Count of functional keystrokes should remain unchanged' );

				this.keyTools.keyEvent( keyCodesEnum.KEY_G );
				assert.areSame( 2, undoManager.strokesRecorded[ keyGroups.PRINTABLE ], 'undoManager.strokesRecorded[ keyGroups.PRINTABLE ] was not correctly' );
				assert.areSame( 0, undoManager.strokesRecorded[ keyGroups.FUNCTIONAL ], 'Count of functional keystrokes should remain unchanged' );
			},

			'test multiple key being pressed': function() {
				// The issue is that we don't handle situation:
				// Lets assume following scenario:
				// keydown D
				// input
				// keydown G
				// input
				// keyup D
				// keyup G
				// This situation can be observed while typing text fast.
				var that = this,
					undoManager = this.editor.undoManager;

				this.editor.editable().once( 'input', function() {
					// After input, but before first keyup:
					// Now simulate second keystroke in input event (as late as possible)
					// so this keystroke will be executed before keyup for D key
					that.keyTools.keyEvent( keyCodesEnum.KEY_G );
				}, null, null, 9999 );

				this.keyTools.keyEvent( keyCodesEnum.KEY_D );

				assert.areEqual( 2, undoManager.strokesRecorded[ keyGroups.PRINTABLE ], 'Invalid undoManager.strokesRecorded[ keyGroups.PRINTABLE ]' );
			},

			'test undoManager.resetType()': function() {
				var undoManager = this.undoManager;

				undoManager.strokesRecorded = [ 3, 0 ];
				undoManager.previousKeyGroup = 1;
				undoManager.resetType();

				arrayAssert.itemsAreSame( [ 0, 0 ], undoManager.strokesRecorded, 'strokesRecorded were not zeroed' );
				assert.areEqual( -1, undoManager.previousKeyGroup, 'undoManager.previousKeyGroup' );
			},

			'test undoManager change event firing': tcWithExpectedChanges( 30, function() {
				var textNode = this.editor.editable().getFirst().getFirst(),
					// Change event should be fired on each key.
					keyPressesCount = 30;

				for ( var i = 0; i < keyPressesCount; i++ ) {
					this.keyTools.keyEvent( keyCodesEnum.KEY_D, null, false, function() {
						addCharactersToTextNode( textNode, 'd' );
					} );
				}
			} ),

			'test undoManager change event for functional keys': tcWithExpectedChanges( 2, function() {
				var textNode = this.editor.editable().getFirst().getFirst(),
					// In IE8 _{}_ will be splitted into two text nodes after calling selection#setRanges().
					secondTextNode = textNode.getNext(),
					that = this;

				this.keyTools.keyEvent( keyCodesEnum.DELETE, null, null, function() {
					// We need to chceck if it's a text node, coz IE11 inserts BR there.
					if ( secondTextNode && secondTextNode.type == CKEDITOR.NODE_TEXT )
						secondTextNode.setText( '' );
					else
						textNode.setText( '_' );
				} );

				this.keyTools.keyEvent( keyCodesEnum.BACKSPACE, null, null, function() {
					that._moveTextNodeRange( 0 );
					textNode.setText( '' );
				} );
			} ),

			'test buggy Android keyboard model': tcWithExpectedChanges( 1, function() {
				// Andoid has messed up events order.
				// I.e. input fires before `keydown`, and all the key events have no
				// keyCode (it's set to 0).
				// (Chrome 35.0.1916.122, Android 4.4.2)

				// DOM should be already modified, events firing and no snapshot should be made.
				this.editor.fire( 'lockSnapshot' );
				this.editor.insertText( 'G' );
				this.editor.fire( 'unlockSnapshot' );

				this.keyTools.singleEvent( 'input' );
				this.keyTools.singleKeyEvent( 0, { type: 'keydown' } );
				this.keyTools.singleKeyEvent( 0, { type: 'keyup' } );
				// Now expect change event to be checked.
			} ),

			'test function keys typing counter': tcWithExpectedChanges( 3, function() {
				assert.areSame( 0, this.undoManager.strokesRecorded[ keyGroups.FUNCTIONAL ], 'Initial undoManager.strokesRecorded[ keyGroups.FUNCTIONAL ] value' );

				bender.tools.selection.setWithHtml( this.editor, '<p>foobar{}</p>' );
				var textNode = this.editor.editable().getFirst().getFirst();

				for ( var i = 2; i >= 0; i-- ) {
					this.keyTools.keyEvent( keyCodesEnum.BACKSPACE, null, null, function() {
						textNode.setText( 'foo' + 'bar'.substring( 0, i ) );
					} );
				}

				assert.areSame( 3, this.undoManager.strokesRecorded[ keyGroups.FUNCTIONAL ], 'undoManager.strokesRecorded[ keyGroups.FUNCTIONAL ] should be increased' );

			} ),

			'test undoManager.strokesRecorded reseting': function() {
				var undoManager = this.undoManager,
					textNode = this.editor.editable().getFirst().getFirst();
				// If we'll type few characters, and then press any functional key
				// (i.e. del/backspace), undoManager should reset characters counter.
				// This also works in reversed case.
				this.keyTools.typingEvents( 'FOO' );

				this.keyTools.keyEvent( keyCodesEnum.BACKSPACE, null, null, function() {
					// Textnode change required by IE.
					textNode.setText( 'FO' );
				} );

				assert.areSame( 0, undoManager.strokesRecorded[ keyGroups.PRINTABLE ], 'undoManager.strokesRecorded for characters not zeroed' );
				// Hit backspace once more.
				this.keyTools.keyEvent( keyCodesEnum.BACKSPACE );
				// Then type a character and ensure that functional keys counter was restarted.
				this.keyTools.keyEvent( keyCodesEnum.KEY_D );
				assert.areSame( 0, undoManager.strokesRecorded[ keyGroups.FUNCTIONAL ], 'undoManager.strokesRecorded for functional keys not zeroed' );
			},

			'test strokesRecorded reset after exceeding limit': tcWithExpectedChanges( keystrokesPerSnapshotLimit, function() {
				// This count should be equal to limit of keys inbetween snapshot.
				var snapshotEventsCount = 0,
					textNode = this.editor.editable().getFirst().getFirst(),
					undoManager = this.undoManager;

				this.editor.on( 'saveSnapshot', function() {
					snapshotEventsCount++;
				}, null, null, -1000 );

				this.keyTools.keyEventMultiple( keystrokesPerSnapshotLimit, keyCodesEnum.KEY_D, null, false, function() {
					addCharactersToTextNode( textNode, 'd' );
				} );

				assert.areSame( 0, undoManager.strokesRecorded[ keyGroups.PRINTABLE ], 'undoManager.strokesRecorded[ keyGroups.PRINTABLE ] is not zeroed' );
				assert.areSame( 1, snapshotEventsCount, 'Wrong editor#saveSnapshot events count' );
			} ),

			'test undoManager.typing property': function() {
				bender.tools.selection.setWithHtml( this.editor, '<p>foo {}bar</p>' );

				var undoManager = this.undoManager,
					textNode = this.editor.editable().getFirst().getFirst(),
					iterationsCount = 15,
					i;

				this.editor.resetUndo();

				assert.isFalse( undoManager.typing, 'Invalid undoManager.typing val' );

				for ( i = 0; i < iterationsCount; i++ ) {
					this.keyTools.keyEvent( keyCodesEnum.KEY_D, null, false, function() {
						addCharactersToTextNode( textNode, 'd' );
					} );
					assert.isTrue( undoManager.typing, 'Invalid undoManager.typing at character key ' + i + '. iteration' );
				}
				// Now lets use functional keys and ensure that typing is still true.
				for ( i = 0; i < iterationsCount; i++ ) {
					this.keyTools.keyEvent( keyCodesEnum.BACKSPACE, null, false, function() {
						removeLastCharFromTextNode( textNode );
					} );
					assert.isTrue( undoManager.typing, 'Invalid undoManager.typing at functional keys ' + i + '. iteration' );
				}
			},

			'test undoManager selection overwriting': function() {
				// Ensures that pressing navigation key will update selection in
				// latest snapshot.
				bender.tools.selection.setWithHtml( this.editor, '<p>foo bar</p>' );

				var undoManager = this.editor.undoManager,
					that = this;

				// Initis with: ^foo bar
				that._moveTextNodeRange( 0 );

				// We need to force at least one snapshot, which will be overwritten.
				this.editor.fire( 'saveSnapshot' );
				assert.areEqual( 2, undoManager.snapshots.length, 'Invalid snapshots count' );

				this.keyTools.keyEvent( keyCodesEnum.RIGHT, null, true, function() {
					// Pressing right arrow should move caret to 1 offset.
					that._moveTextNodeRange( 1 );
				} );

				var bookmark = undoManager.snapshots[ 1 ].bookmarks[ 0 ];

				assert.areEqual( 1, bookmark.startOffset, 'Invalid bookmark start offset' );
				// IE8 sets bookmark end to 0 for some weird reason.
				if ( !this.isIe8 )
					assert.areEqual( 1, bookmark.endOffset, 'Invalid bookmark start offset' );

				// Now go back with HOME key, and ensure that selection updated.
				this.keyTools.keyEvent( keyCodesEnum.HOME, null, true, function() {
					that._moveTextNodeRange( 0 );
				} );

				// Snapshot object should be replaced, so we need to refetch it.
				bookmark = undoManager.snapshots[ 1 ].bookmarks[ 0 ];

				assert.areEqual( 0, bookmark.startOffset, 'Invalid bookmark start offset' );
				assert.areEqual( 0, bookmark.endOffset, 'Invalid bookmark start offset' );
			},

			'test undoManager extra snapshot on navigation key after recordable keystroke': function() {
				this.editorBot.setData( '<p>foo bar</p>', function() {
					var undoManager = this.editor.undoManager,
						textNode = this.editor.editable().getFirst().getFirst(),
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

			'test backspace snapshot content': function() {
				// In this test we'll type few characters, and then press backspace
				// (functional key) few times, so it will trigger key group change,
				// and extra snapshot.
				bender.tools.selection.setWithHtml( this.editor, '<p>foo {}bar</p>' );

				this.editor.fire( 'saveSnapshot' );

				var undoManager = this.editor.undoManager,
					textNode = this.editor.editable().getFirst().getFirst(),
					// Some browsers inserts extra BR.
					extraBr = ( CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.version >= 11 ) ? '<br>' : '',
					that = this;

				assert.areEqual( 2, undoManager.snapshots.length, 'Invalid initial snapshots count' );

				// Initis with: foo ^bar
				this._moveTextNodeRange( 4 );

				this.keyTools.keyEvent( keyCodesEnum.KEY_D, null, false, function() {
					// Should insert letter to text node, and move the caret.
					// Ofc IE8 will split text nodes next to selection, so we need
					// to be aware.
					if ( that.isIe8 )
						textNode.setText( 'foo D' );
					else
						textNode.setText( 'foo Dbar' );
					that._moveTextNodeRange( 5 );
				} );

				// Now delete three times.
				this.keyTools.keyEvent( keyCodesEnum.BACKSPACE, null, false, function() {
					// Should insert letter to text node, and move the caret.
					textNode.setText( 'foo bar' );
					that._moveTextNodeRange( 4 );
				} );
				this.keyTools.keyEvent( keyCodesEnum.BACKSPACE, null, false, function() {
					// Should insert letter to text node, and move the caret.
					textNode.setText( 'foobar' );
					that._moveTextNodeRange( 3 );
				} );

				assert.areEqual( 3, undoManager.snapshots.length, 'Invalid snapshots count' );

				assert.areEqual(
					'<p>foo bar' + extraBr + '</p>',
					undoManager.snapshots[ 1 ].contents.toLowerCase(),
					'Invalid content for undoManager.snapshot[1]'
				);

				assert.areEqual(
					'<p>foo dbar' + extraBr + '</p>',
					undoManager.snapshots[ 2 ].contents.toLowerCase(),
					'Invalid content for undoManager.snapshot[2]'
				);
			},

			'test affecting commands state': function() {
				// Ensures that undo/redo command state is correctly changed.
				var undoCommand = this.editor.getCommand( 'undo' ),
					redoCommand = this.editor.getCommand( 'redo' );

				this._moveTextNodeRange( 0 );

				// Initially both disabled.
				assert.areEqual( CKEDITOR.TRISTATE_DISABLED, undoCommand.state, 'Invalid undo command state' );
				assert.areEqual( CKEDITOR.TRISTATE_DISABLED, redoCommand.state, 'Invalid redo command state' );

				// Now type something.
				this.keyTools.keyEvent( keyCodesEnum.KEY_D );
				assert.areEqual( CKEDITOR.TRISTATE_OFF, undoCommand.state, 'Invalid undo command state after typing character' );
				assert.areEqual( CKEDITOR.TRISTATE_DISABLED, redoCommand.state, 'Invalid redo command state after typing character' );
			},

			'test snapshot created on more than 25 backspaces': function() {
				this.editorBot.setData( '<p>12345678901234567890123451234567890123456789012345</p>', function() {
					var undoManager = this.editor.undoManager,
						textNode = this.editor.editable().getFirst().getFirst(),
						// On IE we will have the snapshot created earlier, because
						// we must mock the keypress when key is hold, so DOM isn't changed yet.
						expected = CKEDITOR.env.ie ?
							'<p>12345678901234567890123451@</p>' :
							'<p>1234567890123456789012345@</p>';

					this.editor.resetUndo();

					assert.areEqual( 1, undoManager.snapshots.length, 'At the beginning' );

					this._moveTextNodeRange( 50 );
					assert.areEqual( 1, undoManager.snapshots.length, 'After setting selection' );

					simulateHoldKey( undoManager.strokesLimit, this.keyTools, 8 /*BACKSPACE*/, function() {
						removeLastCharFromTextNode( textNode );
					} );

					assert.areEqual( 2, undoManager.snapshots.length, 'After backspace' );
					bender.assert.isInnerHtmlMatching( expected, undoManager.snapshots[ 1 ].contents );
				} );
			},

			'test snapshot created on more than 25 changes by holding different keys - one after another': function() {
				// https://dev.ckeditor.com/ticket/12425
				assert.ignore();

				this.editorBot.setData( '<p>Hi</p>', function() {
					var undoManager = this.editor.undoManager,
						textNode = this.editor.editable().getFirst().getFirst();

					this._moveTextNodeRange( 2 );

					assert.areEqual( 2, undoManager.snapshots.length, 'Invalid snapshots count' );

					simulateHoldKey( undoManager.strokesLimit, this.keyTools, 70 /*f*/, function() {
						addCharactersToTextNode( textNode, 'f' );
					} );

					simulateHoldKey( undoManager.strokesLimit, this.keyTools, 80 /*p*/, function() {
						addCharactersToTextNode( textNode, 'p' );
					} );

					assert.areEqual( 3, undoManager.snapshots.length, 'Invalid snapshots count' );
					bender.assert.isInnerHtmlMatching( '<p>HIffffffffffffffffffffppppp@</p>', undoManager.snapshots[ 2 ].contents );
				} );
			},

			'test snapshot created when holding backspace after typing': function() {
				this.editorBot.setData( '<p>foo</p>', function() {
					var textNode = this.editor.editable().getFirst().getFirst();

					this.editor.resetUndo();

					this._moveTextNodeRange( 3 );

					for ( var i = 0; i < 5; i++ ) {
						this.keyTools.keyEvent( keyCodesEnum.KEY_D, null, false, function() {
							addCharactersToTextNode( textNode, 'd' );
						} );
					}

					simulateHoldKey( 3, this.keyTools, 8 /*BACKSPACE*/, function() {
						removeLastCharFromTextNode( textNode );
					} );

					assert.areSame( '<p>foodd</p>', this.editor.getData(), 'After deleting' );

					this.editor.execCommand( 'undo' );

					assert.areSame( '<p>fooddddd</p>', this.editor.getData(), 'After undo' );
				} );
			},

			'test one change event fired once per 25 hold keys': function() {
				this.editorBot.setData( '<p>foo</p>', function() {
					var undoManager = this.editor.undoManager,
						textNode = this.editor.editable().getFirst().getFirst(),
						changeFired = 0,
						data;

					this.editor.resetUndo();

					this._moveTextNodeRange( 3 );

					var listener = this.editor.on( 'change', function() {
						changeFired += 1;
						data = this.getData();
					} );

					simulateHoldKey( undoManager.strokesLimit, this.keyTools, keyCodesEnum.KEY_D, function() {
						addCharactersToTextNode( textNode, 'd' );
					} );

					listener.removeListener();

					assert.areSame( 1, changeFired );
					assert.areSame( '<p>fooddddddddddddddddddddddddd</p>', data );
				} );
			},

			'test snapshot created on more than 25 changes by holding different keys - both at the same time': function() {
				this.editorBot.setData( '<p>Hi</p>', function() {
					var undoManager = this.editor.undoManager,
						textNode = this.editor.editable().getFirst().getFirst(),
						addCharacterF = curryAddCharactersToTextNode( textNode, 'f' ),
						addCharacterD = curryAddCharactersToTextNode( textNode, 'd' ),
						keyTools = this.keyTools;

					this._moveTextNodeRange( 2 );

					assert.areEqual( 2, undoManager.snapshots.length, 'Invalid snapshots count' );

					simulateHoldKey( undoManager.strokesLimit - 5, keyTools, 70 /*f*/, addCharacterF, function() {
						simulateHoldKey( 10, keyTools, 68 /*d*/, addCharacterD );
					} );

					assert.areEqual( 3, undoManager.snapshots.length, 'Invalid snapshots count' );
					bender.assert.isInnerHtmlMatching( '<p>Hiffffffffffffffffffffddddd@</p>', undoManager.snapshots[ 2 ].contents );
				} );
			},

			'test undo command disable undo and enable redo ui button': function() {
				var initData = '<p>aaaaaaaaaaaaaaaaaaaaaaaaa</p>';

				this.editorBot.setData( initData, function() {
					var textNode = this.editor.editable().getFirst().getFirst();

					this._moveTextNodeRange( 25 );
					simulateHoldKey( 13, this.keyTools, 8 /*BACKSPACE*/, function() {
						removeLastCharFromTextNode( textNode );
					} );

					simulateCtrlZ( this.keyTools );
					assert.areEqual( initData, this.editor.getData(), 'Data should be same as initial one, because we just undo.' );

					simulateCtrlZ( this.keyTools );
					assert.areEqual( CKEDITOR.TRISTATE_DISABLED, this.editor.getCommand( 'undo' ).state, 'Undo should be disabled because we undo only change.' );
					assert.areEqual( CKEDITOR.TRISTATE_OFF, this.editor.getCommand( 'redo' ).state, 'Redo be enabled because we just uno.' );

					function simulateCtrlZ( keyTools ) {
						keyTools.singleKeyEvent( 17 /*CTRL*/, { type: 'keydown', ctrlKey: true } );
						keyTools.singleKeyEvent( 90 /*Z*/, { type: 'keydown', ctrlKey: true } );
						keyTools.singleKeyEvent( 17 /*CTRL*/, { type: 'keyup' } );
						keyTools.singleKeyEvent( 90 /*Z*/, { type: 'keyup' } );
					}
				} );
			},

			'test no snapshot on dummy backspace': function() {
				// Backspace which does not remove anything, shouln'd create snapshot.
				var undoCommand = this.editor.getCommand( 'undo' ),
					undoManager = this.editor.undoManager,
					// IE will send keypress for backspace, which is treated as "input" event.
					skipInputEvent = CKEDITOR.env.ie ? false : true;

				this._moveTextNodeRange( 0 );

				// Repeat it multiple time, so we'll ensure that snapshot will not be created
				// after exceeding the chars in snapshot limit.
				this.keyTools.keyEventMultiple( 30, keyCodesEnum.BACKSPACE, null, skipInputEvent );

				assert.areEqual( 1, undoManager.snapshots.length, 'Invalid snapshots count' );

				assert.areEqual( CKEDITOR.TRISTATE_DISABLED, undoCommand.state, 'Invalid undo command state after typing character' );
			},

			'test undoManager.isNavigationKey': function() {
				var naviKeys = [ 'HOME', 'END', 'RIGHT', 'LEFT', 'DOWN', 'UP', 'PAGEDOWN', 'PAGEUP' ],
					isNavigationKey = CKEDITOR.plugins.undo.UndoManager.isNavigationKey,
					curKey;

				for ( var i = 0; i < naviKeys.length; i++ ) {
					curKey = naviKeys[ i ];
					assert.isTrue( isNavigationKey( keyCodesEnum[ curKey ] ), 'Invalid result for ' + curKey );
				}

				assert.isFalse( isNavigationKey( keyCodesEnum.BACKSPACE ), 'Invalid result for Backspace' );
				assert.isFalse( isNavigationKey( keyCodesEnum.KEY_D ), 'Invalid result for D key' );
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
