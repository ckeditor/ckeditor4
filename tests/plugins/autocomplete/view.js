/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete, caretposition */

( function() {

	bender.editors = {
		classic: {
			name: 'editor1'
		},
		inline: {
			name: 'editor2',
			creator: 'inline'
		}
	}

	bender.test( {

		'test create element': function() {
			var editor = this.editors.classic, view = new CKEDITOR.plugins.autocomplete.view( editor );

			assertViewElement( editor, view.createElement() );

		},

		'test append': function() {
			var editor = this.editors.classic, view = new CKEDITOR.plugins.autocomplete.view( editor );

			view.append();

			assert.areSame( CKEDITOR.document, view.document );
			assertViewElement( editor, view.element );
		},

		'test open': function() {
			var editor = this.editors.classic, view = new CKEDITOR.plugins.autocomplete.view( editor );

			view.append();
			view.open();

			assert.isTrue( view.element.hasClass( 'cke_autocomplete_opened' ) );
		},

		'test close': function() {
			var editor = this.editors.classic, view = new CKEDITOR.plugins.autocomplete.view( editor );

			view.append();
			view.open();
			view.close();

			assert.isFalse( view.element.hasClass( 'cke_autocomplete_opened' ) );
		},

		'test create item': function() {
			var editor = this.editors.classic, view = new CKEDITOR.plugins.autocomplete.view( editor ),
				item = { id: 1, name: 'item' };

			assertItemElement( item, view.createItem( item ) );
		},

		'test get caret rect (classic)': function() {
			var editor = this.editors.classic, view = new CKEDITOR.plugins.autocomplete.view( editor ),
				position = { top: 2, height: 3, left: 4 },

				caretPositionStub = sinon.stub( CKEDITOR.dom.selection.prototype, 'getCaretPosition' ).returns( position ),
				editableStub = sinon.stub( CKEDITOR.editable.prototype, 'getParent' ).returns( {
					getDocumentPosition: function() {
						return {
							y: 2,
							x: 4
						}
					}
				} )

			rect = view.getCaretRect();

			assert.areEqual( 7, rect.bottom );
			assert.areEqual( 8, rect.left );
			assert.areEqual( 4, rect.top );

			// Test fixture down
			caretPositionStub.restore();
			editableStub.restore();
		},

		'test get caret rect (inline)': function() {
			var editor = this.editors.inline, view = new CKEDITOR.plugins.autocomplete.view( editor ),
				position = { top: 2, height: 3, left: 4 },

				caretPositionStub = sinon.stub( CKEDITOR.dom.selection.prototype, 'getCaretPosition' ).returns( position ),
				windowStub = sinon.stub( CKEDITOR.document, 'getWindow' ).returns( {
					getScrollPosition: function() {
						return {
							y: 2,
							x: 4
						}
					}
				} )

			rect = view.getCaretRect();

			assert.areEqual( 7, rect.bottom );
			assert.areEqual( 8, rect.left );
			assert.areEqual( 4, rect.top );

			// Test fixture down
			caretPositionStub.restore();
			windowStub.restore();
		},

		'test is item element': function() {
			var editor = this.editors.classic, view = new CKEDITOR.plugins.autocomplete.view( editor ),
				item = { id: 1, name: 'item' },
				itemElement = view.createItem( item );

			assert.isTrue( view.isItemElement( itemElement ) );
			assert.isFalse( view.isItemElement( CKEDITOR.document.createElement( 'li' ) ) );
		},

		'test update items': function() {
			var editor = this.editors.classic, view = new CKEDITOR.plugins.autocomplete.view( editor ),
				items = [ { id: 1, name: 'item1' }, { id: 2, name: 'item2' } ];

			view.append();
			view.updateItems( items );

			assertItemElement( items[ 0 ], view.getItemById( items[ 0 ].id ) );
			assertItemElement( items[ 1 ], view.getItemById( items[ 1 ].id ) );
		},

		'test select item': function() {
			var editor = this.editors.classic, view = new CKEDITOR.plugins.autocomplete.view( editor ),
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

		'test set position above': function() {

			assertPanePosition( this.editors.classic, {
				bottom: 0,
				left: 10,
				top: 200
			}, function( element ) {
				assert.areEqual( '50px', element.getStyle( 'top' ) );
				assert.areEqual( '10px', element.getStyle( 'left' ) );
			} );

		},

		'test set position below': function() {

			assertPanePosition( this.editors.classic, {
				bottom: 20,
				left: 10,
				top: 20
			}, function( element ) {
				assert.areEqual( '20px', element.getStyle( 'top' ) );
				assert.areEqual( '10px', element.getStyle( 'left' ) );
			} );
		},

		'test attach': function() {
			var editor = this.editors.classic, view = new CKEDITOR.plugins.autocomplete.view( editor ),
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

	function assertPanePosition( editor, rect, callback ) {
		var view = new CKEDITOR.plugins.autocomplete.view( editor ),
			windowStub = sinon.stub( CKEDITOR.document, 'getWindow' ).returns( {
				getViewPaneSize: function() {
					return { height: 100 };
				},
				getScrollPosition: function() {
					return { x: 10 };
				}
			} );

		view.append();

		sinon.stub( view.element, 'getSize' ).returns( 150 );

		view.setPosition( rect );

		callback( view.element );

		// Test fixture down
		windowStub.restore();
	}

	function assertViewElement( editor, element ) {
		var zIndex = editor.config.baseFloatZIndex - 3;
		assert.areEqual( '<ul class="cke_autocomplete_panel" style="z-index: ' + zIndex + ';"></ul>', element.$.outerHTML );
	}

	function assertItemElement( item, itemElement ) {
		assert.areEqual( '<li data-id="' + item.id + '">' + item.name + '</li>', itemElement.$.outerHTML );
	}

} )();
