/* bender-tags: editor,unit */

	var doc = CKEDITOR.document,
		tools = bender.tools;

	CKEDITOR.focusManager._.blurDelay = 0;

	// This group of tests plays upon the editable div.
	bender.test(
	{
		// Initialize the editor instance.
		'async:init' : function() {
			var tc = this;
			var editor = new CKEDITOR.editor( { autoParagraph : false } );
			editor.on( 'loaded', function() {
				tc.editor = editor;
				tc.callback();
			} );
		},

		// Setup reset editor to blank as well as keeping the editor focused.
		setUp : function() {
			var tc = this;
			var editor = tc.editor;
			if ( !editor.editable() )
				editor.editable( doc.getById( 'editable' ) );
			editor.setData( '' );
		},

		// Test all editable APIs.
		testFocus : function() {
			var editor = this.editor;
			var editable = editor.editable();
			bender.tools.focus( this.editor, function() {
				assert.isTrue( editable.hasClass( 'cke_editable' ) );
				assert.isTrue( editor.focusManager.hasFocus, 'focus gained' );
				bender.tools.focus( doc.getById( 'text_input' ), function() {
					assert.isFalse( editor.focusManager.hasFocus, 'focus left' );
				} );
			} );
		},

		testData : function() {
			var editor = this.editor;
			editor.setData( '<p>foo</p>' );
			assert.areSame( '<p>foo</p>', tools.compatHtml( editor.editable().getHtml() ), 'set data' );
			assert.areSame( '<p>foo</p>', tools.compatHtml( editor.getData() ), 'retrieve data' );
		},

		testAttachListeners : function() {
			var editor = this.editor,
				editable = editor.editable();

			var counter = {};
			function recorder( evt ) {
				if ( !counter[ evt.name ] )
					counter[ evt.name ] = 1;
				else
					counter[ evt.name ]++;
			}

			editable.on( 'foo', recorder );
			editable.attachListener( editor, 'bar', recorder );

			editable.fire( 'foo' );
			editor.fire( 'bar' );

			editor.editable( null );

			editable.fire( 'foo' );
			editor.fire( 'bar' );

			assert.areSame( 2, counter.foo );
			assert.areSame( 1, counter.bar );

			editor.editable( doc.getById( 'editable' ) );
		},

		'testAttachClass' : function() {
			var ed = this.editor,
				edt = ed.editable();

			edt.attachClass( 'foo' );
			assert.isTrue( edt.hasClass( 'foo' ), 'check attached class' );
			ed.editable( null );
			assert.isFalse( edt.hasClass( 'foo' ), 'check class cleaned up' );
		},

		'testChangeAttr' : function() {
			var ed = this.editor;

			// Attach a new editable for test.
			ed.editable( null );
			var edt = ed.editable( doc.getById( 'editable2' ) );

			edt.changeAttr( 'align', 'right' );
			edt.changeAttr( 'foo', 'bar' );

			assert.areSame( 'right', edt.getAttribute( 'align' ), 'check changed attr' );
			assert.areSame( 'bar', edt.getAttribute( 'foo' ), 'check added new attr' );

			edt.changeAttr( 'foo', 'baz' );
			assert.areSame( 'baz', edt.getAttribute( 'foo' ), 'check changed existing attr' );

			ed.editable( null );

			assert.areSame( 'left', edt.getAttribute( 'align' ), 'check restored attr' );
			assert.isFalse( edt.hasAttribute( 'foo' ), 'check removed new attr' );
		},

		testDetach: function() {
			var editable = this.editor.editable();
			this.editor.editable( null );
			assert.isFalse( editable.hasClass( 'cke_editable' ) );
			assert.isUndefined( this.editor.window );
			assert.isUndefined( this.editor.document );
		}
} );