/* bender-tags: editor,unit,insertion */

	var doc = CKEDITOR.document,
		tools = bender.tools;

	bender.editor = { config : {
		autoParagraph : false,
		allowedContent : true // Disable filter.
	} };

	bender.test(
	{
		testInsertElement : function() {
			var editor = this.editor;

			// When editor has focus.
			var ins = CKEDITOR.dom.element.createFromHtml( '<strong>baz</strong>', editor.document );
			bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
			editor.insertElement( ins );
			assert.areSame( 'foo<strong>baz</strong>bar', tools.compatHtml( editor.getData() ), 'insert element with existing selection, editor focused' );

			// When editor loose focus.
			bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
			ins = CKEDITOR.dom.element.createFromHtml( '<strong>baz</strong>', editor.document );
			doc.getById( 'text_input' ).focus();
			editor.insertElement( ins );
			assert.areSame( 'foo<strong>baz</strong>bar', tools.compatHtml( editor.getData() ), 'insert element with existing selection, editor blurred' );
		},

		testInsertHtml : function() {
			var editor = this.editor;

			// When editor has focus.
			bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
			editor.insertHtml( 'baz' );
			assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert html with existing selection, editor focused' );

			// When editor loose focus.
			bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
			doc.getById( 'text_input' ).focus();
			editor.insertHtml( 'baz' );
			assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert html with existing selection, editor blurred' );
		},

		testInsertText : function() {
			var editor = this.editor;

			// When editor has focus.
			bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
			editor.insertText( 'baz' );
			assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert text with existing selection, editor focused' );

			// When editor loose focus.
			bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
			doc.getById( 'text_input' ).focus();
			editor.insertText( 'baz' );
			assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert text with existing selection, editor blurred' );
		},

		'test insertHtml without filter': function() {
			bender.editorBot.create( {
				name: 'test_inserthtml_no_acf',
				config: {
					removePlugins: 'basicstyles'
				}
			}, function( bot ) {
				var editor = bot.editor;
				editor.focus();

				editor.insertHtml( '<em>A</em>B' );
				assert.areSame( '<p>AB</p>', bot.getData(), '<em> has been filtered out' );

				editor.insertHtml( '<em>C</em>D', 'unfiltered_html' );
				assert.areSame( '<p>AB<em>C</em>D</p>', bot.getData(), '<em> has been inserted' );
			} );
		},

		'test insertHtml uses editor.activeEnterMode': function() {
			bender.editorBot.create( {
				name: 'test_inserthtml_entermode',
				config: {
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor,
					toHtml = 0,
					mode;

				editor.focus();

				editor.on( 'toHtml', function( evt ) {
					toHtml += 1;
					mode = evt.data.enterMode;
				} );

				editor.setActiveEnterMode( CKEDITOR.ENTER_BR );
				editor.insertHtml( 'foo' );
				assert.areSame( CKEDITOR.ENTER_BR, mode, 'dynamic enter mode was used - BR' );

				editor.setActiveEnterMode( null );
				editor.insertHtml( 'foo' );
				assert.areSame( CKEDITOR.ENTER_P, mode, 'dynamic enter mode was used - P' );

				// Just to be sure that test is correct.
				assert.areSame( 2, toHtml, 'toHtml was fired twice' );
			} );
		}
} );