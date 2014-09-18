/* bender-tags: editor,unit,insertion */

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

			editor.on( 'afterInsert', function( evt ) {
				afterInsertCount++;
				afterInsertData = evt.data;
			} );

			editable.insertHtmlIntoRange( insertedHtml, range );

			assert.isInnerHtmlMatching( expectedHtml, editable.getHtml(), 'Editor content.' );
			assert.areSame( 1, afterInsertCount, 'afterInsert should be fired once.' );
			assert.isFalse( afterInsertData.intoSelection, 'intoSelection should be false' );
		},

		'test insertHtmlIntoRange - block': function() {
			tools.setHtmlWithSelection( this.editor, '<p>foobar</p>' );

			var range = this.editor.createRange(),
				textNode = this.editor.editable().getChild( [ 0, 0 ] );
			range.setStart( textNode, 2 );
			range.setEnd( textNode, 4 );

			this.checkInsertHtmlIntoRange( '<div>div</div>', range, '<p>fodivar</p>' ); // Works the same way as insertHtml
		},

		'test insertHtmlIntoRange - inline': function() {
			tools.setHtmlWithSelection( this.editor, '<p>foobar</p>' );

			var range = this.editor.createRange(),
				textNode = this.editor.editable().getChild( [ 0, 0 ] );
			range.setStart( textNode, 2 );
			range.setEnd( textNode, 4 );

			this.checkInsertHtmlIntoRange( '<b>b</b><i>i</i>', range, '<p>fo<b>b</b><i>i</i>ar</p>' );
		},

		'test insertHtmlIntoRange - inline, the same range': function() {
			tools.setHtmlWithSelection( this.editor, '<p>fo[ob]ar</p>' );

			var range = this.editor.createRange(),
				editable = this.editor.editable();
			range.setStart( editable.getChild( [ 0, 0 ] ), 2 );
			range.setEnd( editable.getChild( [ 0, 2 ] ), 0 );

			this.checkInsertHtmlIntoRange( '<b>b</b><i>i</i>', range, '<p>fo<b>b</b><i>i</i>ar</p>' );
		},

		'test insertHtmlIntoRange - collapsed': function() {
			tools.setHtmlWithSelection( this.editor, '<p>foobar</p>' );

			var range = this.editor.createRange(),
				textNode = this.editor.editable().getChild( [ 0, 0 ] );
			range.setStart( textNode, 3 );
			range.collapse();

			this.checkInsertHtmlIntoRange( '<b>b</b>', range, '<p>foo<b>b</b>bar</p>' );
		},

		'test insertHtmlIntoRange - read-only': function() {
			tools.setHtmlWithSelection( this.editor, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y[]</p>' );

			var range = this.editor.createRange();
			range.setStart( this.editor.document.getById( 'x' ).getFirst(), 3 );
			range.collapse();

			this.checkInsertHtmlIntoRange( '<div>div</div>', range, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y</p>' );
		},

		'test insertHtmlIntoRange - empty': function() {
			tools.setHtmlWithSelection( this.editor, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y[]</p>' );

			var range = this.editor.createRange();
			range.setStart( this.editor.document.getById( 'x' ).getFirst(), 3 );
			range.collapse();

			this.checkInsertHtmlIntoRange( '', range, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y</p>' );
		},

		'test insertHtmlIntoRange - removed content': function() {
			tools.setHtmlWithSelection( this.editor, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y[]</p>' );

			var range = this.editor.createRange();
			range.setStart( this.editor.document.getById( 'x' ).getFirst(), 3 );
			range.collapse();

			this.checkInsertHtmlIntoRange( '<img src="foo">', range, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y</p>' );
		}
	} );

} )();