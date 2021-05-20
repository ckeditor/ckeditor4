/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete,wysiwygarea,sourcearea */

( function() {
	'use strict';

	bender.editors = {
		standard: {
			config: {
				allowedContent: 'strong',
				removePlugins: 'tab'
			}
		},
		source: {
			config: {
				removePlugins: 'tab'
			}
		},
		arrayKeystrokes: {
			config: {
				autocomplete_commitKeystrokes: [ 16 ], // SHIFT
				removePlugins: 'tab'
			}
		},
		singleKeystroke: {
			config: {
				autocomplete_commitKeystrokes: 16, // SHIFT
				removePlugins: 'tab'
			}
		}
	};

	var configDefinition = {
		textTestCallback: textTestCallback,
		dataCallback: dataCallback
	};

	bender.test( {

		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'autocomplete' );
		},

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

		// (#2031)
		'test mouseover changes selected item': function() {
			var editor = this.editors.standard,
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			var firstElement = ac.view.getItemById( 1 );
			assertViewOpened( ac, true );
			assert.isTrue( firstElement.hasClass( 'cke_autocomplete_selected' ) );

			var target = ac.view.element.getLast();
			ac.view.element.fire( 'mouseover', new CKEDITOR.dom.event( { target: target.$ } ) );

			assertViewOpened( ac, true );
			assert.isFalse( firstElement.hasClass( 'cke_autocomplete_selected' ) );
			assert.isTrue( target.hasClass( 'cke_autocomplete_selected' ) );

			ac.destroy();
		},

		// (#2187)
		'test mouseover finds correct target': function() {
			var editor = this.editors.standard,
				ac = new CKEDITOR.plugins.autocomplete( editor, {
					dataCallback: dataCallback,
					textTestCallback: textTestCallback,
					itemTemplate: '<li data-id="{id}"><b>{name}</b></li>'
				} );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			var firstElement = ac.view.getItemById( 1 );
			assertViewOpened( ac, true );
			assert.isTrue( firstElement.hasClass( 'cke_autocomplete_selected' ) );

			var listItem = ac.view.element.getLast(),
				target = listItem.findOne( 'b' );

			ac.view.element.fire( 'mouseover', new CKEDITOR.dom.event( { target: target.$ } ) );

			assertViewOpened( ac, true );
			assert.isFalse( firstElement.hasClass( 'cke_autocomplete_selected' ) );
			assert.isTrue( listItem.hasClass( 'cke_autocomplete_selected' ) );

			ac.destroy();
		},

		// (#1984)
		'test view is not opened after unmatch': function() {
			var editor = this.editors.standard,
				ac = new CKEDITOR.plugins.autocomplete( editor, {
					textTestCallback: textTestCallback,
					dataCallback: function( matchInfo, callback ) {
						setTimeout( function() {
							callback( [ { id: 1, name: 'test' } ] );
						}, 100 );
					}
				} );

			this.editorBots.standard.setHtmlWithSelection( 'foo' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			ac.textWatcher.fire( 'unmatched' );

			setTimeout( function() {

				resume( function() {
					assertViewOpened( ac, false );
					assert.isNull( ac.model.data );

					ac.destroy();
				} );

			}, 150 );

			wait();
		},

		// (#3938, #4107)
		'test navigation keybindings are registered after changing mode': function() {
			var editor = this.editors.source,
				bot = this.editorBots.standard,
				ac1 = new CKEDITOR.plugins.autocomplete( editor, configDefinition ),
				ac2 = new CKEDITOR.plugins.autocomplete( editor, configDefinition );

			editor.setMode( 'source', function() {
				editor.setMode( 'wysiwyg', function() {
					resume( function() {
						testPanelEvents( ac1, 'The first autocomplete navigation bindings should work' );
						testPanelEvents( ac2, 'The second autocomplete navigation bindings should work' );
					} );
				} );
			} );

			function testPanelEvents( autocomplete, msg ) {
				var spy = sinon.spy( autocomplete, 'onKeyDown' );

				bot.setHtmlWithSelection( '' );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {} ) );

				spy.restore();

				assert.isTrue( spy.called, msg );
			}

			wait();
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
			// |                                             |
			// |       editor viewport                       |
			// +---------------------------------------------+
			viewport.fire( 'scroll' );

			getClientRectStub.restore();

			assert.areEqual( '50px', ac.view.element.getStyle( 'top' ) );
			assert.areEqual( '50px', ac.view.element.getStyle( 'left' ) );

			ac.destroy();
		},

		// (#1997)
		'test throttle': function() {
			var editor = this.editors.standard,
				ac = new CKEDITOR.plugins.autocomplete( editor, {
					dataCallback: dataCallback,
					textTestCallback: function( selectionRange ) {
						return {
							text: CKEDITOR.tools.getUniqueId(),
							range: selectionRange
						};
					},
					throttle: 100
				} ),
				callbackSpy = sinon.spy( ac.textWatcher, 'callback' );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			assert.isTrue( callbackSpy.calledOnce );

			setTimeout( function() {
				resume( function() {
					assert.isTrue( callbackSpy.calledTwice );
					ac.destroy();
				} );
			}, 100 );
			wait();
		},

		// (#1987)
		'test custom view template': function() {
			var editor = this.editors.standard,
				ac = new CKEDITOR.plugins.autocomplete( editor, {
					textTestCallback: textTestCallback,
					dataCallback: function( matchInfo, callback ) {
						callback( [ { id: 1, name: 'anna' } ] );
					},
					itemTemplate: '<li data-id="{id}"><strong>{name}</strong></li>'
				} ),
				expectedHtmlRegex = /<ul><li class="cke_autocomplete_selected" data-id="1" id="cke_[\d]+" role="option"><strong>anna<\/strong><\/li><\/ul>/,
				actualHtml;

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			actualHtml = bender.tools.compatHtml( ac.view.element.getHtml(), false, true );

			assert.isTrue( expectedHtmlRegex.test( actualHtml ), 'Incorrect autocomplete item HTML' );

			ac.destroy();
		},

		// (#1987)
		'test custom output template': function() {
			var editor = this.editors.standard,
				editable = editor.editable(),
				ac = new CKEDITOR.plugins.autocomplete( editor, {
					textTestCallback: textTestCallback,
					dataCallback: function( matchInfo, callback ) {
						callback( [ { id: 1, name: 'anna' } ] );
					},
					outputTemplate: '<strong>{name}</strong>'
				} );

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
				// Remove document position offset so it won't broke dashboard test (#2051).
				getDocumentPositionStub = sinon.stub( CKEDITOR.dom.element.prototype, 'getDocumentPosition' )
					.returns( { x: 0, y: 0 } ),
				editorViewportRectStub = sinon.stub( CKEDITOR.dom.element.prototype, 'getClientRect' )
					.returns( { top: 0, bottom: 200 } ),
				lastRangeRect = { left: 10, top: 10, height: 10 },
				ac = new CKEDITOR.plugins.autocomplete( editor, {
					textTestCallback: function() {
						var range = editor.createRange(),
							invalidRect = { top: 0, left: 0, height: 5 };

						sinon.stub( range, 'getClientRects' ).returns( [ invalidRect, invalidRect, lastRangeRect ] );

						return { text: '@Annabelle', range: range };
					},
					dataCallback: dataCallback
				} );

			this.editorBots.standard.setHtmlWithSelection( '@Annabelle^' );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			getDocumentPositionStub.restore();
			editorViewportRectStub.restore();

			assert.areEqual( 10, ac.view.element.getSize( 'left' ), 'Horizontal position' );
			assert.areEqual( 20, ac.view.element.getSize( 'top' ), 'Vertical position' );

			ac.destroy();
		},

		// (#2030)
		'test limit view items': function() {
			var editor = this.editors.standard,
				itemsCount = 1,
				ac = new CKEDITOR.plugins.autocomplete( editor,
					CKEDITOR.tools.object.merge( configDefinition, { itemsLimit: itemsCount } ) );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			assertViewOpened( ac, true );
			assert.areEqual( itemsCount, ac.view.element.getChildCount() );

			ac.destroy();
		},

		// (#2108)
		'test dataCallback API': function() {
			var editor = this.editors.standard,
				ac = new CKEDITOR.plugins.autocomplete( editor, {
					textTestCallback: textTestCallback,
					dataCallback: function( matchInfo, callback ) {
						assert.areSame( 'text', matchInfo.query, 'matchInfo.query' );
						assert.isInstanceOf( CKEDITOR.dom.range, matchInfo.range, 'matchInfo.range' );
						assert.areSame( ac, matchInfo.autocomplete, 'matchInfo.autocomplete' );

						callback( [ { id: 1, name: 'textSample' } ] );
					}
				} );

			this.editorBots.standard.setHtmlWithSelection( '<p>text^ bar</p>' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			ac.destroy();
		},

		// (#2030)
		'test cycle through limited items': function() {
			var editor = this.editors.standard,
				editable = editor.editable(),
				itemsCount = 1,
				ac = new CKEDITOR.plugins.autocomplete( editor,
					CKEDITOR.tools.object.merge( configDefinition, { itemsLimit: itemsCount } ) );

			this.editorBots.standard.setHtmlWithSelection( '' );

			editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 40 } ) ); // ARROW DOWN

			assertViewOpened( ac, true );
			assert.areEqual( 1, ac.model.selectedItemId, 'Model selected item id' );
			assert.areEqual( 1, ac.view.selectedItemId, 'View selected item id' );

			ac.destroy();
		},

		// (#2114)
		'test initialize autocomplete before instanceReady': function() {
			var editor = CKEDITOR.replace( 'init' ),
				ac;

			editor.once( 'pluginsLoaded', function() {
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition );
			} );

			editor.on( 'instanceReady', function() {
				resume( function() {
					bender.tools.setHtmlWithSelection( editor, '' );
					editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
					assertViewOpened( ac, true );
					ac.destroy();
				} );
			} );

			wait();
		},

		// (#589)
		'test autocomplete is destroyed with editor': function() {
			var editor = CKEDITOR.replace( 'destroy' ),
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition ),
				spy = sinon.spy( ac, 'destroy' );

			editor.on( 'destroy', function() {
				setTimeout( function() {
					resume( function() {
						assert.isTrue( spy.called );
					} );
				} );
			} );

			editor.destroy();

			wait();
		},

		// (#2474)
		'test editor change event': function() {
			var editor = this.editors.standard,
				ac = new CKEDITOR.plugins.autocomplete( editor, configDefinition ),
				spy = sinon.spy( ac.view, 'updatePosition' );

			ac.model.setActive( true );

			editor.fire( 'change' );

			ac.destroy();

			assert.isFalse( spy.called );
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

	function textTestCallback( selectionRange ) {
		return { text: 'text', range: selectionRange };
	}

	function dataCallback( matchInfo, callback ) {
		return callback( [ { id: 1, name: 'item1' }, { id: 2, name: 'item2' }, { id: 3, name: 'item3' } ] );
	}

} )();
