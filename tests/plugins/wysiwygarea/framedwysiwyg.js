/* bender-tags: editor,unit */

var tools = bender.tools;

bender.editor = {
	creator: 'replace',
	config: {
		// Start the editor in other mode.
		on: {
			loaded: function( evt ) {
				var editor = evt.editor;
				editor.addMode( 'source', function( callback ) { callback(); } );
			},

			instanceReady: function( evt ) {
				var editor = evt.editor;
				// Force result data un-formatted.
				editor.dataProcessor.writer._.rules = {};
			}
		},
		autoParagraph: false
	}
};

bender.test(
{
	/**
	 *  Test the wysiwyg mode provider.
	 */
	test_setMode : function() {
		var tc = this;
		var editor = this.editor;
		editor.setMode( 'source', function() {
			editor.setMode( 'wysiwyg', function() {
				resume( function() {
					var editable = editor.editable();
					assert.isTrue( editable.hasClass( 'cke_editable' ) );
					assert.isTrue( editable.is( 'body' ), 'editable should be the "body" element' );
					assert.areSame( editor.document.$, editable.getDocument().$, 'editor.document' );
					assert.areSame( editor.window.$, editor.document.getWindow().$, 'editor.window' );
				} );
			} );
		} );

		wait();
	},

	test_focus : function() {
		var ed = this.editor, bot = this.editorBot;
		bot.focus( function() {
			assert.isTrue( ed.focusManager.hasFocus );
		} );
	},

	test_setData : function() {
		var editor = this.editor;
		var editable = this.editor.editable();

		var data = '<p>foo</p>';
		editor.setData( data, function() {
			resume( function() {
				assert.isMatching( /^<p>foo(<br \/>)?<\/p>$/, tools.compatHtml( editable.getHtml() ), 'set data' );
				assert.areSame( data, editor.getData(), 'retrieve data' );
			} );
		} );
		wait();
	},

	'test editable listeners after setData' : function() {
		var editor = this.editor,
			editable = editor.editable(),
			obj = {},
			fired = false,
			doc = editable.getDocument();

		editor.editable( editable );

		CKEDITOR.event.implementOn( obj );

		editable.attachListener( obj, 'testEvent', function() {
			fired = true;
		} );

		editor.setData( 'abc', function() {
			resume( function() {
				obj.fire( 'testEvent' );
				assert.isFalse( fired, 'Editable-dependent listeners were removed' );
				assert.isTrue( doc.$ !== editor.editable().getDocument(), 'Document has changed' );
			} );
		} );
		wait();
	},

	_testInsertion : function( insertFn, input, result ) {
		!result && ( result = input );
		var editor = this.editor;
		editor.editable().setHtml( '' );

		editor.focus();

		if ( insertFn == 'insertElement' )
			input = CKEDITOR.dom.element.createFromHtml( input, editor.document );

		editor[ insertFn ]( input );

		this.wait( function() {
			   assert.areSame( result, editor.getData(), insertFn );
		   }, 0 );
	},

	test_detach: function() {
		this.editor.editable( null );
		assert.areSame( 0, this.editor.ui.space( 'contents' ).$.getElementsByTagName( 'iframe' ).length );
	}
} );