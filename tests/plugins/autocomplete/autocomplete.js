/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {

		'test API exists': function() {
			assert.isFunction( CKEDITOR.plugins.autocomplete, 'autocomplete' );
			assert.isFunction( CKEDITOR.plugins.autocomplete.view, 'autocomplete.view' );
			assert.isFunction( CKEDITOR.plugins.autocomplete.model, 'autocomplete.model' );
		},

		'test esc key closes view': function() {
			var editor = this.editor, bot = this.editorBot,
				ac = new CKEDITOR.plugins.autocomplete( this.editor, matchTestCallback, dataCallback );

			bot.setHtmlWithSelection( '' );

			editor.fire( 'focus' );

			assertViewOpened( ac, true );

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 27 } ) );

			assertViewOpened( ac, false );

			ac.destroy();
		},

		'test arrow down selects next item': function() {
			var editor = this.editor, bot = this.editorBot, editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( this.editor, matchTestCallback, dataCallback );

			bot.setHtmlWithSelection( '' );

			editor.fire( 'focus' );

			assertViewOpened( ac, true );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 40 } ) );

			assertViewOpened( ac, true );
			assert.isTrue( ac.view.getItemById( 1 ).hasClass( 'cke_autocomplete_selected' ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 40 } ) );

			assertViewOpened( ac, true );

			assert.isFalse( ac.view.getItemById( 1 ).hasClass( 'cke_autocomplete_selected' ) );
			assert.isTrue( ac.view.getItemById( 2 ).hasClass( 'cke_autocomplete_selected' ) );

			ac.destroy();
		},

		'test arrow up selects previous item': function() {
			var editor = this.editor, bot = this.editorBot, editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( this.editor, matchTestCallback, dataCallback );

			bot.setHtmlWithSelection( '' );

			editor.fire( 'focus' );

			assertViewOpened( ac, true );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 38 } ) );

			assertViewOpened( ac, true );
			assert.isTrue( ac.view.getItemById( 2 ).hasClass( 'cke_autocomplete_selected' ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 38 } ) );

			assertViewOpened( ac, true );

			assert.isFalse( ac.view.getItemById( 2 ).hasClass( 'cke_autocomplete_selected' ) );
			assert.isTrue( ac.view.getItemById( 1 ).hasClass( 'cke_autocomplete_selected' ) );

			ac.destroy();
		},

		'test enter inserts match': function() {
			var editor = this.editor, bot = this.editorBot, editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( this.editor, matchTestCallback, dataCallback );

			bot.setHtmlWithSelection( '' );

			editor.fire( 'focus' );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 40 } ) );
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) );

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		'test click inserts match': function() {
			var editor = this.editor, bot = this.editorBot, editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( this.editor, matchTestCallback, dataCallback );

			bot.setHtmlWithSelection( '' );

			editor.fire( 'focus' );

			ac.view.getItemById( 1 ).$.click();

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		}
	} );

	function assertViewOpened( ac, isOpened ) {
		var opened = ac.view.element.hasClass( 'cke_autocomplete_opened' );
		if ( isOpened ) {
			assert.isTrue( opened )
		} else {
			assert.isFalse( opened );
		}
	}

	function matchTestCallback( selectionRange ) {
		return { text: 'text', range: selectionRange };
	}

	function textTestCallback() {}
	function dataCallback( query, range, callback ) {
		return callback( [ { id: 1, name: 'item1' }, { id: 2, name: 'item2' } ] );
	}

} )();
