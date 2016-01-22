/* bender-tags: editor,unit */

( function() {

	'use strict';

	bender.editor = true;

	var doc = CKEDITOR.document,
		tcs = {};

	var playground = doc.getById( 'playground' );
	// apply block transformation
	// apply multiple block transformation
	// apply inline transformation
	// apply multiple inline transformation

	CKEDITOR.tools.extend( tcs, {
		'test multiple classes are applied for block': function() {
			var editor = this.editor;
			var style = new CKEDITOR.style({
				element: 'p',
				attributes: {
					'class': 'bar'
				}
			});

			this.editorBot.setHtmlWithSelection( '<p class="foo">[hello world]</p>' );

			editor.applyStyle(style);

			var output = this.editorBot.htmlWithSelection(playground);
			console.log('output: ', output);

			assert.areSame( '<p class="foo bar">[hello world]</p>', output, 'test multiple classes block' );

		},

		'test multiple classes are applied for multiple blocks': function() {
			var editor = this.editor;
			var style = new CKEDITOR.style({
				element: 'p',
				attributes: {
					'class': 'bar'
				}
			});

			bender.tools.selection.setWithHtml(editor, '<p class="foo">{hello world</p><p>foo bar}</p>');

			editor.applyStyle(style);

			var output = this.editorBot.htmlWithSelection(playground);

			assert.areSame( '<p class="foo bar">[hello world</p><p class="bar">foo bar]</p>', output, 'test multiple classes multiple blocks' );

		}
	} );

	bender.test( tcs );

} )();