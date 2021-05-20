/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			name: 'editor1'
		},
		inline: {
			name: 'editor2',
			creator: 'inline'
		}
	};

	bender.test( {

		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'autocomplete' );

			CKEDITOR.document.getBody().setStyles( {
				position: 'static',
				margin: '0'
			} );
		},

		'test create element': function() {
			var editor = this.editors.classic,
				view = new CKEDITOR.plugins.autocomplete.view( editor );

			assertViewElement( editor, view.createElement() );
		},

		'test append': function() {
			var editor = this.editors.classic,
				view = new CKEDITOR.plugins.autocomplete.view( editor );

			view.append();

			assert.areSame( CKEDITOR.document, view.document );
			assertViewElement( editor, view.element );
		},

		'test open': function() {
			var editor = this.editors.classic,
				view = new CKEDITOR.plugins.autocomplete.view( editor );

			view.append();
			view.open();

			assert.isTrue( view.element.hasClass( 'cke_autocomplete_opened' ) );
		},

		'test close': function() {
			var editor = this.editors.classic,
				view = new CKEDITOR.plugins.autocomplete.view( editor );

			view.append();
			view.open();
			view.close();

			assert.isFalse( view.element.hasClass( 'cke_autocomplete_opened' ) );
		},

		'test create item': function() {
			var editor = this.editors.classic,
				view = new CKEDITOR.plugins.autocomplete.view( editor ),
				item = { id: 1, name: 'item' };

			assertItemElement( item, view.createItem( item ) );
		},

		'test get caret rect (classic)': function() {
			this.editorBots.classic.setHtmlWithSelection( '' );

			var rect = getCaretRect( this.editors.classic, { top: 2, height: 3, left: 4 }, { y: 2, x: 4 } );

			assert.areEqual( 7, rect.bottom );
			assert.areEqual( 8, rect.left );
			assert.areEqual( 4, rect.top );
		},

		'test get caret rect (inline)': function() {
			// (#2141)
			if ( CKEDITOR.env.gecko ) {
				assert.ignore();
			}

			this.editorBots.inline.setHtmlWithSelection( '' );

			var rect = getCaretRect( this.editors.inline, { top: 2, height: 3, left: 4 }, { y: 2, x: 4 } );

			assert.areEqual( 7, rect.bottom );
			assert.areEqual( 8, rect.left );
			assert.areEqual( 4, rect.top );
		},

		'test get caret rect with repositioned offset host (classic)': function() {
			CKEDITOR.document.getBody().setStyles( {
				position: 'relative',
				'margin-left': '10px',
				'margin-top': '10px'
			} );

			this.editorBots.classic.setHtmlWithSelection( '' );

			var rect = getCaretRect( this.editors.classic, { top: 10, height: 5, left: 10 }, { y: 2, x: 4 } );

			assert.areEqual( 7, rect.bottom );
			assert.areEqual( 4, rect.left );
			assert.areEqual( 2, rect.top );
		},

		'test get caret rect with repositioned offset host (inline)': function() {
			// (#2141)
			if ( CKEDITOR.env.gecko ) {
				assert.ignore();
			}

			CKEDITOR.document.getBody().setStyles( {
				position: 'relative',
				'margin-left': '10px',
				'margin-top': '10px'
			} );

			this.editorBots.inline.setHtmlWithSelection( '' );

			var rect = getCaretRect( this.editors.inline, { top: 10, height: 5, left: 10 }, { y: 2, x: 4 } );

			assert.areEqual( 7, rect.bottom );
			assert.areEqual( 4, rect.left );
			assert.areEqual( 2, rect.top );
		},

		'test is item element': function() {
			var editor = this.editors.classic,
				view = new CKEDITOR.plugins.autocomplete.view( editor ),
				item = { id: 1, name: 'item' },
				itemElement = view.createItem( item );

			assert.isTrue( view.isItemElement( itemElement ) );
			assert.isFalse( view.isItemElement( CKEDITOR.document.createElement( 'li' ) ) );
		},

		'test update items': function() {
			var editor = this.editors.classic,
				view = new CKEDITOR.plugins.autocomplete.view( editor ),
				items = [ { id: 1, name: 'item1' }, { id: 2, name: 'item2' } ];

			view.append();
			view.updateItems( items );

			assertItemElement( items[ 0 ], view.getItemById( items[ 0 ].id ) );
			assertItemElement( items[ 1 ], view.getItemById( items[ 1 ].id ) );
		},

		'test select item': function() {
			var editor = this.editors.classic,
				view = new CKEDITOR.plugins.autocomplete.view( editor ),
				spy = sinon.spy( view, 'scrollElementTo' ),
				item1 = { id: 1, name: 'item1' },
				item2 = { id: 2, name: 'item2' },
				items = [ item1, item2 ];

			view.append();
			view.updateItems( items );
			view.selectedItemId = item1.id;

			view.selectItem( item2.id );

			assert.areEqual( item2.id, view.selectedItemId );
			assert.isTrue( view.getItemById( item2.id ).hasClass( 'cke_autocomplete_selected' ) );
			assert.isTrue( spy.calledOnce );
		},

		'test attach': function() {
			var editor = this.editors.classic,
				view = new CKEDITOR.plugins.autocomplete.view( editor ),
				spy = sinon.spy( view, 'fire' ),
				item1 = { id: 1, name: 'item1' },
				item2 = { id: 2, name: 'item2' },
				items = [ item1, item2 ];

			view.append();
			view.updateItems( items );

			view.attach();
			view.element.fire( 'click', new CKEDITOR.dom.event( { target: view.getItemById( item2.id ).$ } ) );

			assert.isTrue( spy.calledWith( 'click-item', item2.id.toString() ) );
		}

	} );

	function assertViewElement( editor, element ) {
		var zIndex = editor.config.baseFloatZIndex - 3,
			expectedHtmlRegex = new RegExp( '<ul class="cke_autocomplete_panel" id="cke_[\\d]+" role="listbox" style="z-index: ' + zIndex + ';"></ul>' ),
			actualHtml = bender.tools.compatHtml( element.$.outerHTML, false, true );

		assert.isTrue( expectedHtmlRegex.test( actualHtml ), 'The generated autocomplete HTML is incorrect' );
	}

	function assertItemElement( item, itemElement ) {
		var expectedHtmlRegex = new RegExp( '<li data-id="' + item.id + '" id="cke_[\\d]+" role="option">' + item.name + '</li>' ),
			actualHtml = bender.tools.compatHtml( itemElement.$.outerHTML, false, true );

		assert.isTrue( expectedHtmlRegex.test( actualHtml ), 'The generated autocomplete item HTML is incorrect'  );
	}

	function getCaretRect( editor, caretPosition, offset ) {
		var view = new CKEDITOR.plugins.autocomplete.view( editor ),
			getClientRectsStub = sinon.stub( CKEDITOR.dom.range.prototype, 'getClientRects' ).returns( [ caretPosition ] ),
			offsetStub;

		if ( editor.editable().isInline() ) {
			offsetStub = sinon.stub( CKEDITOR.document, 'getWindow' ).returns( {
				getScrollPosition: function() {
					return offset;
				}
			} );
		} else {
			offsetStub = sinon.stub( CKEDITOR.editable.prototype, 'getParent' ).returns( {
				getDocumentPosition: function() {
					return offset;
				}
			} );
		}

		view.append();

		var caretRect = view.getViewPosition( editor.getSelection().getRanges()[ 0 ] );

		getClientRectsStub.restore();
		offsetStub.restore();

		return caretRect;
	}

} )();
