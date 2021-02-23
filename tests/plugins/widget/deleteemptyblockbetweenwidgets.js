/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea,toolbar,forms,widget,codesnippet,image2,undo,basicstyles,entities */

'use strict';

( function() {
	var backspace = 8,
		deleteKey = 46,
		leftArrow = 37,
		rightArrow = 39,
		image2Fixture = '<figure class="image">' +
			'<img alt="alternative text" src="_assets/bar.png" />' +
			'<figcaption>I&#39;m a description</figcaption>' +
			'</figure>',
		codeSnippetFixture = '<pre><code class="language-javascript">//Hello another world!</code></pre>';

	bender.test( {
		// (#1572)
		'test press del to remove an empty paragraph block between two widgets': testFactory( {
			input: image2Fixture + createBlock( '&nbsp', 'p' ) + codeSnippetFixture,
			result: image2Fixture + codeSnippetFixture,
			keyCode: deleteKey,
			config: {
				allowedContent: true
			},
			assertion: assertBlockDeleted
		} ),

		// (#1572)
		'test press del to remove an empty heading block between two widgets': testFactory( {
			input: image2Fixture + createBlock( '&nbsp', 'h2' ) + codeSnippetFixture,
			result: image2Fixture + codeSnippetFixture,
			keyCode: deleteKey,
			config: {
				allowedContent: true
			},
			assertion: assertBlockDeleted
		} ),

		// (#1572)
		'test press del to remove an empty div block between two widgets': testFactory( {
			input: image2Fixture + createBlock( '&nbsp', 'div' ) + codeSnippetFixture,
			result: image2Fixture + codeSnippetFixture,
			keyCode: deleteKey,
			config: {
				allowedContent: true
			},
			assertion: assertBlockDeleted
		} ),

		// (#1572)
		'test press backspace to remove an empty block between two widgets': testFactory( {
			input: image2Fixture + createBlock( '&nbsp' ) + codeSnippetFixture,
			result: image2Fixture + codeSnippetFixture,
			keyCode: backspace,
			config: {
				allowedContent: true
			},
			assertion: assertBlockDeleted
		} ),

		// (#1572)
		'test press right arrow must not remove a block between two widgets': testFactory( {
			input: image2Fixture + createBlock( '&nbsp' ) + codeSnippetFixture,
			keyCode: rightArrow,
			config: {
				allowedContent: true
			},
			assertion: assertNothingHasChanged
		} ),

		// (#1572)
		'test press left arrow must not remove a block between two widgets': testFactory( {
			input: image2Fixture + createBlock( '&nbsp' ) + codeSnippetFixture,
			keyCode: leftArrow,
			config: {
				allowedContent: true
			},
			assertion: assertNothingHasChanged
		} ),

		// (#1572)
		'test press del must not remove a not empty block between two widgets': testFactory( {
			input: image2Fixture + createBlock( 'Not empty' ) + codeSnippetFixture,
			keyCode: deleteKey,
			config: {
				allowedContent: true
			},
			assertion: assertBlockNotDeleted
		} ),

		// (#1572)
		'test press backspace must not remove a not empty block between two widgets': testFactory( {
			input: image2Fixture + createBlock( 'Not empty' ) + codeSnippetFixture,
			keyCode: backspace,
			config: {
				allowedContent: true
			},
			assertion: assertBlockNotDeleted
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

				selectBlock( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: keyCode } ) );

				assertion( editor, result );
			} );
		};
	}

	function selectBlock( editor ) {
		var range = editor.createRange();

		range.moveToPosition( editor.document.getById( 'block' ), CKEDITOR.POSITION_AFTER_START );
		editor.getSelection().selectRanges( [ range ] );
	}

	function createBlock( fillerText, blockTag ) {
		var block;

		blockTag = blockTag ? blockTag : 'p';
		block = new CKEDITOR.dom.element( blockTag );
		block.setAttribute( 'id', 'block' );
		block.setHtml( fillerText );

		return block.getOuterHtml();
	}

	function assertBlockDeleted( editor, result ) {
		var snapshots = editor.undoManager.snapshots;

		assert.areSame( result, editor.getData(), 'The empty block between the two widgets should be removed.' );
		assert.areSame( 2, snapshots.length, 'Two undo snapshots should be created at this point.' );
		assert.isFalse( snapshots[ 0 ].equalsContent( snapshots[ 1 ] ), 'The snapshots should be different.' );
	}

	function assertNothingHasChanged( editor, result ) {
		assert.beautified.html( result, editor.getData(), 'The empty block between the two widgets should not be removed.' );
	}

	function assertBlockNotDeleted( editor ) {
		var block = editor.document.getById( 'block' );

		assert.isNotUndefined( block, 'The block between the two widgets should not be removed.' );
		assert.isNotNull( block, 'The block between the two widgets should not be removed.' );
	}
} )();
