/* bender-tags: editor,insertion */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: 'div p b i',
			autoParagraph: false
		}
	};

	var tools = bender.tools;

	bender.test( {
		checkInsertHtmlIntoRange: function( insertedHtml, range, expectedHtml ) {
			var bot = this.editorBot,
				editor = bot.editor,
				editable = editor.editable(),
				afterInsertCount = 0, afterInsertData;

			editor.on( 'afterInsertHtml', function( evt ) {
				afterInsertCount++;
				afterInsertData = evt.data;
			} );

			editable.insertHtmlIntoRange( insertedHtml, range );

			assert.isInnerHtmlMatching( expectedHtml, editable.getHtml(), 'Editor content.' );
			assert.areSame( 1, afterInsertCount, 'afterInsertHtml should be fired once.' );
			assert.areSame( range, afterInsertData.intoRange, 'intoRange should contain range' );
		},

		'test insertHtmlIntoRange - block': function() {
			this.editor.editable().setHtml( '<p>foobar</p>' );

			var range = this.editor.createRange(),
				textNode = this.editor.editable().getChild( [ 0, 0 ] );
			range.setStart( textNode, 2 );
			range.setEnd( textNode, 4 );

			this.checkInsertHtmlIntoRange( '<div>div</div>', range, '<p>fodivar@</p>' ); // Works the same way as insertHtml
		},

		'test insertHtmlIntoRange - inline': function() {
			this.editor.editable().setHtml( '<p>foobar</p>' );

			var range = this.editor.createRange(),
				textNode = this.editor.editable().getChild( [ 0, 0 ] );
			range.setStart( textNode, 2 );
			range.setEnd( textNode, 4 );

			this.checkInsertHtmlIntoRange( '<b>b</b><i>i</i>', range, '<p>fo<b>b</b><i>i</i>ar@</p>' );
		},

		'test insertHtmlIntoRange - inline, the same range': function() {
			var range = bender.tools.range.setWithHtml( this.editor.editable(), '<p>fo{ob}ar</p>' );
			this.editor.getSelection().selectRanges( [ range ] );

			this.checkInsertHtmlIntoRange( '<b>b</b><i>i</i>', range, '<p>fo<b>b</b><i>i</i>ar@</p>' );
		},

		'test insertHtmlIntoRange - collapsed': function() {
			tools.setHtmlWithSelection( this.editor, '<p>foobar</p>' );

			var range = this.editor.createRange(),
				textNode = this.editor.editable().getChild( [ 0, 0 ] );
			range.setStart( textNode, 3 );
			range.collapse();

			this.checkInsertHtmlIntoRange( '<b>b</b>', range, '<p>foo<b>b</b>bar@</p>' );
		},

		'test insertHtmlIntoRange - read-only': function() {
			bender.tools.selection.setWithHtml( this.editor, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y{}</p>' );

			var range = this.editor.createRange();
			range.setStart( this.editor.document.getById( 'x' ).getFirst(), 3 );
			range.collapse();

			this.checkInsertHtmlIntoRange( '<div>div</div>', range, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y@</p>' );
		},

		'test insertHtmlIntoRange - empty': function() {
			bender.tools.selection.setWithHtml( this.editor, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y{}</p>' );

			var range = this.editor.createRange();
			range.setStart( this.editor.document.getById( 'x' ).getFirst(), 3 );
			range.collapse();

			this.checkInsertHtmlIntoRange( '', range, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y@</p>' );
		},

		'test insertHtmlIntoRange - removed content': function() {
			bender.tools.selection.setWithHtml( this.editor, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y{}</p>' );

			var range = this.editor.createRange();
			range.setStart( this.editor.document.getById( 'x' ).getFirst(), 3 );
			range.collapse();

			this.checkInsertHtmlIntoRange( '<img src="foo">', range, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y@</p>' );
		},

		'test insertHtml with range': function() {
			this.editor.editable().setHtml( '<p>foobar</p>' );

			var range = this.editor.createRange(),
				textNode = this.editor.editable().getChild( [ 0, 0 ] ),
				bot = this.editorBot,
				editor = bot.editor,
				editable = editor.editable(),
				afterInsertCount = 0, afterInsertData;

			range.setStart( textNode, 2 );
			range.setEnd( textNode, 4 );

			editor.on( 'afterInsertHtml', function( evt ) {
				afterInsertCount++;
				afterInsertData = evt.data;
			} );

			editable.insertHtml( '<b>b</b>', 'html', range );

			assert.isInnerHtmlMatching( '<p>fo<b>b^</b>ar@</p>', bender.tools.selection.getWithHtml( editor ),
				{ compareSelection: true, normalizeSelection: true }, 'Editor content' );
			assert.areSame( 1, afterInsertCount, 'afterInsertHtml should be fired once.' );
			assert.areSame( undefined, afterInsertData.intoRange, 'intoRange should be null if insertHtml was used.' );
		}
	} );

} )();
