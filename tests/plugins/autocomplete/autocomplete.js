/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete */

( function() {
	'use strict';

	bender.editors = {
		standard: {
			config: {
				extraAllowedContent: 'strong'
			}
		},
		arrayKeystrokes: {
			config: {
				autocomplete_commitKeystrokes: [ 16 ] // SHIFT
			}
		},
		singleKeystroke: {
			config: {
				autocomplete_commitKeystrokes: 16 // SHIFT
			}
		}
	};

	var configDefinition = {
		textTestCallback: textTestCallback,
		dataCallback: dataCallback
	};

	bender.test( {

		'test API exists': function() {
			assert.isFunction( CKEDITOR.plugins.autocomplete, 'autocomplete' );
			assert.isFunction( CKEDITOR.plugins.autocomplete.view, 'autocomplete.view' );
			assert.isFunction( CKEDITOR.plugins.autocomplete.model, 'autocomplete.model' );
		},

		'test esc key closes view': function() {
			var editor = this.editors.standard,
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			assertViewOpened( ac, true );

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 27 } ) ); // ESC

			assertViewOpened( ac, false );

			ac.destroy();
		},

		'test autocomplete starts with the first item selected': function() {
			var editor = this.editors.standard,
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			assertViewOpened( ac, true );
			assert.isTrue( ac.view.getItemById( 1 ).hasClass( 'cke_autocomplete_selected' ) );

			ac.destroy();
		},

		'test arrow down selects next item': function() {
			var editor = this.editors.standard,
				editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition );

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
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition );

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
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) ); // ENTER

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		'test tab inserts match': function() {
			var editor = this.editors.standard,
				editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9 } ) ); // TAB

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		'test custom autocomplete.commitKeystrokes value': function() {
			var editor = this.editors.standard,
				editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition );

			this.editorBots.standard.setHtmlWithSelection( '' );

			ac.commitKeystrokes = [ 16 ]; // SHIFT

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9 } ) ); // TAB
			assert.areEqual( '', editor.getData(), 'Tab caused insertion' );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 16 } ) ); // SHIFT

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		'test custom config.autocomplete_commitKeystrokes (array format)': function() {
			var editor = this.editors.arrayKeystrokes,
				editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition );

			this.editorBots.arrayKeystrokes.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9 } ) ); // TAB
			assert.areEqual( '', editor.getData(), 'Tab caused insertion' );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 16 } ) ); // SHIFT

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		'test custom config.autocomplete_commitKeystrokes (primitive number)': function() {
			var editor = this.editors.singleKeystroke,
				editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition );

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
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			ac.view.getItemById( 1 ).$.click();

			assert.areEqual( '<p>item1</p>', editor.getData() );

			ac.destroy();
		},

		// (#1910)
		'test view position on scroll': function() {
			var editor = this.editors.standard;

			if ( !CKEDITOR.env.iOS && !editor.editable().isInline()  ) {
				assert.ignore();
			}

			var ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition );

			this.editorBots.standard.setHtmlWithSelection( '' );

			// Starting view position.
			// +---------------------------------------------+
			// |       editor viewport                       |
			// |                                             |
			// |     █ - caret position                      |
			// |     +--------------+                        |
			// |     |     view     |                        |
			// |     +--------------+                        |
			// |                                             |
			// |                                             |
			// +---------------------------------------------+
			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			// Stub caret and view positioning functions after view show up so we will be able to check if view repositioning
			// occurs after scroll event on viewport element.
			var getClientRectStub = sinon.stub( CKEDITOR.dom.element.prototype, 'getClientRect' )
				.returns( { top: 0, bottom: 100 } ),
				viewport = CKEDITOR.document.getById( editor.id + '_contents' );

			sinon.stub( ac.view, 'getViewPosition' ).returns( { top: 150, bottom: 160, left: 50 } );
			sinon.stub( ac.view.element, 'getSize' ).returns( 50 );

			// View position after scroll.
			// +-----+==============+------------------------+
			// |     |              |                        |
			// |     |     view     |                        |
			// |     |              |                        |
			// |     +--------------+                        |
			// |																						 |
			// |       editor viewport                       |
			// +---------------------------------------------+
			viewport.fire( 'scroll' );

			getClientRectStub.restore();

			assert.areEqual( '50px', ac.view.element.getStyle( 'top' ) );
			assert.areEqual( '50px', ac.view.element.getStyle( 'left' ) );

			ac.destroy();
		},

		// (#1987)
		'test custom view template': function() {
			var editor = this.editors.standard,
				itemTemplate = '<li data-id="{id}"><strong>{name}</strong></li>',
				ac = new CKEDITOR.plugins.autocomplete( editor, matchTestCallback,
					function( query, range, callback ) {
						callback( [ { id: 1, name: 'anna' } ] );
					},
					itemTemplate );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			assert.beautified.html( '<ul><li class="cke_autocomplete_selected" data-id="1"><strong>anna</strong></li></ul>',
				ac.view.element.getHtml() );

			ac.destroy();
		},

		// (#1987)
		'test custom output template': function() {
			var editor = this.editors.standard,
				editable = editor.editable(),
				outputTemplate = '<strong>{name}</strong>',
				ac = new CKEDITOR.plugins.autocomplete( editor, matchTestCallback,
					function( query, range, callback ) {
						callback( [ { id: 1, name: 'anna' } ] );
					},
					null,
					outputTemplate );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) ); // ENTER

			assert.beautified.html( '<p><strong>anna</strong></p>', editable.getData() );

			ac.destroy();
		},

		// (#1970)
		'test view position starts from the beginning of the match': function() {
			var editor = this.editors.standard,
				editable = editor.editable(),
				lastRangeRect = { left: 10, top: 10, height: 10 },
				ac = new CKEDITOR.plugins.autocomplete( editor,
					function() {
						var range = editor.createRange(),
							invalidRect = { top: 0, left: 0, height: 5 };

						sinon.stub( range, 'getClientRects' ).returns( [ invalidRect, invalidRect, lastRangeRect ] );

						return { text: '@Annabelle', range: range };
					},
					dataCallback );

			this.editorBots.standard.setHtmlWithSelection( '@Annabelle^' );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			var viewRect = ac.view.element.getClientRect(),
				offset = 3;

			assert.isNumberInRange( viewRect.left,
				lastRangeRect.left - offset,
				lastRangeRect.left + offset,
				'Horizontal position.' );

			assert.isNumberInRange( viewRect.top,
				lastRangeRect.top + lastRangeRect.height - offset,
				lastRangeRect.top + lastRangeRect.height + offset,
				'Vertical position.' );

			ac.destroy();
		}
	}	);

	function assertViewOpened( ac, isOpened ) {
		var opened = ac.view.element.hasClass( 'cke_autocomplete_opened' );
		if ( isOpened ) {
			assert.isTrue( opened );
		} else {
			assert.isFalse( opened );
		}
	}

	function textTestCallback( selectionRange ) {
		return { text: 'text', range: selectionRange };
	}

	function dataCallback( query, range, callback ) {
		return callback( [ { id: 1, name: 'item1' }, { id: 2, name: 'item2' }, { id: 3, name: 'item3' } ] );
	}

} )();
