/* bender-tags: editor */

'use strict';

bender.editors = {
	editor: {
		name: 'editor1',
		creator: 'inline',
		config: {
			allowedContent: true
		}
	},
	scrollable: {
		name: 'editor2',
		creator: 'replace',
		config: {
			height: 300
		}
	}
};

bender.test( {
	_should: {
		ignore: {
			// #895
			'test scroll editable and focus': CKEDITOR.env.chrome
		}
	},

	// https://dev.ckeditor.com/ticket/3448.
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

	// https://dev.ckeditor.com/ticket/3448. This is a different case than image, because we make input readonly by setting
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

	// https://dev.ckeditor.com/ticket/11727.
	'test click on a non-editable image does not select it': function() {
		var bot = this.editorBots.editor;

		bot.setData( '<p>foo</p><div contenteditable="false"><img src="../../_assets/img.gif" alt="" /></div><p>foo</p>', function() {
			var editor = bot.editor,
				img = editor.editable().findOne( 'img' );

			// For some reason Edge 42+ needs focus (#2129).
			editor.focus();
			editor.getSelection().selectElement( editor.editable().findOne( 'p' ) );

			editor.editable().fire( 'mousedown', new CKEDITOR.dom.event( {
				target: img.$
			} ) );

			// From Firefox 70 it returns trailing '\n' (#3633).
			assert.areSame( 'foo', CKEDITOR.tools.trim( editor.getSelection().getSelectedText() ), 'Selection has not been changed' );
		} );
	},

	// https://dev.ckeditor.com/ticket/11727.
	'test click on deeply nested non-editable image does not select it': function() {
		var bot = this.editorBots.editor;

		bot.setData( '<p>foo</p><div contenteditable="false"><p><span><img src="../../_assets/img.gif" alt="" /></span></p></div><p>foo</p>', function() {
			var editor = bot.editor,
				img = editor.editable().findOne( 'img' );

			editor.getSelection().selectElement( editor.editable().findOne( 'p' ) );

			editor.editable().fire( 'mousedown', new CKEDITOR.dom.event( {
				target: img.$
			} ) );

			// From Firefox 70 it returns trailing '\n' (#3633).
			assert.areSame( 'foo', CKEDITOR.tools.trim( editor.getSelection().getSelectedText() ), 'Selection has not been changed' );
		} );
	},

	'test scroll editable and focus': function() {
		if ( !CKEDITOR.env.chrome ) {
			assert.ignore();
		}

		var bot = this.editorBots.scrollable,
			editable = this.editors.scrollable.editable();

		bot.setData( '<p>Test</p><p>Test</p><p>Test</p><p>Test</p>' +
			'<p>Test</p><p>Test</p><p>Test</p><p>Test</p>' +
			'<p>Test</p><p>Test</p><p>Test</p><p>Test</p>' +
			'<p>Test</p><p>Test</p><p>Test</p><p>Test</p>' +
			'<p>Test</p><p>Test</p><p>Test</p><p>Test</p>', function() {
			var scrollPos = 100;

			editable.$.scrollTop = scrollPos;
			editable.focus();

			assert.areSame( scrollPos, editable.$.scrollTop );
		} );
	}
} );
