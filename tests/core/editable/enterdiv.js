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
	'test insert two divs wrapped in another div': testInsertHtml( '<div><div>foo</div><div>bar</div></div>' ),

	// (#3379)
	'test getData call (div enter mode)': testGetData()
};

tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

// (#3379)
tests[ 'test getData call (p enter mode)' ] = function() {
	bender.editorBot.create( {}, function( bot ) {
		testGetData()( bot.editor, bot );
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

function testGetData() {
	return function( editor, bot ) {
		bot.setData( '', function() {
			var i = 0,
				listener = editor.on( 'beforeGetData', function() {
					++i;
				} ),
				spy = sinon.spy( CKEDITOR.editor.prototype, 'getData' ),
				expectedGetDataCount = Number( editor.config.enterMode === CKEDITOR.ENTER_DIV );

			editor.insertHtml( 'hublabubla' );

			listener.removeListener();
			spy.restore();

			assert.areSame( expectedGetDataCount, spy.callCount, 'getData count' );
			assert.areSame( 0, i, 'beforeGetData count' );
		} );
	};
}
