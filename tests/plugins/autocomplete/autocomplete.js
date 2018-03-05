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

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			assertViewOpened( ac, true );

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 27 } ) ); // ESC

			assertViewOpened( ac, false );

			ac.destroy();
		},

		'test autocomplete starts with the first item selected': function() {
			var editor = this.editor, bot = this.editorBot,
				ac = new CKEDITOR.plugins.autocomplete( this.editor, matchTestCallback, dataCallback );

			bot.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			assertViewOpened( ac, true );
			assert.isTrue( ac.view.getItemById( 1 ).hasClass( 'cke_autocomplete_selected' ) );

			ac.destroy();
		},

		'test arrow down selects next item': function() {
			var editor = this.editor, bot = this.editorBot, editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( this.editor, matchTestCallback, dataCallback );

			bot.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 40 } ) ); // ARROW DOWN

			assertViewOpened( ac, true );
			assert.isTrue( ac.view.getItemById( 2 ).hasClass( 'cke_autocomplete_selected' ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 40 } ) ); // ARROW DOWN

			assertViewOpened( ac, true );
			assert.isTrue( ac.view.getItemById( 3 ).hasClass( 'cke_autocomplete_selected' ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 40 } ) ); // ARROW DOWN

			assertViewOpened( ac, true );
			assert.isTrue( ac.view.getItemById( 1 ).hasClass( 'cke_autocomplete_selected' ) );

			ac.destroy();
		},

		'test arrow up selects previous item': function() {
			var editor = this.editor, bot = this.editorBot, editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( this.editor, matchTestCallback, dataCallback );

			bot.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 38 } ) ); // ARROW UP

			assertViewOpened( ac, true );
			assert.isTrue( ac.view.getItemById( 3 ).hasClass( 'cke_autocomplete_selected' ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 38 } ) ); // ARROW UP

			assertViewOpened( ac, true );
			assert.isTrue( ac.view.getItemById( 2 ).hasClass( 'cke_autocomplete_selected' ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 38 } ) ); // ARROW UP

			assertViewOpened( ac, true );
			assert.isTrue( ac.view.getItemById( 1 ).hasClass( 'cke_autocomplete_selected' ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 38 } ) ); // ARROW UP

			assertViewOpened( ac, true );
			assert.isTrue( ac.view.getItemById( 3 ).hasClass( 'cke_autocomplete_selected' ) );

			ac.destroy();
		},

		'test enter inserts match': function() {
			var editor = this.editor, bot = this.editorBot, editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( this.editor, matchTestCallback, dataCallback );

			bot.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) ); // ENTER

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		'test tab inserts match': function() {
			var editor = this.editor, bot = this.editorBot, editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( this.editor, matchTestCallback, dataCallback );

			bot.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 40 } ) );
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9 } ) );

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		'test custom key inserts match': function() {
			var editor = this.editor, bot = this.editorBot, editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( this.editor, matchTestCallback, dataCallback );

			bot.setHtmlWithSelection( '' );

			ac.completingKeyCodes.push( 16 );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 40 } ) );
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 16 } ) );

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		'test custom key inserts match (global configuration)': function() {
			var editor = this.editor, bot = this.editorBot, editable = editor.editable(),
				configKeyCodes = CKEDITOR.config.autocomplete_completingKeyCodes.slice();

			bot.setHtmlWithSelection( '' );

			CKEDITOR.config.autocomplete_completingKeyCodes.push( 16 );

			var ac = new CKEDITOR.plugins.autocomplete( this.editor, matchTestCallback, dataCallback );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 40 } ) );
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 16 } ) );

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();

			CKEDITOR.config.autocomplete_completingKeyCodes = configKeyCodes;
		},

		'test click inserts match': function() {
			var editor = this.editor, bot = this.editorBot,
				ac = new CKEDITOR.plugins.autocomplete( this.editor, matchTestCallback, dataCallback );

			bot.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			ac.view.getItemById( 1 ).$.click();

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		}
	} );

	function assertViewOpened( ac, isOpened ) {
		var opened = ac.view.element.hasClass( 'cke_autocomplete_opened' );
		if ( isOpened ) {
			assert.isTrue( opened );
		} else {
			assert.isFalse( opened );
		}
	}

	function matchTestCallback( selectionRange ) {
		return { text: 'text', range: selectionRange };
	}

	function dataCallback( query, range, callback ) {
		return callback( [ { id: 1, name: 'item1' }, { id: 2, name: 'item2' }, { id: 3, name: 'item3' } ] );
	}

} )();
