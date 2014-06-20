/* bender-tags: editor,unit,undo */
/* bender-ckeditor-plugins: undo,basicstyles,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editor = {};

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
			if ( !this.tools )
				this.tools = undoEventDispatchTestsTools( this );

			this.undoManager = bender.editor.undoManager;
			// For each TC we want to reset undoManager.
			this.undoManager.reset();
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
				that._moveTextNodeRange( 3 );

				that.tools.mouse.click( textNode.getParent() );

				assert.areEqual( expectedSnapshots, undoManager.snapshots.length, 'Invalid snapshots count' );
				// Further clicks should not create more snapshots even if selection changed.
				that.tools.mouse.click( textNode.getParent() );
				that.tools.mouse.click( textNode.getParent(), function() {
					that._moveTextNodeRange( 5 );
				} );

				// No extra snapshot should be created but the last one range should be overwritten.
				assert.areEqual( expectedSnapshots, undoManager.snapshots.length, 'Snapshots count increased' );

				var interestingSnapshot = undoManager.snapshots[ expectedSnapshots - 1 ];
				assert.areEqual( 5, interestingSnapshot.bookmarks[ 0 ].startOffset, 'Invalid bookmark start offset' );
				assert.areEqual( 5, interestingSnapshot.bookmarks[ 0 ].endOffset, 'Invalid bookmark start offset' );
			} );
		},

		'test init snapshot overwrite': function() {
			var that = this;
			// We need to ensure that extra clicks will eventually override first snapshot selection.

			this.editor.setData( '<p>foo</p>', {
				// We don't want extra snapshot made by setData().
				noSnapshot: true,
				callback: function() {
					assert.areEqual( 1, that.editor.undoManager.snapshots.length, 'Invalid snapshots count' );
					that.tools.mouse.click( null, function() {
						that._moveTextNodeRange( 0 );
					} );

					that.tools.mouse.click( null, function() {
						that._moveTextNodeRange( 2 );
					} );

					resume( function() {
						var snapshots = that.editor.undoManager.snapshots,
							bookmark;

						assert.areEqual( 1, snapshots.length, 'Invalid snapshots count' );

						bookmark = snapshots[ 0 ].bookmarks[ 0 ];
						// Selection should be moved.
						assert.areEqual( 2, bookmark.startOffset, 'Invalid start offset' );
						assert.areEqual( 2, bookmark.endOffset, 'Invalid end offset' );
					} );
				}
			} );

			wait( 500 );
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
		}
	};

	bender.test( tcs );
} )();