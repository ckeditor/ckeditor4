/* bender-tags: editor,undo */
/* bender-ckeditor-plugins: undo,basicstyles,toolbar,wysiwygarea */
/* global undoEventDispatchTestsTools */

( function() {
	'use strict';

	bender.editor = {};

	var tcs = {
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
			if ( !this.tools )
				this.tools = undoEventDispatchTestsTools( this );

			this.undoManager = this.editor.undoManager;
			// For each TC we want to reset undoManager.
			this.editor.resetUndo();
		},

		_should: {
			ignore: {
				// IE doesn't fire input event for editable.
				'test no snapshot after drop': CKEDITOR.env.ie
			}
		},

		'test snapshot on click': function() {
			var undoManager = this.undoManager,
				that = this;

			this.editorBot.setData( '<p>foo bar</p>', function() {
				var editable = that.editor.editable(),
					textNode = editable.getFirst().getFirst(),
					expectedSnapshots = 3;

				// We need to aply content modification.
				textNode.setText( 'foo Dbar' );
				// Initis with: foo^ Dbar
				that._moveTextNodeRange( 5 );

				that.tools.mouse.click( textNode.getParent() );

				assert.areEqual( expectedSnapshots, undoManager.snapshots.length, 'Invalid snapshots count' );
				// Further clicks should not create more snapshots even if selection changed.
				that.tools.mouse.click( textNode.getParent() );
				that.tools.mouse.click( textNode.getParent(), function() {
					that._moveTextNodeRange( 3 );
				} );

				// No extra snapshot should be created but the last one range should be overwritten.
				assert.areEqual( expectedSnapshots, undoManager.snapshots.length, 'Snapshots count increased' );

				var interestingSnapshot = undoManager.snapshots[ expectedSnapshots - 1 ];
				assert.areEqual( 3, interestingSnapshot.bookmarks[ 0 ].startOffset, 'Invalid bookmark start offset' );

				if ( !this.isIe8 ) {
					assert.areEqual( 3, interestingSnapshot.bookmarks[ 0 ].endOffset, 'Invalid bookmark end offset' );
				}
			} );
		},

		'test init snapshot overwrite': function() {
			var that = this;
			// We need to ensure that extra clicks will eventually override first snapshot selection.
			this.editor.setData( '<p>foo</p>', {
				// We don't want extra snapshot made by setData().
				noSnapshot: true,
				callback: function() {
					resume( function() {
						// There should be one snapshot at the begining, because of noSnapshot.
						assert.areEqual( 1, that.editor.undoManager.snapshots.length, 'Invalid snapshots count' );

						// This will make initial snapshot.
						that.tools.mouse.click( null, function() {
							that._moveTextNodeRange( 3 );
						} );

						// Now lets modify selection position.
						that.tools.mouse.click( null, function() {
							that._moveTextNodeRange( 2 );
						} );

						var snapshots = that.editor.undoManager.snapshots,
							bookmark;

						assert.areEqual( 2, snapshots.length, 'Invalid snapshots count' );

						bookmark = snapshots[ 1 ].bookmarks[ 0 ];
						// Selection should be moved.
						assert.areEqual( 2, bookmark.startOffset, 'Invalid start offset' );

						if ( !this.isIe8 ) {
							// Once again IE8 would put endOffset to 0.
							assert.areEqual( 2, bookmark.endOffset, 'Invalid end offset' );
						}
					} );
				}
			} );

			wait();
		},

		'test no change event on click': function() {
			var that = this;
			// We need to ensure that no change event is called when click snapshot is created
			// (because nothing changed).
			this.editorBot.setData( '<p>foo bar</p>', function() {
				var editable = that.editor.editable(),
					textNode = editable.getFirst().getFirst(),
					changesCount = 0;

				// We need to aply content modification.
				textNode.setText( 'foo Dbar' );
				that._moveTextNodeRange( 3 );

				that.editor.once( 'change', function() {
					changesCount++;
				} );

				that.tools.mouse.click( textNode.getParent() );
				assert.areEqual( 0, changesCount, 'Change event fired' );
			} );
		},

		'test no snapshot after drop': function() {
			// We should not create a drop snapshot, within the undo plugin. It's a job for dedicated DnD plugin.
			this.editorBot.setData( '<p>foo bar</p>', function() {
				var undoManager = this.editor.undoManager,
					typeCalledTimes = 0,
					originalType = undoManager.type;

				undoManager.type = function( keyCode ) {
					typeCalledTimes++;
					return originalType.call( undoManager, keyCode );
				};

				// Fire minimal set of drop events.
				this.tools.event.editableEvent( 'dragenter' );
				this.tools.event.editableEvent( 'dragover' );
				this.tools.event.editableEvent( 'drop' );
				this.tools.event.editableEvent( 'input' );

				// So input event occured, now lets fire some random key, like F4.
				// Note taht F4 should not produce input event (it does only in FF wehere it's a bug).
				this.tools.key.keyEvent( this.tools.key.keyCodesEnum.F4, {}, true );
				assert.areEqual( 0, typeCalledTimes, 'undoManager.type should not be called' );

				// Press printable key and ensure that it will be handled.
				this.tools.key.keyEvent( this.tools.key.keyCodesEnum.KEY_D );
				assert.areEqual( 1, typeCalledTimes, 'undoManager.type should be called' );

				// Restore original function.
				undoManager.type = originalType;
			} );
		}
	};

	bender.test( tcs );
} )();
