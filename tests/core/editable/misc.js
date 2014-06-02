/* bender-tags: editor,unit */

'use strict';

bender.test( {
	'async:init': function() {
		var that = this;

		bender.tools.setUpEditors( {
			editor: {
				name: 'editor1',
				creator: 'inline',
				config: {
					allowedContent: true
				}
			},
		}, function( editors, bots ) {
			that.editorBots = bots;
			that.editors = editors;
			that.callback();
		} );
	},

	// #3448.
	'test click on image selects it': function() {
		// This is Gecko/Webkit/Blink fix.
		if ( CKEDITOR.env.ie )
			assert.ignore();

		var bot = this.editorBots.editor;

		bot.setData( '<p>foo<img src="../../_assets/img.gif" alt="" />foo</p>', function() {
			var editor = bot.editor,
				img = editor.editable().findOne( 'img' );

			editor.focus();

			editor.editable().fire( 'mousedown', new CKEDITOR.dom.event( {
				target: img.$
			} ) );

			var selectedElement = editor.getSelection().getSelectedElement();
			assert.isNotNull( selectedElement );
			assert.isTrue( img.equals( selectedElement ), 'Image was selected' );
		} );
	},

	// #3448. This is a different case than image, because we make input readonly by setting
	// contenteditable=false in the data processor.
	'test click on a input selects it': function() {
		// This is Gecko/Webkit/Blink fix.
		if ( CKEDITOR.env.ie )
			assert.ignore();

		var bot = this.editorBots.editor;

		bot.setData( '<p>foo<input type="text" value="" />foo</p>', function() {
			var editor = bot.editor,
				input = editor.editable().findOne( 'input' );

			editor.focus();

			editor.editable().fire( 'mousedown', new CKEDITOR.dom.event( {
				target: input.$
			} ) );

			var selectedElement = editor.getSelection().getSelectedElement();
			assert.isNotNull( selectedElement );
			assert.isTrue( input.equals( selectedElement ), 'Input was selected' );
		} );
	},

	// #11727.
	'test click on a non-editable image does not select it': function() {
		var bot = this.editorBots.editor;

		bot.setData( '<p>foo</p><div contenteditable="false"><img src="../../_assets/img.gif" alt="" /></div><p>foo</p>', function() {
			var editor = bot.editor,
				img = editor.editable().findOne( 'img' );

			editor.getSelection().selectElement( editor.editable().findOne( 'p' ) );

			editor.editable().fire( 'mousedown', new CKEDITOR.dom.event( {
				target: img.$
			} ) );

			assert.areSame( 'foo', editor.getSelection().getSelectedText(), 'Selection has not been changed' );
		} );
	},

	// #11727.
	'test click on deeply nested non-editable image does not select it': function() {
		var bot = this.editorBots.editor;

		bot.setData( '<p>foo</p><div contenteditable="false"><p><span><img src="../../_assets/img.gif" alt="" /></span></p></div><p>foo</p>', function() {
			var editor = bot.editor,
				img = editor.editable().findOne( 'img' );

			editor.getSelection().selectElement( editor.editable().findOne( 'p' ) );

			editor.editable().fire( 'mousedown', new CKEDITOR.dom.event( {
				target: img.$
			} ) );

			assert.areSame( 'foo', editor.getSelection().getSelectedText(), 'Selection has not been changed' );
		} );
	}
} );