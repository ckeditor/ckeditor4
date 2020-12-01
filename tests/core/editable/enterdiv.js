/* bender-tags: editor */

bender.editors = {
	classic: {
		config: {
			enterMode: CKEDITOR.ENTER_DIV
		}
	},
	divarea: {
		config: {
			enterMode: CKEDITOR.ENTER_DIV,
			extraPlugins: 'divarea'
		}
	}
};

var tests = {
	// (#2751)
	'test insert div': testInsertHtml( '<div>foo</div>' ),

	// (#2751)
	'test insert div wrapped in another div': testInsertHtml( '<div><div>foo</div></div>' ),

	// (#2751)
	'test insert two divs': testInsertHtml( '<div>foo</div><div>bar</div>' ),

	// (#2751)
	'test insert two divs wrapped in another div': testInsertHtml( '<div><div>foo</div><div>bar</div></div>' )
};

tests = CKEDITOR.tools.object.merge( tests, generateEmptyParagraphsTests() );
tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

// (#2751, #4301)
tests[ 'reinsert the current data' ] = function() {
	var html = '<div>This is some sample text.</div><div>New line.</div>';

	bender.editorBot.create( {
		name: 'reinsert',
		startupData: html,
		config: {
			plugins: 'selectall',
			enterMode: CKEDITOR.ENTER_DIV
		}
	}, function( bot ) {
		var editor = bot.editor,
			range;

		// Using Select All plugin ensures that the selection is emulating
		// real user selection well.
		editor.execCommand( 'selectAll' );
		range = editor.getSelection().getRanges()[ 0 ];

		editor.insertHtml( html, 'html', range );

		assert.areSame( html, editor.getData() );
	} );
};

// (#4301)
tests[ 'test multiple paste into empty editor' ] = function() {
	bender.editorBot.create( {
		name: 'multiple_paste',
		config: {
			enterMode: CKEDITOR.ENTER_DIV
		}
	}, function( bot ) {
		var html = 'Lorem ipsum',
			editor = bot.editor;

		editor.insertHtml( html );
		editor.insertHtml( html );

		assert.areSame( '<div>' + html + html + '</div>', editor.getData() );
	} );
};

bender.test( tests );

function testInsertHtml( htmlString ) {
	return function( editor, bot ) {
		bot.setData( '', function() {
			editor.insertHtml( htmlString );
			assert.areSame( htmlString, editor.getData() );
		} );
	};
}

function generateEmptyParagraphsTests() {
	var tags = [
			'p',
			'div',
			'address',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'center',
			'pre'
		],
		contents = [
			'<br>',
			'&nbsp;',
			'\u00A0',
			'&#160;'
		];

	return CKEDITOR.tools.array.reduce( tags, function( tests, tag ) {
		var tagTests = CKEDITOR.tools.array.reduce( contents, function( tests, content ) {
			var test = {};

			test[ 'empty paragraph test: ' + tag + ' with ' + CKEDITOR.tools.htmlEncode( content ) ] = function( editor ) {
				var html = '<div>foo</div><div>bar</div>';

				editor.editable().setHtml( generateEmptyParagraph( tag, content ) );
				editor.insertHtml( html );

				assert.areSame( html, editor.getData() );
			};

			return CKEDITOR.tools.object.merge( tests, test );
		}, {} );

		return CKEDITOR.tools.object.merge( tests, tagTests );
	}, {} );

	function generateEmptyParagraph( tag, content ) {
		return '<' + tag + '>' + content + '</' + tag + '>';
	}
}
