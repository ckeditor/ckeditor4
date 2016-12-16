/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: undo,enterkey,horizontalrule,image,iframe,flash,basicstyles,toolbar,sourcearea */

var fillingCharSequence = CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE,
	fillingCharSequenceLength = fillingCharSequence.length,
	createFillingCharSequenceNode = CKEDITOR.dom.selection._createFillingCharSequenceNode;

function isActive( command ) {
	return command.state === CKEDITOR.TRISTATE_OFF;
}

bender.editor = {
	config: { autoParagraph: true },
	allowedForTests: 'p[id,dir]; div; em[id]'
};

bender.test( {
	doUndoCommand: function( input, cmd ) {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( input );
		bot.editor.resetUndo();
		bot.execCommand( cmd );
		this.wait( function() {
			bot.execCommand( 'undo' );

			var undo = bot.editor.getCommand( 'undo' );
			assert.isFalse( isActive( undo ) );

			var redo = bot.editor.getCommand( 'redo' );
			assert.isTrue( isActive( redo ) );

			var output = bender.tools.getHtmlWithSelection( bot.editor );
			output = bender.tools.compatHtml( bot.editor.dataProcessor.toDataFormat( output ) );

			assert.areSame( input, output );
		}, 0 );
	},

	doUndoDialog: function( input, dlgName, fn ) {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( input );
		bot.editor.resetUndo();
		this.wait( function() {
			bot.dialog( dlgName, function( dialog ) {
				fn.call( this, dialog );

				this.wait( function() {
					bot.execCommand( 'undo' );

					var undo = bot.editor.getCommand( 'undo' );
					assert.isFalse( isActive( undo ) );

					var redo = bot.editor.getCommand( 'redo' );
					assert.isTrue( isActive( redo ) );

					var output = bender.tools.getHtmlWithSelection( bot.editor );
					output = bender.tools.compatHtml( bot.editor.dataProcessor.toDataFormat( output ) );

					assert.areSame( input, output );
				}, 0 );
			} );

		}, 0 );
	},

	'test undoManager.updateSelection': function() {
		var editorBotConfig = {
				name: 'updateSelectionEditor',
				creator: 'inline',
				config: {}
			},
			isIe8 = CKEDITOR.env.ie && CKEDITOR.env.version == 8;

		// Test has its own editor, because we modify internals like snapshot array,
		// current image (directly) and change its initial content.
		bender.editorBot.create( editorBotConfig, function( bot ) {
			// We'll create 2 fixed images, and work with these fixtures.

			// Initial editor content is: "<p>__</p>"
			// and selection start/end offset is 1.
			bender.tools.selection.setWithHtml( bot.editor, '<p>_{}_</p>' );

			var editor = bot.editor,
				img1 = new CKEDITOR.plugins.undo.Image( editor ),
				img2 = new CKEDITOR.plugins.undo.Image( editor ),
				img2bookmark = img2.bookmarks[ 0 ],
				undoManager = editor.undoManager;

			undoManager.snapshots = [ img1 ];
			undoManager.currentImage = img1;

			// First - identical images, nothing should happen.
			undoManager.updateSelection( img2 );
			assert.areEqual( 1, undoManager.snapshots.length, 'Snapshots count should not change' );
			assert.areEqual( 1, undoManager.snapshots[ 0 ].bookmarks[ 0 ].startOffset, 'Invalid bookmark startOffset' );
			!isIe8 && assert.areEqual( 1, undoManager.snapshots[ 0 ].bookmarks[ 0 ].endOffset, 'Invalid bookmark endOffset' );

			// Reset snapshots array.
			undoManager.snapshots = [ img1 ];

			// Now - diffrent selection, same content.
			img2bookmark.startOffset = 2;
			img2bookmark.endOffset = 2;

			undoManager.updateSelection( img2 );
			assert.areEqual( 1, undoManager.snapshots.length, 'Snapshots count should not change' );
			assert.areEqual( 2, undoManager.snapshots[ 0 ].bookmarks[ 0 ].startOffset, 'Bookmark startOffset not updated' );
			!isIe8 && assert.areEqual( 2, undoManager.snapshots[ 0 ].bookmarks[ 0 ].endOffset, 'Bookmark endOffset not updated' );
			assert.areSame( undoManager.currentImage, img2, 'undoManager.currentImage not updated' );

			// Reset snapshots array.
			undoManager.snapshots = [ img1 ];

			// Now - same selection, diffrent content.
			img2bookmark.startOffset = 1;
			img2bookmark.endOffset = 1;
			img2.contents = '<p>____</p>';

			undoManager.updateSelection( img2 );
			assert.areEqual( 1, undoManager.snapshots.length, 'Snapshots should not change' );
			assert.areEqual( 1, undoManager.snapshots[ 0 ].bookmarks[ 0 ].startOffset, 'Invalid bookmark startOffset' );
			!isIe8 && assert.areEqual( 1, undoManager.snapshots[ 0 ].bookmarks[ 0 ].endOffset, 'Invalid bookmark endOffset' );

			// Ensure that it does not breaks when snapshots array is empty.
			undoManager.snapshots = [];
			undoManager.updateSelection( img2 );
		} );
	},

	// #10249
	'check initial command states': function() {
		var bot = this.editorBot,
			undo = bot.editor.getCommand( 'undo' ),
			redo = bot.editor.getCommand( 'redo' );

		assert.isFalse( isActive( undo ), 'Undo command disabled by default.' );
		assert.isFalse( isActive( redo ), 'Redo command disabled by default.' );

		bot.editor.setMode( 'source', function() {
			resume( function() {
				assert.isFalse( isActive( undo ), 'Undo command disabled when switching to source.' );
				assert.isFalse( isActive( redo ), 'Redo command disabled when switching to source.' );

				bot.editor.setMode( 'wysiwyg', function() {
					resume( function() {
						assert.isFalse( isActive( undo ), 'Undo command disabled when switching to wysiwyg.' );
						assert.isFalse( isActive( redo ), 'Redo command disabled when switching to wysiwyg.' );
					} );
				} );

				wait();
			} );
		} );

		wait();
	},

	// #10249
	'check command states on readOnly': function() {
		var bot = this.editorBot,
			undo = bot.editor.getCommand( 'undo' ),
			redo = bot.editor.getCommand( 'redo' );

		bot.editor.once( 'readOnly', function() {
			resume( function() {
				assert.isFalse( isActive( undo ), 'Undo command disabled when in read-only mode.' );
				assert.isFalse( isActive( redo ), 'Redo command disabled when in read-only mode.' );

				bot.editor.once( 'readOnly', function() {
					resume( function() {
						assert.isFalse( isActive( undo ), 'Undo command disabled when leaving read-only mode.' );
						assert.isFalse( isActive( redo ), 'Undo command disabled when leaving read-only mode.' );
					} );
				} );

				bot.editor.setReadOnly( false );
				wait();
			} );
		} );

		bot.editor.setReadOnly( true );
		wait();
	},

	// #7912
	'test undo enter key': function() {
		this.doUndoCommand( '<p>foo^bar</p>', 'enter' );
	},

	// #8299
	'test undo hr insertion': function() {
		this.doUndoCommand( '<p>foo^bar</p>', 'horizontalrule' );
	},

	'test lock/unlock undo manager': function() {
		var ed = this.editor,
			edt = ed.editable(),
			undo = ed.getCommand( 'undo' ),
			redo = ed.getCommand( 'redo' );

		ed.resetUndo();

		edt.setHtml( '<p>foo</p>' );

		ed.fire( 'lockSnapshot' );

		// Check undo manager is locked.
		var msg = 'check locked undo manager - ';
		assert.isFalse( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );

		ed.fire( 'saveSnapshot' );

		// Check undo manager is locked.
		msg = 'check locked undo manager (after save) - ';
		assert.isFalse( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );

		ed.fire( 'unlockSnapshot' );

		// Check undo manager is unlocked.

		msg = 'check unlocked undo manager';
		assert.isFalse( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );

		ed.fire( 'saveSnapshot' );
		msg = 'checked unlocked undo manager (2)';
		assert.isTrue( isActive( undo ), msg );
	},

	// #10131
	// Scenario:
	// * lock (+1)
	// * lock (+2)
	// * unlock (+1)
	// * lock (+2)
	// * unlock (+1)
	// * unlock (0)
	// * only after 3rd unlock snapshot is saved
	'test multiple lock/unlock undo manager': function() {
		var editor = this.editor,
			editable = editor.editable(),
			undo = editor.getCommand( 'undo' ),
			redo = editor.getCommand( 'redo' ),
			msg;

		editor.resetUndo();

		// Set content to be autoParagraphed.
		editable.setHtml( 'foo' );

		editor.fire( 'lockSnapshot' );

		msg = 'afer 1st lockSnapshot - ';
		assert.isFalse( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );

		editor.fire( 'lockSnapshot' );

		msg = 'afer 2nd lockSnapshot - ';
		assert.isFalse( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );

		editor.fire( 'unlockSnapshot' );
		editor.fire( 'saveSnapshot' );

		msg = 'afer 1st unlockSnapshot - ';
		assert.isFalse( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );

		editor.fire( 'lockSnapshot' );

		msg = 'afer 3rd lockSnapshot - ';
		assert.isFalse( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );

		editor.fire( 'unlockSnapshot' );
		editor.fire( 'saveSnapshot' );

		msg = 'afer 2nd unlockSnapshot - ';
		assert.isFalse( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );

		editor.fire( 'unlockSnapshot' );
		editor.fire( 'saveSnapshot' );

		msg = 'afer 3rd unlockSnapshot - ';
		assert.isTrue( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );
	},

	'test changes done before lock are correctly recorded': function() {
		var editor = this.editor,
			editable = editor.editable(),
			undo = editor.getCommand( 'undo' ),
			redo = editor.getCommand( 'redo' ),
			msg;

		this.editorBot.setHtmlWithSelection( '<p>foo^</p>' );

		editor.resetUndo();

		editable.setHtml( '<p>foo.a</p>' );

		editor.fire( 'lockSnapshot' );

		msg = 'afer lockSnapshot - ';
		assert.isFalse( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );

		editable.setHtml( '<p>foo.b</p>' );

		editor.fire( 'unlockSnapshot' );
		editor.fire( 'saveSnapshot' );

		msg = 'afer unlockSnapshot - ';
		assert.isTrue( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );

		editor.execCommand( 'undo' );

		assert.areSame( '<p>foo</p>', editor.getData(), 'after unlockSnapshot - data' );
	},

	// #10315
	'test filling char is not recorded': function() {
		var editor = this.editor,
			editable = editor.editable(),
			undo = editor.getCommand( 'undo' ),
			redo = editor.getCommand( 'redo' ),
			msg;

		editable.setHtml( '<p id="p">foo<em>bar</em></p>' );

		// <p>foo^<em>...
		var range = editor.createRange();
		range.setStart( editor.document.getById( 'p' ), 1 );
		editor.getSelection().selectRanges( [ range ] );

		editor.resetUndo();

		var initialHtml = editable.getHtml();

		// <p>^foo<em>...
		range.setStart( editor.document.getById( 'p' ), 0 );
		range.collapse( true );
		editor.getSelection().selectRanges( [ range ] );

		// Fire event imitating left arrow, what will trigger
		// removeFillingChar() on Webkit.
		editor.document.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37 } ) );

		// Check if test isn't outdated and really works.
		if ( CKEDITOR.env.webkit )
			assert.isTrue( initialHtml.length > editable.getHtml().length, 'Filling char has been removed' );

		editor.fire( 'saveSnapshot' );

		msg = 'afer saveSnapshot - ';
		assert.isFalse( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );
	},

	// #10315 Two scenarios:
	//
	// 1.
	// * sellection with filling char
	// * trigger filling char removal
	// * lock && unlock && save
	// * undo should be empty
	//
	// 2.
	// * selection without filling char
	// * trigger filling char addition
	// * lock && unlock && save
	// * undo should be empty
	'test filling char does not break lock/unlock': function() {
		var editor = this.editor,
			editable = editor.editable(),
			undo = editor.getCommand( 'undo' ),
			redo = editor.getCommand( 'redo' ),
			msg;

		editable.setHtml( '<p id="p">foo<em>bar</em></p>' );

		// <p>foo^<em>...
		var range = editor.createRange();
		range.setStart( editor.document.getById( 'p' ), 1 );
		editor.getSelection().selectRanges( [ range ] );

		editor.resetUndo();

		var initialHtml = editable.getHtml();

		// <p>^foo<em>...
		range.setStart( editor.document.getById( 'p' ), 0 );
		range.collapse( true );
		editor.getSelection().selectRanges( [ range ] );

		// Fire event imitating left arrow, what will trigger
		// removeFillingChar() on Webkit.
		editor.document.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37 } ) );

		// Check if test isn't outdated and really works.
		if ( CKEDITOR.env.webkit )
			assert.isTrue( initialHtml.length > editable.getHtml().length, 'Filling char has been removed' );

		editor.fire( 'lockSnapshot' );

		this.editorBot.setHtmlWithSelection( '<p>boo^</p>' );

		editor.fire( 'unlockSnapshot' );
		editor.fire( 'saveSnapshot' );

		msg = 'afer 1st unlockSnapshot - ';
		assert.isFalse( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );


		//
		// Reverse case - now create filling char.
		//

		this.editorBot.setHtmlWithSelection( '<p id="p">^FOO<em id="em">BAR</em></p>' );

		editor.resetUndo();
		initialHtml = editable.getHtml();

		range = editor.createRange();

		// <p>FOO^<em>BAR</em></p>
		range.setStartAt( editor.document.getById( 'em' ), CKEDITOR.POSITION_BEFORE_START );
		range.collapse( true );
		editor.getSelection().selectRanges( [ range ] );

		// Check if test isn't outdated.
		if ( CKEDITOR.env.webkit )
			assert.isTrue( initialHtml.length < editable.getHtml().length, 'Filling char has been added' );

		editor.fire( 'lockSnapshot' );

		this.editorBot.setHtmlWithSelection( '<p>BOO^</p>' );

		editor.fire( 'unlockSnapshot' );
		editor.fire( 'saveSnapshot' );

		msg = 'afer 2nd unlockSnapshot - ';
		assert.isFalse( isActive( undo ), msg + 'undoable' );
		assert.isFalse( isActive( redo ), msg + 'redoable' );
	},

	// #13816
	'test selection is restored despite filling char': function() {
		// This TC fails on IE8 because it uses old IE selection implementation, which uses original (intrusive)
		// bookmark implementation and it messes up the TC.
		if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 8 ) {
			assert.ignore();
		}

		var editor = this.editor,
			editable = editor.editable(),
			undo = editor.getCommand( 'undo' ),
			range;

		editor.focus();

		// Set testing content with selection.
		editable.setHtml( '<p id="p1"><i class="fcs"></i><em>def</em></p>' );

		var fillingChar = createFillingCharSequenceNode( editable );
		fillingChar.setText( fillingChar.getText() + 'abc' );
		fillingChar.replace( editable.findOne( '.fcs' ) );

		// Selection: <p>FCSa[bc<em>de]f</em></p>
		range = editor.createRange();
		range.setStart( editor.document.getById( 'p1' ).getFirst(), fillingCharSequenceLength + 1 );
		range.setEnd( editor.document.getById( 'p1' ).getLast().getFirst(), 2 );
		range.select();

		// Record testing content and the selection.
		editor.resetUndo();

		// Set some other content and record a snapshot.
		editable.setHtml( '<p>foo</p>' );
		editor.fire( 'saveSnapshot' );

		// Check if undo is available.
		assert.isTrue( isActive( undo ), 'Undo enabled.' );
		assert.areSame( 2, editor.undoManager.snapshots.length, 'Number of snapshots recorded.' );
		assert.isInnerHtmlMatching( '<p id="p1">abc<em>def</em>@</p>', editor.undoManager.snapshots[ 0 ].contents, 'Snapshot does not contain FCSeq.' );

		// Go back to the testing content.
		editor.execCommand( 'undo' );

		// Check if testing content has been correctly restored.
		assert.isInnerHtmlMatching( '<p id="p1">abc<em>def</em>@</p>', editable.getHtml(), 'Snapshot restored without FCSeq.' );

		// Check if testing selection has been correctly reverted.
		range = editor.getSelection().getRanges()[ 0 ];

		assert.isTrue( range.startContainer.equals( editor.document.getById( 'p1' ).getFirst() ), 'Range starts in the right text node.' );
		assert.isTrue( range.endContainer.equals( editor.document.getById( 'p1' ).findOne( 'em' ).getFirst() ), 'Range ends in the right text node.' );

		// Selection remains as: <p>a[bc<em>de]f</em></p>
		assert.areSame( 1, range.startOffset, 'Start offset does not include FCSeq.' );
		assert.areSame( 2, range.endOffset, 'End offset does not include FCSeq.' );
	},

	'test lock&unlock after selection change': function() {
		var editor = this.editor,
			editable = editor.editable(),
			undo = editor.getCommand( 'undo' ),
			range;

		editable.setHtml( '<p id="p1">foo</p>' );
		editor.focus();

		// <p>^foo</p>...
		range = editor.createRange();
		range.setStart( editor.document.getById( 'p1' ), 0 );
		range.collapse( true );
		range.select();

		editor.resetUndo();

		// <p>foo^</p>...
		range.setStartAt( editor.document.getById( 'p1' ), CKEDITOR.POSITION_BEFORE_END );
		range.collapse( true );
		range.select();

		// Something (mistakenly) fires saveSnapshot...
		editor.fire( 'saveSnapshot' );
		assert.isFalse( isActive( undo ), 'after selection change' );

		// Something does DOM changes which should not be recorded...
		editor.fire( 'lockSnapshot' );
		editable.findOne( '#p1' ).setAttribute( 'data-x', 'y' );
		editor.fire( 'unlockSnapshot' );

		assert.isFalse( isActive( undo ), 'after lock&unlock snapshot' );

		// Move selection back to #p1 start. Selection change is ONLY needed to
		// refresh commands, because snapshots stack is already broken at this point.
		// <p>^foo</p>...
		range = editor.createRange();
		range.setStart( editor.document.getById( 'p1' ), 0 );
		range.collapse( true );
		range.select();

		editor.fire( 'saveSnapshot' );

		assert.isFalse( isActive( undo ), 'after 2nd selection change' );
	},

	'test lock&unlock after content change': function() {
		var editor = this.editor,
			editable = editor.editable();

		editable.setHtml( '<p id="p1">foo<br>bar<span id="s1">x</span></p>' );
		editor.focus();
		editor.fire( 'saveSnapshot' );

		// Fake selection to lock a selection anchored in p1 (which we're going to modify).
		editor.getSelection().fake( editor.document.getById( 's1' ) );

		// Modify DOM so the cached fake selection will not be correct.
		var elP = editor.document.getById( 'p1' );
		elP.getFirst().remove();
		elP.getFirst().remove();

		try {
			editor.fire( 'lockSnapshot' );
			assert.isTrue( true );
		} catch ( e ) {
			throw e;
		} finally {
			// Reset selection and undo manager even if tests failed.
			editor.getSelection().reset();
			editor.resetUndo();
		}

	},

	'test lock with dontUpdate option': function() {
		var editor = this.editor,
			editable = editor.editable();

		// Focus the editor to insert the Filling Char Sequence during this test
		// and make assertions more reliable. Otherwise, if ran separately, this test
		// would not stress FCSeq system.
		editor.focus();

		editable.setHtml( '<p>foo</p>' );
		editor.resetUndo();

		assert.areSame( 1, editor.undoManager.snapshots.length, 'one snapshot at the beginning' );

		editor.fire( 'lockSnapshot', { dontUpdate: 1 } );
		editor.fire( 'saveSnapshot' );
		assert.areSame( 1, editor.undoManager.snapshots.length, 'one snapshot after lock+save' );

		editable.setHtml( '<p>foo</p><p>bar</p>' );
		editor.fire( 'saveSnapshot' );
		assert.areSame( 1, editor.undoManager.snapshots.length, 'one snapshot after lock+change+save' );

		editor.fire( 'unlockSnapshot' );
		assert.areSame( 1, editor.undoManager.snapshots.length, 'one snapshot after unlock' );

		editor.fire( 'saveSnapshot' );
		assert.areSame( 2, editor.undoManager.snapshots.length, 'two snapshots after unlock+save' );

		editor.execCommand( 'undo' );
		assert.areSame( '<p>foo</p>', editor.getData() );

		editor.execCommand( 'redo' );
		assert.areSame( '<p>foo</p><p>bar</p>', editor.getData() );
	},

	'test lock with dontUpdate cannot be overriden by normal lock': function() {
		var editor = this.editor,
			editable = editor.editable();

		// Focus the editor to insert the Filling Char Sequence during this test
		// and make assertions more reliable. Otherwise, if ran separately, this test
		// would not stress FCSeq system.
		editor.focus();

		editable.setHtml( '<p>foo</p>' );
		editor.resetUndo();

		editor.fire( 'lockSnapshot', { dontUpdate: 1 } );

		editable.setHtml( '<p>foo</p><p>bar</p>' );

		editor.fire( 'lockSnapshot' );
		editor.fire( 'saveSnapshot' );
		assert.areSame( 1, editor.undoManager.snapshots.length, 'one snapshot after 2nd lock' );

		editor.fire( 'unlockSnapshot' );
		editor.fire( 'saveSnapshot' );
		assert.areSame( 1, editor.undoManager.snapshots.length, 'one snapshot after unlocking 2nd lock' );

		editor.fire( 'unlockSnapshot' );
		assert.areSame( 1, editor.undoManager.snapshots.length, 'one snapshot after unlocking undo manager completely' );

		editor.fire( 'saveSnapshot' );
		assert.areSame( 2, editor.undoManager.snapshots.length, 'two snapshots after unlock+save' );

		editor.execCommand( 'undo' );
		assert.areSame( '<p>foo</p>', editor.getData() );

		editor.execCommand( 'redo' );
		assert.areSame( '<p>foo</p><p>bar</p>', editor.getData() );
	},

	'test lock with forceUpdate option': function() {
		var editor = this.editor,
			editable = editor.editable();

		editable.setHtml( '<p>foo1</p>' );
		editor.resetUndo();

		// Make undo manager outdated.
		editable.setHtml( '<p>foo2</p>' );

		editor.fire( 'lockSnapshot', { forceUpdate: 1 } );
		editable.setHtml( '<p>foo3</p>' );

		editor.fire( 'unlockSnapshot' );
		editor.fire( 'saveSnapshot' );

		assert.areSame( 1, editor.undoManager.snapshots.length, 'only one snapshot after unlock and save' );

		// Pass latest snapshot through getData to clean it.
		editable.setHtml( editor.undoManager.snapshots[ 0 ].contents );
		assert.areSame( '<p>foo3</p>', editor.getData(), 'snapshot contains latest content' );
	},

	'test locking when not in WYSIWYG mode with forceUpdate option': function() {
		var editor = this.editor;

		editor.editable().setHtml( '<p>foo1</p>' );
		editor.resetUndo();

		editor.setMode( 'source', function() {
			// Make undo manager outdated.
			editor.editable().setValue( '<p>foo2</p>' );

			editor.fire( 'lockSnapshot', { forceUpdate: 1 } );
			editor.editable().setValue( '<p>foo3</p>' );

			editor.setMode( 'wysiwyg', function() {
				resume( function() {
					editor.fire( 'unlockSnapshot' );
					editor.fire( 'saveSnapshot' );

					assert.areSame( 1, editor.undoManager.snapshots.length, 'only one snapshot after unlock and save' );

					// Pass latest snapshot through getData to clean it.
					editor.editable().setHtml( editor.undoManager.snapshots[ 0 ].contents );
					assert.areSame( '<p>foo3</p>', editor.getData(), 'snapshot contains latest content' );
				} );
			} );
		} );

		wait();
	},

	// #9230
	'test automatic DOM changes handling': function() {
		var bot = this.editorBot,
			editor = bot.editor,
			root = editor.editable(),
			ranges, listener, sel,
			undo = editor.getCommand( 'undo' ),
			redo = editor.getCommand( 'redo' );

		// Prevent things happen on selectionChange.
		listener = editor.on( 'selectionChange', function( evt ) {
			evt.cancel();
		}, null, null, 1 );

		ranges = bender.tools.setHtmlWithRange( root, 'ab^c', root );
		sel = editor.getSelection();

		sel.selectRanges( ranges );

		var firstElement = sel.getStartElement(),
			currentPath = new CKEDITOR.dom.elementPath( firstElement, editor.editable() );

		// Reset undo when content of the editor equals 'abc'.
		editor.resetUndo();
		// Remove blocker.
		listener.removeListener();

		// Raw data, because editor autoPs data retrieved by getData.
		assert.areEqual( 'abc', root.getHtml(), 'Initial data is correct' );

		// Manually fire selectionChange so autoParagraphing is executed.
		editor.fire( 'selectionChange', { selection: sel, path: currentPath, element: firstElement } );

		assert.isMatching( /<p>abc(<br>)?<\/p>/i, root.getHtml(), 'Auto paragraphing executed correctly' );
		assert.isFalse( isActive( undo ), 'Auto paragraphing hasn\'t created undo snapshot' );

		bot.execCommand( 'enter' );

		wait( function() {
			assert.areEqual( '<p>ab</p><p>c</p>', bot.getData(), 'Enter command executed correctly' );
			assert.isTrue( isActive( undo ), 'Enter command created undo snapshot' );

			bot.execCommand( 'undo' );

			assert.isMatching( /<p>abc(<br>)?<\/p>/i, root.getHtml(), 'Undid enter command correctly' );
			assert.isFalse( isActive( undo ), 'No more undo snapshots avaiable' );
			assert.isTrue( isActive( redo ), 'Redo snapshot available' );

			bot.execCommand( 'redo' );

			assert.areEqual( '<p>ab</p><p>c</p>', bot.getData(), 'Enter command redone correctly' );
		}, 0 );
	},

	'test multiple undo/redo': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p>fo[ob]ar</p>' );
		bot.editor.resetUndo();
		bot.execCommand( 'bold' );
		bot.execCommand( 'bold' );
		bot.execCommand( 'bold' );
		this.wait( function() {
			var undo = bot.editor.getCommand( 'undo' );
			var redo = bot.editor.getCommand( 'redo' );

			assert.areSame( CKEDITOR.TRISTATE_OFF, undo.state, 'before 1st undo' );
			bot.execCommand( 'undo' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, undo.state, 'after 1st undo' );
			bot.execCommand( 'undo' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, undo.state, 'after 2nd undo' );
			bot.execCommand( 'undo' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, undo.state, 'after 3rd undo' );

			var output = bender.tools.getHtmlWithSelection( bot.editor );
			output = bender.tools.compatHtml( bot.editor.dataProcessor.toDataFormat( output ) );
			assert.areSame( '<p>fo[ob]ar</p>', output );

			assert.areSame( CKEDITOR.TRISTATE_OFF, redo.state, 'before 1st redo' );
			bot.execCommand( 'redo' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, redo.state, 'after 1st redo' );
			bot.execCommand( 'redo' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, redo.state, 'after 2nd redo' );
			bot.execCommand( 'redo' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'after 3rd redo' );

			output = bender.tools.getHtmlWithSelection( bot.editor );
			output = bender.tools.compatHtml( bot.editor.dataProcessor.toDataFormat( output ) );
			assert.isMatching( /^<p>fo\[?<strong>\[?ob\]?<\/strong>\]?ar<\/p>$/, output );
		}, 0 );
	},

	// #8258
	'test undo image insertion (dialog)': function() {
		this.doUndoDialog( '<p>foo^bar</p>', 'image', function( dialog ) {
			dialog.setValueOf( 'info', 'txtUrl', '../../_assets/logo.png' );
			dialog.getButton( 'ok' ).click();
		} ) ;
	},

	// #8258
	'test undo iframe insertion (dialog)': function() {
		this.doUndoDialog( '<p>foo^bar</p>', 'iframe', function( dialog ) {
			dialog.setValueOf( 'info', 'src', 'about:blank' );
			dialog.getButton( 'ok' ).click();
		} ) ;
	},

	// #8258
	'test undo flash insertion (dialog)': function() {
		this.doUndoDialog( '<p>foo^bar</p>', 'flash', function( dialog ) {
			dialog.setValueOf( 'info', 'src', '../../_assets/sample.swf' );
			dialog.getButton( 'ok' ).click();
		} ) ;
	},

	// #12597
	'test no beforeUndoImage event fire while composition': function() {
		var bot = this.editorBot,
			editor = bot.editor,
			calls = 0;

		bot.editor.on( 'beforeUndoImage', function() {
			calls++;
		} );

		var evt = new CKEDITOR.dom.event( { keyCode: 229 } );
		editor.editable().fire( 'keydown', evt );

		assert.areSame( 0, calls, 'There should be no calls' );
	},

	'test undo with "control" type selection in IE': function() {
		if ( !CKEDITOR.env.ie || ( document.documentMode || CKEDITOR.env.version ) > 8 )
			assert.ignore();

		var bot = this.editorBot;

		// Make a "control" type selection.
		// Wrapped with div so selection's bookmarks won't cause autoparagraphing.
		bot.setHtmlWithSelection( '<div>[<p dir="rtl">foo</p>]<p dir="rtl" id="target">bar</p></div>' );
		bot.editor.resetUndo();

		bot.execCommand( 'indent' );
		bot.execCommand( 'undo' );

		var output = bender.tools.getHtmlWithSelection( bot.editor );
		var result = '<div>[<p dir="rtl">foo]</p><p dir="rtl" id="target">bar</p></div>';

		assert.areSame( result, bender.tools.fixHtml( output ) );
	},

	'test CTRL+Z/Y/SHIFT+Z default actions are blocked in wysiwyg mode': function() {
		var bot = this.editorBot,
			prevented = 0,
			editable = bot.editor.editable();

		bot.setHtmlWithSelection( '<p>^foo</p>' );
		bot.editor.resetUndo();

		fireKeydown( CKEDITOR.CTRL + 90 );
		assert.areSame( 1, prevented, 'CTRL+Z was prevented' );

		fireKeydown( CKEDITOR.CTRL + 89 );
		assert.areSame( 2, prevented, 'CTRL+Y was prevented' );

		fireKeydown( CKEDITOR.CTRL + CKEDITOR.SHIFT + 90 );
		assert.areSame( 3, prevented, 'CTRL+SHIFT+Z was prevented' );

		function preventDefault() {
			prevented += 1;
		}

		function fireKeydown( keyCode ) {
			var evt = new CKEDITOR.dom.event( { keyCode: keyCode } );
			evt.preventDefault = preventDefault;
			editable.fire( 'keydown', evt );
		}
	},

	'test CTRL+Z/Y/SHIFT+Z default actions are not blocked in source mode': function() {
		var bot = this.editorBot;

		bot.editor.setMode( 'source', function() {
			var prevented = 0,
				editable = bot.editor.editable();

			bot.editor.resetUndo();

			fireKeydown( CKEDITOR.CTRL + 90 );
			fireKeydown( CKEDITOR.CTRL + 89 );
			fireKeydown( CKEDITOR.CTRL + CKEDITOR.SHIFT + 90 );

			bot.editor.setMode( 'wysiwyg', function() {
				resume( function() {
					assert.areSame( 0, prevented, 'None of the keystrokes was prevented' );
				} );
			} );

			function preventDefault() {
				prevented += 1;
			}

			function fireKeydown( keyCode ) {
				var evt = new CKEDITOR.dom.event( { keyCode: keyCode } );
				evt.preventDefault = preventDefault;
				editable.fire( 'keydown', evt );
			}
		} );

		wait();
	}
} );
