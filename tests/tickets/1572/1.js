/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea,toolbar,forms,widget,codesnippet,undo,basicstyles,entities */

'use strict';
( function() {

	var backspace = 8;
	var deleteKey = 46;
	var leftArrow = 37;
	var rightArrow = 39;

	var input = (
		'<pre><code class="language-javascript">//Hello world!</code></pre><p>&nbsp;</p><pre>' +
		'<code class="language-javascript">//Hello another world!</code></pre>'
	);

	var notEmptyInput = (
		'<pre><code class="language-javascript">//Hello world!</code></pre><p>Hello, world!</p><pre>' +
		'<code class="language-javascript">//Hello another world!</code></pre>'
	);


	var result = (
		'<pre><code class="language-javascript">//Hello world!</code></pre><pre>' +
		'<code class="language-javascript">//Hello another world!</code></pre>'
	);

	function selectEmptyParagraph( editor ) {
		var range = editor.createRange();
		range.selectNodeContents( editor.document.getElementsByTag( 'P' ).getItem( 0 ) );
		range.collapse( true );
		editor.getSelection().selectRanges( [ range ] );
	}

	bender.test( {
		'test fire delete to remove an empty paragraph between two widgets': function() {
			bender.editorBot.create( {
				name: 'editor1',
				startupData: input
			}, function( bot ) {
				var editor = bot.editor;
				selectEmptyParagraph( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: deleteKey } ) );
				assert.areSame( result, editor.getData(), 'Empty paragraph between two widget should be removed.' );
			} );
		},
		'test fire backspace to remove an empty paragraph between two widgets': function() {
			bender.editorBot.create( {
				name: 'editor2',
				startupData: input
			}, function( bot ) {
				var editor = bot.editor;
				selectEmptyParagraph( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: backspace } ) );
				assert.areSame( result, editor.getData(), 'Empty paragraph between two widget should be removed.' );
			} );
		},
		'test fire right arrow must not remove a paragraph between two widgets': function() {
			bender.editorBot.create( {
				name: 'editor3',
				startupData: input
			}, function( bot ) {
				var editor = bot.editor;
				selectEmptyParagraph( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: rightArrow } ) );

				assert.areSame( input, editor.getData(), 'Empty paragraph between two widget should not be removed.' );
			} );
		},
		'test fire left arrow must not remove a paragraph between two widgets': function() {
			bender.editorBot.create( {
				name: 'editor4',
				startupData: input
			}, function( bot ) {
				var editor = bot.editor;
				selectEmptyParagraph( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: leftArrow } ) );
				assert.areSame( input, editor.getData(), 'Empty paragraph between two widget should not be removed.' );
			} );
		},
		'test delete must not remove a non empty paragraph between two widgets': function() {
			bender.editorBot.create( {
				name: 'editor5',
				startupData: notEmptyInput
			}, function( bot ) {
				var editor = bot.editor;
				var p;
				selectEmptyParagraph( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: deleteKey } ) );
				p = editor.document.getElementsByTag( 'P' ).getItem( 0 );
				assert.isNotUndefined( p, 'Not empty paragraph should not be removed.' );
				assert.isNotNull( p, 'Not empty paragraph should not be removed.' );
			} );
		},
		'test backspace must not remove a non empty paragraph between two widgets': function() {
			bender.editorBot.create( {
				name: 'editor6',
				startupData: notEmptyInput
			}, function( bot ) {
				var editor = bot.editor;
				var p;
				selectEmptyParagraph( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: backspace } ) );
				p = editor.document.getElementsByTag( 'P' ).getItem( 0 );
				assert.isNotUndefined( p, 'Not empty paragraph should not be removed.' );
				assert.isNotNull( p, 'Not empty paragraph should not be removed.' );
			} );
		}
	} );

}() );
