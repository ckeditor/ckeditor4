/* bender-tags: editor,unit */
/* global testSelection, testSelectedElement, testSelectedText, testStartElement, rangy, doc, makeSelection,
	convertRange, checkRangeEqual, checkSelection, assertSelectionsAreEqual, tools */

bender.editor = {
	config: {
		allowedContent: true
	}
};

var htmlComparisonOpts = {
	compareSelection: true,
	normalizeSelection: true
};

var isElement = CKEDITOR.dom.walker.nodeType( CKEDITOR.NODE_ELEMENT );

bender.test( {
	'test contructor': function() {
		// Make the DOM selection at the beginning of the document.
		var newRange = new CKEDITOR.dom.range( doc );
		newRange.moveToPosition( doc.getBody(), CKEDITOR.POSITION_AFTER_START );
		var domSel = rangy.getSelection();
		domSel.removeAllRanges();
		domSel.addRange( convertRange( newRange ) );

		// create new selection scoped in the entire document .
		var sel1 = new CKEDITOR.dom.selection( doc );
		assert.isFalse( !!sel1.isLocked, 'selection.isLock' );
		assert.areSame( doc.$, sel1.document.$, 'selection.document' );
		assert.areSame( doc.getBody().$, sel1.root.$, 'selection.root' );
		assert.isTypeOf( 'number', sel1.rev, 'selection.rev' );


		// create new selection scoped in the editable element.
		var editable = doc.getById( 'sandbox' );

		var sel2 = new CKEDITOR.dom.selection( editable );
		assert.isFalse( !!sel2.isLocked, 'selection.isLock' );
		assert.areSame( sel2.document.$, doc.$, 'selection.document' );
		assert.areSame( sel2.root.$, editable.$, 'selection.root' );
		assert.isTrue( sel2.rev > sel1.rev, 'sel2\'s revision is greater than sel1\'s' );

		// Check the selection fields should be empty.
		assert.areSame( CKEDITOR.SELECTION_NONE, sel2.getType(), 'selection.getType()' );
		assert.areSame( null, sel2.getStartElement(), 'selection.getStartElement()' );
		assert.areSame( null, sel2.getSelectedElement(), 'selection.getSelectedElement()' );
		assert.areSame( '', sel2.getSelectedText(), 'selection.getSelectedText()' );
		assert.areSame( 0, sel2.getRanges().length, 'selection.getRanges()' );
	},

	'test getSelection': function() {
		var sel = doc.getSelection();
		assert.isFalse( !!sel.isLocked, 'selection.isLock' );
		assert.areSame( sel.document.$, doc.$, 'selection.document' );
		assert.areSame( sel.root.$, doc.getBody().$, 'selection.boundary' );
	},

	// Test getRanges/setRanges with various selection source.
	'test ranges manipulation': function() {
		// Text selection.
		testSelection( '<div>[foo]</div>' );
		testSelection( '<p><strong>[foo</strong>]bar</p>' );
		testSelection( '<p><strong>foo[</strong>bar]</p>' );

		// Collapsed selection
		testSelection( '<div>fo^o</div>' );
		testSelection( '<div>foo^</div>' );
		testSelection( '<div>^foo</div>' );
		testSelection( '<p><strong>foo</strong>^bar</p>' );
		testSelection( '<p><strong>foo^</strong>bar</p>' );
		testSelection( '<p><strong>^foo</strong>bar</p>' );
		testSelection( '<p>^<strong>foo</strong>bar</p>' );

		// Collapsed selection inside of empty inline is not testable.
		testSelection( '<p><b><i>^</i></b></p>' );
		testSelection( '<p>foo<b><i>^</i></b></p>' );

		testSelection( '<p><br />^bar</p>' );
		testSelection( '<p>foo<br />^bar</p>' );
		testSelection( '<ul><li>bullet line 1</li><li>bullet line 2</li></ul>^second line' );

		// Element selection.
		testSelection( '<p>[<img />]</p>' );
		testSelection( '<p>[<input />]</p>' );

		// Entire block selection (FF only).
		if ( CKEDITOR.env.gecko ) {
			testSelection( '[<p style="float:left">foo</p>]' );
			testSelection( '<div>[<p>foo</p>]</div>' );
			testSelection( '<div>[<p>foo</p><p>bar</p>]</div>' );
			testSelection( '<div>[<h1>foo</h1>]</div>' );
			testSelection( '<div>[<pre>foo</pre>]</div>' );
		}

		// Table selection.
		testSelection( '<div><table><tr><td>[foo</td><td>bar]</td></tr></table></div>' );
		testSelection( '<div><table><tr><td>[foo</td></tr><tr><td>bar]</td></tr></table></div>' );

		// Multiple selection (FF only)
		if ( CKEDITOR.env.gecko ) {
			testSelection( '<div><table><tr><td>[foo]</td><td>[bar]</td></tr></table></div>' );
			testSelection( '<div><table><tr><td>[foo]</td></tr><tr><td>[bar]</td></tr></table></div>' );
		}
	},

	'test selectRanges - range containing table cell': function() {
		var editor = this.editor,
			range = bender.tools.range.setWithHtml( editor.editable(), '<table><tr><td>x</td>[<td>foo</td>]<td>x</td></tr></table>' );

		editor.getSelection().selectRanges( [ range ] );

		assert.areSame( 'foo', CKEDITOR.tools.trim( editor.getSelection().getSelectedText() ) );
	},

	'test selectRanges - range containing empty table cell': function() {
		var editor = this.editor,
			data = '<table><tbody><tr><td>x</td><td id="cell"></td><td>x</td></tr></tbody></table>';

		this.editorBot.setData( data, function() {
			var range = editor.createRange(),
				cell = editor.document.getById( 'cell' );

			range.setStartAt( cell, CKEDITOR.POSITION_BEFORE_START );
			range.setEndAt( cell, CKEDITOR.POSITION_AFTER_END );

			editor.getSelection().selectRanges( [ range ] );

			var sel = editor.getSelection();

			// IE8 && Webkit (precisely - excluding Blink) can't select cell from outside.
			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) || CKEDITOR.env.safari ) {
				var selected = sel.getStartElement();
				assert.isTrue( cell.equals( selected ) || cell.contains( selected ), 'selection is inside the cell' );
			} else {
				assert.areSame( cell, sel.getSelectedElement(), 'cell is selected' );
			}

			// I saw some strange span being left by IE8. Let's check data to be safe.
			assert.areSame( data, editor.getData().replace( /&nbsp;|\u00a0/, '' ), 'data is ok' );
		} );
	},

	'test selectRanges - in empty block': function() {
		if ( !CKEDITOR.env.needsBrFiller )
			assert.ignore();

		var editor = this.editor,
			range = editor.createRange();

		editor.editable().setHtml( '<p>foo</p><p id="target"><br /></p><p>bar</p>' );

		var p = editor.document.getById( 'target' );
		range.moveToPosition( p, CKEDITOR.POSITION_AFTER_START );

		editor.getSelection().selectRanges( [ range ] );

		assert.isInnerHtmlMatching(
			'<p>foo</p><p id="target">^<br /></p><p>bar</p>',
			bender.tools.selection.getWithHtml( editor ),
			htmlComparisonOpts,
			'selection was placed in the empty paragraph' );
	},

	'test selectRanges - after empty inline element': function() {
		// IE8 can't handle this selection.
		if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
			assert.ignore();
		}

		var editor = this.editor,
			range = editor.createRange();

		editor.editable().setHtml( '<p>foo<strong id="target"></strong></p>' );

		var strong = editor.document.getById( 'target' );
		range.moveToPosition( strong, CKEDITOR.POSITION_AFTER_END );
		editor.getSelection().selectRanges( [ range ] );

		assert.areSame( strong, editor.getSelection().getRanges()[ 0 ].getPreviousNode( isElement ),
			'the selection was located after the strong element' );
	},

	'test selectRanges - after empty inline element with the filler char': function() {
		// IE8 can't handle this selection.
		if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
			assert.ignore();
		}

		var editor = this.editor,
			range = editor.createRange();

		editor.editable().setHtml( '<p>foo<strong id="target"></strong></p>' );

		// Set the selection inside the strong element, so the filler char is created.
		var strong = editor.document.getById( 'target' );
		range.moveToPosition( strong, CKEDITOR.POSITION_AFTER_START );
		editor.getSelection().selectRanges( [ range ] );

		assert.areSame( 'strong', editor.getSelection().getStartElement().getName(),
			'the selection was correctly placed inside empty strong element' );

		range.moveToPosition( strong, CKEDITOR.POSITION_AFTER_END );
		editor.getSelection().selectRanges( [ range ] );

		assert.areSame( strong, editor.getSelection().getRanges()[ 0 ].getPreviousNode( isElement ),
			'the selection was located after the strong element' );
	},

	'test selectRanges - after empty inline element with an empty text node': function() {
		// IE8 can't handle this selection.
		if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
			assert.ignore();
		}

		var editor = this.editor,
			range = editor.createRange();

		editor.editable().setHtml( '<p>foo<strong id="target">x</strong></p>' );

		// Set the selection inside the strong element, so the filler char is created.
		var strong = editor.document.getById( 'target' );
		strong.getFirst().setText( '' );

		range.moveToPosition( strong, CKEDITOR.POSITION_AFTER_END );
		editor.getSelection().selectRanges( [ range ] );

		assert.areSame( strong, editor.getSelection().getRanges()[ 0 ].getPreviousNode( isElement ),
			'the selection was located after the strong element' );
	},

	// #12690
	'test selectRanges - inside empty inline element': function() {
		var editor = this.editor,
			range = editor.createRange();

		editor.editable().setHtml( '<p>x<span style="font-size:48px"><strong id="target"></strong></span>x</p>' );

		var strong = editor.document.getById( 'target' );
		range.setStart( strong, 0 );
		range.collapse( true );

		editor.getSelection().selectRanges( [ range ] );

		var sel = editor.getSelection();
		assert.isTrue( strong.equals( sel.getStartElement() ) );
	},

	'test getSelectedElement': function() {
		testSelectedElement( '[<img />]', 'img' );
		testSelectedElement( '[<hr />]', 'hr' );
		testSelectedElement( '[<b><i><img /></i>]</b>', 'img' );
	},

	// Issue noticed during works on #9764.
	'test getSelectedElement does not modify ranges': function() {
		var editor = this.editor;

		this.editorBot.setData( '<div>foo</div><p>bar</p>', function() {
			var elP = editor.editable().findOne( 'p' ),
				elDiv = editor.editable().findOne( 'div' ),
				range = editor.createRange();

			range.setStartAt( elDiv, CKEDITOR.POSITION_BEFORE_END );
			range.setEndAt( elP, CKEDITOR.POSITION_BEFORE_END );

			editor.focus();
			range.select();

			var sel = editor.getSelection();

			// Cache range before getting selected element.
			range = sel.getRanges()[ 0 ].clone();

			// Verify that test case works correctly. It might happen that
			// getSelectedElement() has been already executed.
			assert.isTrue( elDiv.contains( range.startContainer ) || elDiv.equals( range.startContainer ),
				'range was not already modified' );

			sel.getSelectedElement();

			var range2 = sel.getRanges()[ 0 ];

			assert.isTrue( range.startContainer.equals( range2.startContainer ) && range.startOffset == range2.startOffset,
				'range was not modified by calling getSelectedElement' );
		} );
	},

	// #11493
	'test getRanges(true) does not modify cached ranges': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<div>te[xt<span contenteditable="false">foo</span>te]xt</div>' );

		var selection = editor.getSelection(),
			editableRanges = selection.getRanges( true ),
			allRanges = selection.getRanges();

		assert.areNotSame( editableRanges, allRanges, 'both method calls returned different arrays' );
		assert.areSame( 2, editableRanges.length, '2 editable ranges returned by getRanges( true )' );
		assert.areSame( 1, allRanges.length, 'only 1 range returned by getRanges()' );
	},

	// #11493
	'test getRanges(true) called after getRanges() does not modify cached ranges': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<div>te[xt<span contenteditable="false">foo</span>te]xt</div>' );

		var selection = editor.getSelection(),
			allRanges = selection.getRanges(),
			editableRanges = selection.getRanges( true );

		assert.areNotSame( editableRanges, allRanges, 'both method calls returned different arrays' );
		assert.areSame( 2, editableRanges.length, '2 editable ranges returned by getRanges( true )' );
		assert.areSame( 1, allRanges.length, 'only 1 range returned by getRanges()' );
	},

	'test getSelectedText': function() {
		testSelectedText( '[<b>foo</b>bar]', 'foobar' );
		testSelectedText( '[<b>foo<img /></b>bar]', 'foobar' );
	},

	'test getStartElement': function() {
		testStartElement( '<b>^foo</b>', 'b' );
		testStartElement( '<b>foo^</b>', 'b' );
		testStartElement( '<i><b>foo[</b>bar]</i>', 'i' );
		testStartElement( '<p>foo[</p><div>bar]</div>', 'p' );
		testStartElement( '[<img />]', 'img' );
	},

	'test lock and unlock': function() {
		// Make the first selection.
		var sourceRange = makeSelection( '<strong id="start">foo</strong>bar[<img />]' )[ 0 ];
		var sel = doc.getSelection(),
			initialRev = sel.rev;

		sel.lock();

		// Make a fresh selection to drop the previous one.
		var newRange = new CKEDITOR.dom.range( doc );
		newRange.selectNodeContents( doc.getById( 'start' ) );
		var domSel = rangy.getSelection();
		domSel.removeAllRanges();
		domSel.addRange( convertRange( newRange ) );

		var resultRange = sel.getRanges()[ 0 ];

		assert.isTrue( !!sel.isLocked, 'selection should be marked as locked.' );
		assert.isTrue( checkRangeEqual( resultRange, sourceRange ), 'get ranges result from locked selection doesn\'t match the original.' );
		assert.isTrue( sel.getStartElement().is( 'img' ), 'start element result from locked selection doesn\'t match the original.' );
		assert.isTrue( sel.getSelectedElement().is( 'img' ), 'selected element result from locked selection doesn\'t match the original.' );
		assert.areSame( initialRev, sel.rev, 'selection\'s rev has not been modified' );

		sel.unlock();

		resultRange = sel.getRanges()[ 0 ];
		assert.isFalse( !!sel.isLocked, 'selection should not be marked as locked.' );
		assert.isTrue( checkRangeEqual( resultRange, newRange ), 'get ranges result from locked selection doesn\'t match the original.' );
		assert.isTrue( sel.getStartElement().is( 'strong' ), 'start element result from locked selection doesn\'t match the original.' );
		assert.isTrue( sel.rev > initialRev, 'unlocked selection gets new rev' );
	},

	'test unlock outdated selection 1': function() {
		makeSelection( '<p>a[b<b id="bold">c]d</b></p>' );

		var sel = doc.getSelection(),
			initialRev = sel.rev;

		sel.lock();

		// Remove node in which one selection's end is anchored.
		doc.getById( 'bold' ).remove();

		sel.selectRanges = function() {
			assert.fail( 'selectRanges should not be called.' );
		};

		sel.unlock( true );

		assert.isTrue( true, 'No error was thrown.' );
		assert.isTrue( sel.rev > initialRev, 'New revision' );
	},

	'test unlock outdated selection 2': function() {
		makeSelection( '<p>a<b id="bold">c[d<i>e]f</i></b></p>' );

		var sel = doc.getSelection(),
			initialRev = sel.rev;

		sel.lock();

		// Remove node in which both selection's ends are anchored.
		doc.getById( 'bold' ).remove();

		sel.selectRanges = function() {
			assert.fail( 'selectRanges should not be called.' );
		};

		sel.unlock( true );

		assert.isTrue( true, 'No error was thrown.' );
		assert.isTrue( sel.rev > initialRev, 'New revision' );
	},

	'test selectRanges after locked': function() {
		// Make the first selection.
		makeSelection( '<strong id="start">foo</strong>bar[<img />]' )[ 0 ];

		var sel = doc.getSelection(),
			initialRev = sel.rev;

		sel.lock();

		// Blur the editable.
		var input = doc.getById( 'input_1' );
		input.focus();

		// Select a new range on locked selection.
		var newRange = new CKEDITOR.dom.range( doc );
		var el = doc.getById( 'start' );
		newRange.selectNodeContents( el );
		sel.selectRanges( [ newRange ] );

		// Check focus remains after selecting ranges.
		assert.areSame( input.$, document.activeElement, 'focus should remains in the text input' );
		// Check the new (refreshed) locked selection.
		assert.isTrue( !!sel.isLocked, 'selection should be locked still' );
		assert.areSame( el, sel.getStartElement(), 'start element of locked should match' );
		assert.areSame( CKEDITOR.SELECTION_TEXT, sel.getType(), 'selection type of locked should match' );
		assert.areSame( 'foo', CKEDITOR.tools.trim( sel.getSelectedText() ), 'selected text of locked should match' );
		assert.isTrue( sel.rev > initialRev, 'New revision after selectRanges on locked selection' );

		// Re-focus the editable.
		doc.getById( 'sandbox' ).focus();

		// Check dom selection range takes effect.
		var domSel = rangy.getSelection();
		var domRange = convertRange( domSel.getRangeAt( 0 ) );
		checkRangeEqual( domRange, newRange, 'actual selection range should be the same' );
	},

	'test removeAllRanges': function() {
		var range = new CKEDITOR.dom.range( doc );
		range.selectNodeContents( doc.getBody() );
		range.select();

		var sel = doc.getSelection(),
			initialRev = sel.rev;

		sel.removeAllRanges();

		var domSel = rangy.getSelection();

		// Various ways of detecting empty selection among browsers.
		var nativeSel = sel.getNative(),
			msSelection = typeof window.getSelection != 'function';

		msSelection ?
			assert.areSame( 'None', nativeSel.type ) :
			assert.areSame( 0, domSel.rangeCount );

		assert.isTrue( sel.rev > initialRev, 'Next revision' );

		// MS selection will remain a (empty) dom range collapsed at the beginning
		// at the document even after the removal.
		if ( msSelection ) {
			var startContainer = doc.getBody();
			var emptyRange = new CKEDITOR.dom.range( doc );
			emptyRange.moveToPosition( startContainer, CKEDITOR.POSITION_AFTER_START );
			checkSelection.call( sel, CKEDITOR.SELECTION_TEXT, startContainer, null, '', [ emptyRange ] );
		}
		else {
			checkSelection.call( sel, CKEDITOR.SELECTION_NONE, null, null, '', 0 );
		}
	},

	// #11500
	'test removeAllRanges is limited to its root': function() {
		var editable1 = doc.getById( 'sandbox' ),
			editable2 = doc.getById( 'sandbox2' );

		tools.setHtmlWithSelection( editable1, '<p>[foo]</p>' );

		var sel2 = new CKEDITOR.dom.selection( editable2 );
		sel2.removeAllRanges();

		assert.areSame( 'foo', new CKEDITOR.dom.selection( editable1 ).getSelectedText(),
			'selection in editable1 was not cleared' );
	},

	// Check ranges return from selection is properly scoped.
	'check selection ranges\' scope': function() {
		var editable = doc.getById( 'sandbox' );
		tools.setHtmlWithSelection( editable, '<p>[foo]</p>' );
		var sel = new CKEDITOR.dom.selection( editable ),
		ranges = sel.getRanges();
		for ( var i = 0; i < ranges.length; i++ )
			assert.areSame( ranges[ i ].root, editable );
	},

	'test get only editable ranges': function() {
		var editable = doc.getById( 'sandbox' ),
			sel, ranges;

		makeSelection( 'f[oo<span contenteditable="false">bar</span>bo]m' );
		sel = new CKEDITOR.dom.selection( editable );
		// Get only editable ranges.
		ranges = sel.getRanges( true );

		assert.areEqual( 2, ranges.length );
		assert.areSame( 'oo', ranges[ 0 ].getEnclosedNode().getText() );
		assert.areSame( 'bo', ranges[ 1 ].getEnclosedNode().getText() );
	},

	'test get only editable ranges 2': function() {
		if ( CKEDITOR.env.ie )
			assert.ignore();

		var editable = doc.getById( 'sandbox' ),
			sel, ranges;

		makeSelection( 'x<span contenteditable="false">fo[o b]ar</span>x' );
		sel = new CKEDITOR.dom.selection( editable );
		// Get only editable ranges.
		ranges = sel.getRanges( true );

		assert.areEqual( 0, ranges.length );
	},

	'selection scrolls into view': function() {
		function assertElementInViewport() {
			var view = doc.getWindow().getViewPaneSize();
			var rect = marker.getClientRect();
			assert.isTrue( rect.top > 0 && rect.top < view.height );
		}

		var editable = doc.getById( 'sandbox' );
		var linebreaks = CKEDITOR.tools.repeat( '<br />', 100 );
		editable.setHtml( '<p>' + linebreaks + 'foo<span id="scroll_marker">bar</span></p>' );

		// MUST not using setHtmlWithSelection which will split text nodes.
		var marker = doc.getById( 'scroll_marker' );
		var range = new CKEDITOR.dom.range( editable );
		range.setStart( marker.getPrevious(), 0 );
		range.setEnd( marker.getFirst(), 3 );
		range.select();

		var sel = new CKEDITOR.dom.selection( editable );
		sel.scrollIntoView();

		// Check the selection is really scrolled into view.
		assertElementInViewport( marker );

		// Make sure the scrollInto view doesn't destroy the selection.
		assert.areSame( 'foobar', sel.getSelectedText() );
	},

	'test cloning - standalone selection': function() {
		makeSelection( 'foo[bar]bom' );

		var editable = doc.getById( 'sandbox' ),
			sel = new CKEDITOR.dom.selection( editable ),
			initialRev = sel.rev,
			clone = new CKEDITOR.dom.selection( sel );

		assert.areSame( sel.document.$, clone.document.$, 'document' );
		assert.areSame( sel.root, clone.root, 'root' );
		assert.areSame( sel.isLocked, clone.isLocked, 'isLocked' );
		assert.areSame( sel.isFake, clone.isFake, 'isFake' );
		assert.areNotSame( sel._.cache, clone._.cache, 'cache' );
		assert.areSame( sel.rev, clone.rev, 'revision' );
		assertSelectionsAreEqual( clone, sel );

		var range = new CKEDITOR.dom.range( editable );
		range.setStart( editable, 0 );
		range.setEndAt( editable, CKEDITOR.POSITION_BEFORE_END );
		sel.selectRanges( [ range ] );

		assert.areNotSame( sel.getSelectedText(), clone.getSelectedText(), 'getSelectedText()' );
		assert.areSame( initialRev, clone.rev, 'Clone\'s revision has not been modified' );
	},

	'test cloning - editor selection': function() {
		bender.tools.setHtmlWithSelection( this.editor, '<p>foo[bar]bom</p>' );

		var sel = this.editor.getSelection(),
			clone = new CKEDITOR.dom.selection( sel );

		assert.areSame( sel.document.$, clone.document.$, 'document' );
		assert.areSame( sel.root, clone.root, 'root' );
		assert.areSame( sel.isLocked, clone.isLocked, 'isLocked' );
		assert.areSame( sel.isFake, clone.isFake, 'isFake' );
		assert.areNotSame( sel._.cache, clone._.cache, 'cache' );
		assert.areSame( sel.rev, clone.rev, 'revision' );
		assertSelectionsAreEqual( clone, sel );
	},

	'test cloning - locked selection': function() {
		makeSelection( 'foo[bar]bom' );

		var editable = doc.getById( 'sandbox' ),
			sel = new CKEDITOR.dom.selection( editable );

		sel.lock();

		var clone = new CKEDITOR.dom.selection( sel );

		assert.areSame( sel.document.$, clone.document.$, 'document' );
		assert.areSame( sel.root, clone.root, 'root' );
		assert.areSame( sel.isLocked, clone.isLocked, 'isLocked' );
		assert.areSame( sel.isFake, clone.isFake, 'isFake' );
		assert.areNotSame( sel._.cache, clone._.cache, 'cache' );
		assert.areSame( sel.rev, clone.rev, 'revision' );
		assertSelectionsAreEqual( clone, sel );
	},

	'test cloning - fake selection': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo] <span id="bar">bar</span></p>' );

		var el = editor.document.getById( 'bar' );

		var sel = editor.getSelection();
		sel.fake( el );

		var clone = new CKEDITOR.dom.selection( sel );

		assert.areSame( sel.document.$, clone.document.$, 'document' );
		assert.areSame( sel.root, clone.root, 'root' );
		assert.areSame( sel.isLocked, clone.isLocked, 'isLocked' );
		assert.areSame( sel.isFake, clone.isFake, 'isFake' );
		assert.areNotSame( sel._.cache, clone._.cache, 'cache' );
		assert.areSame( sel.rev, clone.rev, 'revision' );
		assertSelectionsAreEqual( clone, sel );
	},

	'test revision after executing getters': function() {
		makeSelection( 'foo[bar]bom' );

		var sel = new CKEDITOR.dom.selection( doc ),
			initialRev = sel.rev;

		sel.getCommonAncestor();
		sel.getNative();
		sel.getRanges();
		sel.getRanges( true );
		sel.getSelectedElement();
		sel.getSelectedText();
		sel.getStartElement();
		sel.getType();

		assert.areSame( initialRev, sel.rev, 'Revision has not been modified' );
	}
} );