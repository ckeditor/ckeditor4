/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea,toolbar,forms,widget,codesnippet,image2,undo,basicstyles,entities */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

'use strict';
( function() {
	var upArrow = 38,
		downArrow = 40,
		getWidgetById = widgetTestsTools.getWidgetById,
		image2Fixture =  (
			'<figure id="w1" class="image">' +
			'<img alt="alternative text" src="../../_assets/lena.jpg" />' +
			'<figcaption>Caption</figcaption>' +
			'</figure>'
		),
		codeSnippetFixture = (
			'<pre><code class="language-javascript">//Hello another world!</code></pre>'
		);

	bender.test( {

		// (#4467)
		'test press shift + up must insert a paragraph above a widget': testFactory( {
			input: image2Fixture + codeSnippetFixture,
			result: image2Fixture + codeSnippetFixture,
			keyCode: CKEDITOR.SHIFT + upArrow,
			config: {
				allowedContent: true
			},
			assertion: assertAParagraphIsInserted
		} ),

		// (#4467)
		'test press shift + down must insert a paragraph below a widget': testFactory( {
			input: image2Fixture + codeSnippetFixture,
			result: image2Fixture + codeSnippetFixture,
			keyCode: CKEDITOR.SHIFT + downArrow,
			config: {
				allowedContent: true
			},
			assertion: assertAParagraphIsInserted
		} )

	} );

	function testFactory( params ) {
		var input = params.input,
			result = params.result || input,
			keyCode = params.keyCode,
			config = params.config || {},
			assertion = params.assertion;

		return function() {
			bender.editorBot.create( {
				name: 'editor' + new Date().getTime(),
				startupData: input,
				config: config
			}, function( bot ) {
				var editor = bot.editor;

				selectWidget( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: keyCode } ) );

				assertion( editor, result );
			} );

		};

	}

	function selectWidget( editor ) {
		var widget = getWidgetById( editor, 'w1' );

		widget.focus();
	}

	function assertAParagraphIsInserted( editor ) {
		var snapshots = editor.undoManager.snapshots;

		assert.areSame( 1, editor.document.getElementsByTag( 'p' ).count(), 'A paragraph should be inserted' );
		assert.areSame( 2, snapshots.length, 'Two undo snapshots should be created at this point.' );
		assert.isFalse( snapshots[ 0 ].equalsContent( snapshots[ 1 ] ), 'The snapshots should be different.' );
	}
} )();
