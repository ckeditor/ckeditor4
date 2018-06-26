/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete */

( function() {
	'use strict';

	var configDefinition = {
		textTestCallback: textTestCallback,
		dataCallback: dataCallback
	};

	bender.editor = {};

	bender.test( {
		setUp: function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
				assert.ignore();
			}
		},

		tearDown: function() {
			for ( var key in this._stubs ) {
				this._stubs[ key ].restore();
			}
		},

		_stubs: {},

		'test dropdown items registered as focusables and removed on destroy': function() {
			var editor = this.editor,
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition ),
				registeredFocusables = {},
				items;

			this._stubs = {
				add: sinon.stub( editor.focusManager, 'add', registerFocusableMock ),
				remove: sinon.stub( editor.focusManager, 'remove', unregisterFocusableMock )
			};

			this.editorBot.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			items = ac.view.element.getChildren().toArray();

			CKEDITOR.tools.array.forEach( items, function( item ) {
				assert.isTrue( item.getUniqueId() in ac.view.focusables, 'Item is focusables list' );
				assert.isTrue( item.getUniqueId() in registeredFocusables, 'Item is registered in focusManager' );
			} );

			ac.destroy();

			CKEDITOR.tools.array.forEach( items, function( item ) {
				assert.isFalse( item.getUniqueId() in ac.view.focusables, 'Item is removed from focusables list' );
				assert.isFalse( item.getUniqueId() in registeredFocusables, 'Item is removed from focusManager' );
			} );

			function registerFocusableMock( item ) {
				registeredFocusables[ item.getUniqueId() ] = true;
			}
			function unregisterFocusableMock( item ) {
				delete registeredFocusables[ item.getUniqueId() ];
			}
		},

		'test focusing dropdown doesn\'t blur editor': function() {
			var editor = this.editor,
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition ),
				blurSpy = sinon.spy(),
				item;

			this.editorBot.setHtmlWithSelection( '' );

			editor.focus();
			editor.on( 'blur', blurSpy, null, null, 10000 );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			item = ac.view.element.getChildren().getItem( 0 );

			item.once( 'focus', function() {
				// Blur is delayed by 200ms, asserts needs to be delayed more.
				setTimeout( function() {
					resume( function() {
						assert.isFalse( blurSpy.called, 'Editor should remain focused, when dropdown is focused.' );
					} );
				}, 210 );
			} );

			setTimeout( function() {
				item.focus();
			} );
			wait();
		}
	} );

	function textTestCallback( selectionRange ) {
		return { text: 'text', range: selectionRange };
	}

	function dataCallback( matchInfo, callback ) {
		return callback( [ { id: 1, name: 'first' }, { id: 2, name: 'second' } ] );
	}
} )();
