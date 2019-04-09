/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,widgetselection,toolbar,clipboard */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				allowedContent: true
			}
		},
		divarea: {
			config: {
				allowedContent: true,
				extraPlugins: 'divarea'
			}
		}
	};

	var tests = {
		// (#2517) (#3007)
		'test selection when starts at the end of a widget': assertSelection( {
				initial: '<div contenteditable="false"><div>FakeWidget</div>[</div>foo]',
				expected: '<div contenteditable="false"><div>FakeWidget</div></div>[foo]'
			} ),
		// (#2517) (#3007)
		'test selection when starts at the beginning of a widget': assertSelection( {
				initial: '<div contenteditable="false">[<div>FakeWidget</div></div>foo]',
				expected: '[<div contenteditable="false"><div>FakeWidget</div></div>foo]'
			} ),
		// (#2517) (#3007)
		'test selection when ends at the beginning of a widget': assertSelection( {
				initial: '[foo<div contenteditable="false">]<div>FakeWidget</div></div>',
				expected: '[foo]<div contenteditable="false"><div>FakeWidget</div></div>'
			} ),
		// (#2517) (#3007)
		'test selection when ends at the end of a widget': assertSelection( {
				initial: '[foo<div contenteditable="false"><div>FakeWidget</div>]</div>',
				expected: '[foo<div contenteditable="false"><div>FakeWidget</div></div>]'
			} ),
		// (#2517) (#3007)
		'test selection when starts at the end and ends at the beginning of a widget': assertSelection( {
				initial: '<div contenteditable="false"><div>FakeWidget</div>[</div>foo<div contenteditable="false">]<div>FakeWidget</div></div>',
				expected: '<div contenteditable="false"><div>FakeWidget</div></div>[foo]<div contenteditable="false"><div>FakeWidget</div></div>'
			} ),
		// (#2517) (#3007)
		'test selection when starts at the beginning and ends at the end of a widget': assertSelection( {
				initial: '<div contenteditable="false">[<div>FakeWidget</div></div>foo<div contenteditable="false"><div>FakeWidget</div>]</div>',
				expected: '[<div contenteditable="false"><div>FakeWidget</div></div>foo<div contenteditable="false"><div>FakeWidget</div></div>]'
			} ),
		// (#2517) (#3007)
		'test selection when starts in the drag handler': assertSelection( {
				initial: '<div contenteditable="false">' +
					'<figure><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" /><figcaption>caption</figcaption></figure>' +
					'<span><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" />[</span></div>foo]',
				expected: '<div contenteditable="false">' +
					'<figure><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" /><figcaption>caption</figcaption></figure>' +
					'<span><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" /></span></div>[foo]'
			} ),
		// (#3008)
		'test selection when starts in the nested editable': assertSelection( {
				initial: '<div contenteditable="false">' +
					'<figure><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" /><figcaption contenteditable="true">[caption</figcaption></figure>' +
					'</div>foo]',
				expected: '<div contenteditable="false">' +
					'<figure><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" /><figcaption contenteditable="true">caption</figcaption></figure>' +
					'</div>[foo]'
			} )
	};

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );

	function assertSelection( options ) {
		return function( editor, bot ) {
			bot.setHtmlWithSelection( options.initial );

			var filter = new CKEDITOR.htmlParser.filter( {
						text: function( value ) {
							return value.replace( '{', '[' ).replace( '}', ']' );
						}
					} ),
				elements = [],
				wrappers = [],
				current, fakeWidget;

			filter.addRules( {
				elements: {
					br: remove
				},
				attributes: {
					'class': remove,
					'data-cke-widget': remove,
					'data-cke-widget-wrapper': remove,
					'data-cke-widget-id': remove
				}

			}, { applyToAll: true } ); // Options can be added only via `addRules`.

			current = bender.tools.compatHtml( bender.tools.selection.getWithHtml( editor ), true, true, true, true, true, true, [ filter ] );

			if ( current.replace( '{', '[' ) !== options.initial ) {
				// Browser can't create tested selection.
				assert.ignore();
			}

			// Mock widgets.
			editor.editable().forEach( function( node ) {
				if ( node.type === CKEDITOR.NODE_TEXT ) {
					return;
				}
				if ( node.getHtml().replace( '<br>', '' ) === 'FakeWidget' ) {
					node.data( 'cke-widget', 'true' );
					elements.push( node );
				} else if ( node.getAttribute( 'contenteditable' ) === 'false' ) {
					node.data( 'cke-widget-wrapper', 'true' );
					node.data( 'cke-widget-id', wrappers.length + 1 );
					wrappers.push( node );
				}
			} );

			createFakeWidget( 0 );
			editor.widgets.instances = {
				1: fakeWidget
			};

			if ( elements[ 1 ] ) {
				createFakeWidget( 1 );
				editor.widgets.instances[ 2 ] = fakeWidget;
			}

			editor.fire( 'selectionChange', {
				selection: editor.getSelection(),
				path: editor.elementPath()
			} );

			assert.beautified.html( options.expected, bender.tools.selection.getWithHtml( editor ), { customFilters: [ filter ] } );

			function createFakeWidget( index ) {
				fakeWidget = CKEDITOR.tools.copy( CKEDITOR.plugins.widget.prototype );
				fakeWidget.element = elements[ index ];
				fakeWidget.wrapper = wrappers[ index ];
			}

			function remove() {
				return false;
			}
		};
	}
} )();
