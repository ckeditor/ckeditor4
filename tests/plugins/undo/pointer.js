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

		/**
		 * Fires mousedown/up, click events on editor editable. This function might be
		 * moved to tools.
		 *
		 * @param CKEDITOR.dom.element target Clicked element.
		 */
		_fireEditableClickEvent: function( target ) {
			var domEventMockup = {
				target: target.$
			};
			this.tools.events.editableEvent( 'mousedown', domEventMockup );
			this.tools.events.editableEvent( 'mouseup', domEventMockup );
			this.tools.events.editableEvent( 'click', domEventMockup );
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
				//debugger;
				var editable = bender.editor.editable(),
					textNode = editable.getFirst().getFirst(),
					expectedSnapshots = 3;

				// We need to aply content modification.
				textNode.setText( 'foo Dbar' );
				// Initis with: foo^ Dbar
				that._moveTextNodeRange( 3 );

				that._fireEditableClickEvent( editable, textNode.getParent() );
				assert.areEqual( expectedSnapshots, undoManager.snapshots.length, 'Invalid snapshots count' );
				// Further clicks should not create more snapshots even if selection changed.
				that._fireEditableClickEvent( editable, textNode.getParent() );
				that._moveTextNodeRange( 5 );
				that._fireEditableClickEvent( editable, textNode.getParent() );

				assert.areEqual( expectedSnapshots, undoManager.snapshots.length, 'Snapshots count increased' );
				// Ensure that snapshot range is correct.
				var interestingSnapshot = undoManager.snapshots[ expectedSnapshots - 1 ];
				assert.areEqual( 3, interestingSnapshot.bookmarks[ 0 ].startOffset, 'Invalid bookmark start offset' );
				assert.areEqual( 3, interestingSnapshot.bookmarks[ 0 ].endOffset, 'Invalid bookmark start offset' );
			} );
		},

		'test no change event on click': function() {
			var that = this;
			// We need to ensure that no change event is called when click snapshot is created
			// (because nothing changed).
			this.editorBot.setData( '<p>foo bar</p>', function() {
				var editable = bender.editor.editable(),
					textNode = editable.getFirst().getFirst(),
					changesCount = 0;

				// We need to aply content modification.
				textNode.setText( 'foo Dbar' );
				that._moveTextNodeRange( 3 );

				bender.editor.once( 'change', function() {
					changesCount++;
				} );

				that._fireEditableClickEvent( editable, textNode.getParent() );
				assert.areEqual( 0, changesCount, 'Change event fired' );
			} );
		}
	};

	bender.test( tcs );
} )();