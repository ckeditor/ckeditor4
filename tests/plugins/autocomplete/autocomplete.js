/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete */

( function() {
	'use strict';

	bender.editors = {
		standard: {},
		arrayKeystrokes: {
			config: {
				autocomplete_commitKeystroke: [ 16 ] // SHIFT
			}
		},
		singleKeystroke: {
			config: {
				autocomplete_commitKeystroke: 16 // SHIFT
			}
		}
	};

	bender.test( {

		'test API exists': function() {
			assert.isFunction( CKEDITOR.plugins.autocomplete, 'autocomplete' );
			assert.isFunction( CKEDITOR.plugins.autocomplete.view, 'autocomplete.view' );
			assert.isFunction( CKEDITOR.plugins.autocomplete.model, 'autocomplete.model' );
		},

		'test esc key closes view': function() {
			var editor = this.editors.standard,
				ac = new CKEDITOR.plugins.autocomplete( editor, matchTestCallback, dataCallback );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			assertViewOpened( ac, true );

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 27 } ) ); // ESC

			assertViewOpened( ac, false );

			ac.destroy();
		},

		'test autocomplete starts with the first item selected': function() {
			var editor = this.editors.standard,
				ac = new CKEDITOR.plugins.autocomplete( editor, matchTestCallback, dataCallback );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			assertViewOpened( ac, true );
			assert.isTrue( ac.view.getItemById( 1 ).hasClass( 'cke_autocomplete_selected' ) );

			ac.destroy();
		},

		'test arrow down selects next item': function() {
			var editor = this.editors.standard,
				editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( editor, matchTestCallback, dataCallback );

			this.editorBots.standard.setHtmlWithSelection( '' );

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
			var editor = this.editors.standard,
				editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( editor, matchTestCallback, dataCallback );

			this.editorBots.standard.setHtmlWithSelection( '' );

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
			var editor = this.editors.standard,
				editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( editor, matchTestCallback, dataCallback );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) ); // ENTER

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		'test tab inserts match': function() {
			var editor = this.editors.standard,
				editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( editor, matchTestCallback, dataCallback );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9 } ) ); // TAB

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		'test custom autocomplete.commitKeystroke value': function() {
			var editor = this.editors.standard,
				editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( editor, matchTestCallback, dataCallback );

			this.editorBots.standard.setHtmlWithSelection( '' );

			ac.commitKeystroke = [ 16 ]; // SHIFT

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9 } ) ); // TAB
			assert.areEqual( '', editor.getData(), 'Tab caused insertion' );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 16 } ) ); // SHIFT

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		'test custom config.autocomplete_commitKeystroke (array format)': function() {
			var editor = this.editors.arrayKeystrokes,
				editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( editor, matchTestCallback, dataCallback );

			this.editorBots.arrayKeystrokes.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9 } ) ); // TAB
			assert.areEqual( '', editor.getData(), 'Tab caused insertion' );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 16 } ) ); // SHIFT

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		'test custom config.autocomplete_commitKeystroke (primitive number)': function() {
			var editor = this.editors.singleKeystroke,
				editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( editor, matchTestCallback, dataCallback );

			this.editorBots.singleKeystroke.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9 } ) ); // TAB
			assert.areEqual( '', editor.getData(), 'Tab caused insertion' );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 16 } ) ); // SHIFT

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		'test click inserts match': function() {
			var editor = this.editors.standard,
				ac = new CKEDITOR.plugins.autocomplete( editor, matchTestCallback, dataCallback );

			this.editorBots.standard.setHtmlWithSelection( '' );

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
