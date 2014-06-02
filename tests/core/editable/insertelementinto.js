/* bender-tags: editor,unit,insertion */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true,
			autoParagraph: false
		}
	};

	bender.test( {
		'test insertElementIntoRange': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				editable = editor.editable();

			bot.setData( '<p>foobar</p>', function() {
				var range = editor.createRange(),
					element = CKEDITOR.dom.element.createFromHtml( '<div>hi!</div>' ),
					textNode = editable.getChild( [ 0, 0 ] );

				range.setStart( textNode, 2 );
				range.setEnd( textNode, 4 );

				assert.isTrue( editable.insertElementIntoRange( element, range ), 'Insertion is successful.' );
				assert.areSame( '<p>fo</p><div>hi!</div><p>ar</p>', bot.getData( true, true ) )
			} );
		},

		'test insertElementIntoRange (collapsed)': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				editable = editor.editable();

			bot.setData( '<p>foobar</p>', function() {
				var range = editor.createRange(),
					element = CKEDITOR.dom.element.createFromHtml( '<div>hi!</div>' );

				range.setStart( editable.getChild( [ 0, 0 ] ), 3 );
				range.collapse();

				assert.isTrue( editable.insertElementIntoRange( element, range ), 'Insertion is successful.' );
				assert.areSame( '<p>foo</p><div>hi!</div><p>bar</p>', bot.getData( true, true ) )
			} );
		},

		'test insertElementIntoRange (read-only)': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				editable = editor.editable(),
				data = '<p>x</p><p contenteditable="false" id="x">foobar</p><p>y</p>';

			bot.setData( data, function() {
				var range = editor.createRange(),
					element = CKEDITOR.dom.element.createFromHtml( '<div>hi!</div>' );

				range.setStart( editor.document.getById( 'x' ).getFirst(), 3 );
				range.collapse();

				assert.isFalse( editable.insertElementIntoRange( element, range ), 'Insertion failed.' );
				assert.areSame( data, bot.getData( true, true ) )
			} );
		},

		'test insertElementIntoSelection': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				editable = editor.editable();

			bot.setData( '', function() {
				var element = CKEDITOR.dom.element.createFromHtml( '<div>hi!</div>' );

				bot.htmlWithSelection( '<p>foo^bar</p>' );

				editable.insertElementIntoSelection( element );
				assert.areSame( '<p>foo</p><div>hi!</div><p>^bar</p>', bot.htmlWithSelection() );
			} );
		},

		// #11848
		'test insertElementIntoSelection with no selection': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				editable = editor.editable(),
				element = CKEDITOR.dom.element.createFromHtml( '<div>hi!</div>' );

			// Draw focus from editable, so there won't be an automatic selection after set data.
			CKEDITOR.document.getById( 'focusable' ).focus();

			bot.setData( '<p>foobar</p>', function() {
				editable.insertElementIntoSelection( element );
				assert.areEqual( '<div>hi!</div><p>foobar</p>', editor.getData(), 'Invalid editor data.' );
			} );
		},

		'test insertElement with range parameter': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				editable = editor.editable();

			bot.setData( '<p>foobar</p>', function() {
				var range = editor.createRange(),
					element = CKEDITOR.dom.element.createFromHtml( '<div>hi!</div>' );

				range.setStart( editable.getChild( [ 0, 0 ] ), 3 );
				range.collapse();

				editable.insertElement( element, range );

				assert.areSame( '<p>foo</p><div>hi!</div><p>bar</p>', bot.getData( true, true ) )
			} );
		}
	} );

} )();