/* bender-tags: editor,unit,insertion */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: 'div,p,b,i',
			autoParagraph: false
		}
	};

	var tools = bender.tools;

	bender.test( {
		checkInsertHtmlIntoRange: function( insertedHtml, range, expectedInsetionResult, expectedHtml ) {
			var bot = this.editorBot,
				editor = bot.editor,
				editable = editor.editable(),
				afterInsertCount = 0;

			editor.on( 'afterInsert', function() {
				afterInsertCount++;
			} );

			assert.areSame( expectedInsetionResult, editable.insertHtmlIntoRange( insertedHtml, range ), 'Insertion should be ' + expectedInsetionResult + '.' );
			assert.isInnerHtmlMatching( expectedHtml, tools.selection.getWithHtml( editor ), 'Editor content.' );

			if ( expectedInsetionResult ) {
				assert.areSame( 1, afterInsertCount, 'afterInsert should be fired once.' );
			};
		},

		'test insertHtmlIntoRange - block': function() {
			tools.setHtmlWithSelection( this.editor, '<p>foobar</p>' );

			var range = this.editor.createRange(),
				textNode = this.editor.editable().getChild( [ 0, 0 ] );
			range.setStart( textNode, 2 );
			range.setEnd( textNode, 4 );

			this.checkInsertHtmlIntoRange(
				'<div>div</div>', range,
				true, '<p>fo</p><div>div</div><p>ar</p>' );
		},

		'test insertHtmlIntoRange - inline': function() {
			tools.setHtmlWithSelection( this.editor, '<p>foobar</p>' );

			var range = this.editor.createRange(),
				textNode = this.editor.editable().getChild( [ 0, 0 ] );
			range.setStart( textNode, 2 );
			range.setEnd( textNode, 4 );

			this.checkInsertHtmlIntoRange(
				'<b>b</b><i>i</i>', range,
				true, '<p>fo<b>b</b><i>i</i>ar</p>' );
		},

		'test insertHtmlIntoRange - inline, the same range': function() {
			tools.setHtmlWithSelection( this.editor, '<p>fo[ob]ar</p>' );

			var range = this.editor.createRange(),
				textNode = this.editor.editable().getChild( [ 0, 0 ] );
			range.setStart( textNode, 2 );
			range.setEnd( textNode, 4 );

			this.checkInsertHtmlIntoRange(
				'<b>b</b><i>i</i>', range,
				true, '<p>fo<b>b</b><i>i</i>ar</p>' );
		},

		'test insertHtmlIntoRange - collapsed': function() {
			tools.setHtmlWithSelection( this.editor, '<p>foobar</p>' );

			var range = this.editor.createRange(),
				textNode = this.editor.editable().getChild( [ 0, 0 ] );
			range.setStart( textNode, 2 );
			range.setEnd( textNode, 4 );

			this.checkInsertHtmlIntoRange(
				'<b>b</b>', range,
				true, '<p>foo<b>b</b>ba[]r</p>' );
		},

		'test insertHtmlIntoRange - read-only': function() {
			tools.setHtmlWithSelection( this.editor, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y[]</p>' );

			var range = this.editor.createRange();
			range.setStart( this.editor.document.getById( 'x' ).getFirst(), 3 );
			range.collapse();

			this.checkInsertHtmlIntoRange(
				'<div>div</div>', range,
				false, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y[]</p>' );
		},

		'test insertHtmlIntoRange - empty': function() {
			tools.setHtmlWithSelection( this.editor, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y[]</p>' );

			var range = this.editor.createRange();
			range.setStart( this.editor.document.getById( 'x' ).getFirst(), 3 );
			range.collapse();

			this.checkInsertHtmlIntoRange(
				'', range,
				false, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y[]</p>' );
		},

		'test insertHtmlIntoRange - removed content': function() {
			tools.setHtmlWithSelection( this.editor, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y[]</p>' );

			var range = this.editor.createRange();
			range.setStart( this.editor.document.getById( 'x' ).getFirst(), 3 );
			range.collapse();

			this.checkInsertHtmlIntoRange(
				'<img src="foo">', range,
				false, '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y[]</p>' );
		}
	} );

} )();