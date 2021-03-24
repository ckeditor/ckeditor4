/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea,toolbar,widget,codesnippet,image2,undo,basicstyles,entities,sourcearea */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

'use strict';
( function() {
	var upArrow = 38,
		downArrow = 40,
		enter = 13,
		getWidgetById = widgetTestsTools.getWidgetById,
		image2Fixture =  (
			'<figure id="w1" class="image">' +
			'<img alt="alternative text" src="../../_assets/lena.jpg" />' +
			'<figcaption>Caption</figcaption>' +
			'</figure>'
		),
		codeSnippetFixture = (
			'<pre><code class="language-javascript">//Hello another world!</code></pre>'
		),
		bogusParagraph = '<p>&nbsp;</p>',
		bogusBr = '<br />',
		bogusDiv = '<div>&nbsp;</div>';

	bender.test( {
		_should: {
			ignore: {
				// #4563
				'test press shift + enter with ckeditor.enter_br inserts <br> element after a widget': bender.env.ie && bender.env.version == '8'
			}
		},

		// (#4467)
		'test press shift + alt + enter must insert a paragraph before a widget': testFactory( {
			input: image2Fixture + codeSnippetFixture,
			result: bogusParagraph + image2Fixture + codeSnippetFixture,
			keyCode: CKEDITOR.SHIFT + CKEDITOR.ALT + enter,
			config: {
				allowedContent: true
			},
			assertion: assertAParagraphIsInserted
		} ),

		// (#4467)
		'test press shift + enter must insert a paragraph after a widget': testFactory( {
			input: image2Fixture + codeSnippetFixture,
			result: image2Fixture + bogusParagraph + codeSnippetFixture,
			keyCode: CKEDITOR.SHIFT + enter,
			config: {
				allowedContent: true
			},
			assertion: assertAParagraphIsInserted
		} ),

		// (#4467)
		'test custom key shift + down must insert a paragraph after a widget': testFactory( {
			input: image2Fixture + codeSnippetFixture,
			result: image2Fixture + bogusParagraph + codeSnippetFixture,
			keyCode: CKEDITOR.SHIFT + downArrow,
			config: {
				allowedContent: true,
				widget_keystrokeInsertLineAfter: CKEDITOR.SHIFT + downArrow
			},
			assertion: assertAParagraphIsInserted
		} ),

		// (#4467)
		'test custom key shift + up must insert a paragraph before a widget': testFactory( {
			input: image2Fixture + codeSnippetFixture,
			result: bogusParagraph + image2Fixture + codeSnippetFixture,
			keyCode: CKEDITOR.SHIFT + upArrow,
			config: {
				allowedContent: true,
				widget_keystrokeInsertLineBefore: CKEDITOR.SHIFT + upArrow
			},
			assertion: assertAParagraphIsInserted
		} ),

		// (#4467)
		'test press shift + enter with ckeditor.enter_br inserts <br> element after a widget': testFactory( {
			input: image2Fixture + 'Hello!',
			result: image2Fixture + bogusBr + 'Hello!',
			keyCode: CKEDITOR.SHIFT + enter,
			config: {
				allowedContent: true,
				enterMode: CKEDITOR.ENTER_BR,
				height: 500
			},
			assertion: assertAParagraphIsInserted
		} ),

		// (#4467)
		'test press shift + enter with ckeditor.enter_div inserts <div> element after a widget': testFactory( {
			input: image2Fixture + codeSnippetFixture,
			result: image2Fixture + bogusDiv + codeSnippetFixture,
			keyCode: CKEDITOR.SHIFT + enter,
			config: {
				allowedContent: true,
				enterMode: CKEDITOR.ENTER_DIV
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

	function assertAParagraphIsInserted( editor, result ) {
		var snapshots = editor.undoManager.snapshots;

		assert.beautified.html( result, editor.getData(), 'A paragraph should be inserted' );
		assert.areSame( 2, snapshots.length, 'Two undo snapshots should be created at this point.' );
		assert.isFalse( snapshots[ 0 ].equalsContent( snapshots[ 1 ] ), 'The snapshots should be different.' );
	}
} )();
