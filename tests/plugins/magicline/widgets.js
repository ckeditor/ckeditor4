/* bender-tags: editor,unit,magicline */
/* bender-ckeditor-plugins: magicline,widget */

( function() {
	'use strict';

	var tools = widgetTestsTools,
		nestedTplAc = new CKEDITOR.template( '<div id="{id}" class="u">' +
			'<div class="nested">' +
				'<blockquote>u</blockquote>' +
			'</div>' +
		'</div>' ),
		nonEditTpl = new CKEDITOR.template( '<div id="{id}" class="w">' +
			'<div class="wa">wa</div>' +
			'<div class="wb">wb</div>' +
		'</div>' ),
		blockTpl = new CKEDITOR.template( '<div id="{id}" class="x"><p>x</p></div>' ),
		inlineTpl = new CKEDITOR.template( '<span id="{id}" class="y">y</span>' ),
		nestedTpl = new CKEDITOR.template( '<div id="{id}" class="z">' +
			'<div class="nested">' +
				'<div class="za">za</div>' +
				'<div class="zb">zb</div>' +
			'</div>' +
		'</div>' ),
		nestedTpl2 = new CKEDITOR.template( '<div id="{id}" class="z">' +
			'<div class="nested">' +
				'<p>foo</p>' +
			'</div>' +
		'</div>' +
		'<p>bar</p>' ),

		editor, doc;

	CKEDITOR.addCss(
		'body { margin: 0px; padding: 0px; } ' +
		'* { font-size: 0px !important; line-height: 0px !important; } ' +

		'div.x { background: green; overflow: hidden; height: 100px; } ' +
		'div.x > p { background: white; height: 50px; margin: 25px; } ' +

		'div.z { background: orange; overflow: hidden; height: 100px; } ' +
		'div.z > div { background: white; margin: 5px; } ' +
		'div.z > div > div { height: 45px; outline: 1px solid black; } ' +
		'div.z > div > .za { background: green; } '  +
		'div.z > div > .zb { background: violet; } ' +
		'div.z > div > p { height: 90px }' +

		'div.w { background: orange; overflow: hidden; height: 100px; } ' +
		'div.w > div { height: 50px; } ' +
		'div.w > .wa { background: violet; } ' +
		'div.w > .wb { background: green; } ' +

		'div.u { background: orange; overflow: hidden; height: 100px; } ' +
		'div.u > div { height: 100px; } ' +
		'div.u > div > blockquote { height: 100px; background: violet; } ' +

		'span.y { background: blue; overflow: hidden; display: block; height: 100px; width: 100px; } '
	);

	function w( id ) {
		return tools.getWidgetById( editor, id );
	}

	var widgets = {
			'u': {
				allowedContent: 'div[id](*){*}; blockquote',
				editables: {
					div: {
						selector: 'div.nested',
						allowedContent: 'blockquote'
					}
				},
				parts: {
					nested: 'div.nested'
				},
				upcast: function( el ) {
					if ( el.hasClass( 'u' ) )
						return el;
				}
			},
			// Block for testing non-editable internals.
			'w': {
				allowedContent: 'div[id](*){*};',
				upcast: function( el ) {
					if ( el.hasClass( 'w' ) )
						return el;
				}
			},
			// Plain block
			'x': {
				allowedContent: 'div[id](x){*}',
				editables: 'p',
				parts: {
					caption: 'p'
				},
				upcast: function( el ) {
					if ( el.hasClass( 'x' ) )
						return el;
				}
			},
			// Plain inline
			'y': {
				allowedContent: 'span[id](y){*}',
				upcast: function( el ) {
					if ( el.hasClass( 'y' ) )
						return el;
				}
			},
			// Block for testing nested editables
			'z': {
				allowedContent: 'div[id](*){*};',
				editables: {
					div: {
						selector: 'div.nested'
					}
				},
				parts: {
					nested: 'div.nested'
				},
				upcast: function( el ) {
					if ( el.hasClass( 'z' ) )
						return el;
				}
			}
		};

	bender.editor = {
		config: {
			height: 300,
			autoParagraph: false,
			extraAllowedContent: 'div strong[id]; hr',
			on: {
				instanceReady: function() {
					// Block for testing nested editables with
					// a very strict allowedContent.
					for ( var name in widgets ) {
						this.widgets.add( name, widgets[ name ] );
						this.filter.allow( widgets[ name ].allowedContent );
					}

				}
			}
		}
	};

	function t( html, cfg ) {
		return function() {
			editor = this.editorBot.editor;
			doc = editor.document;

			var backdoor = editor.plugins.magicline.backdoor;

			this.editorBot.setData( html, function() {
				if ( cfg.that.element )
					cfg.that.element = cfg.that.element();

				CKEDITOR.tools.extend( backdoor.that, cfg.that, true );

				var trigger = backdoor[ cfg.trigger.name ]( backdoor.that );

				if ( typeof cfg.trigger.upper != 'undefined' && typeof cfg.trigger.lower != 'undefined' ) {
					assert.isObject( trigger, 'Trigger should be returned' );

					if ( cfg.trigger.upper )
						assert.isTrue( cfg.trigger.upper().equals( trigger.upper ), 'Upper element matches.' );
					else
						assert.isNull( trigger.upper, 'Upper element doesn\'t exist' );

					if ( cfg.trigger.lower )
						assert.isTrue( cfg.trigger.lower().equals( trigger.lower ), 'Lower element matches' );
					else
						assert.isNull( trigger.lower, 'Lower element doesn\'t exist' );

				} else
					assert.isNull( trigger, 'No valid trigger should be returned' );
			} );
		}
	}

	function c( html, cfg ) {
		return function() {
			editor = this.editorBot.editor;
			doc = editor.document;

			var backdoor = editor.plugins.magicline.backdoor;

			this.editorBot.setData( html, function() {
				var widget = cfg.widget();
				widget.focus();

				var range = editor.createRange();
				cfg.selection( widget, range );
				range.select();

				editor.execCommand( cfg.command );

				assert.isTrue( cfg.hotNode( widget ).equals( backdoor.that.hotNode ), 'A correct space must be accessed.' );
			} );
		}
	}

	bender.test( {
		_should : {
			// FF inserts bogus before a widget so these tests
			// are broken and make no sense.
			ignore: CKEDITOR.env.gecko ?
					{
						'test block, editable[top] - widget as first child': true,
						'test block, edge[top] - widget as first child': true,
						'test non-editable, edge[top] - first child': true
					}
				:
					null
		},

		'test block, editable[top] - widget as first child': t( blockTpl.output( { id: 'x' } ), {
			that: {
				mouse: { x: 10, y: 10 }
			},
			trigger: {
				name: 'triggerEditable',
				upper: null,
				lower: function() {
					return w( 'x' ).wrapper;
				}
			}
		} ),
		'test block, editable[bottom] - widget as last child': t( blockTpl.output( { id: 'x' } ), {
			that: {
				mouse: { x: 10, y: 150 }
			},
			trigger: {
				name: 'triggerEditable',
				upper: function() {
					return w( 'x' ).wrapper;
				},
				lower: null
			}
		} ),
		'test block, edge[top] - widget as first child': t( blockTpl.output( { id: 'x' } ), {
			that: {
				mouse: { x: 10, y: 10 },
				element: function() {
					return w( 'x' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge',
				upper: null,
				lower: function() {
					return w( 'x' ).wrapper;
				}
			}
		} ),
		'test block, edge[bottom] - widget as last child': t( blockTpl.output( { id: 'x' } ), {
			that: {
				mouse: { x: 10, y: 90 },
				element: function() {
					return w( 'x' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge',
				upper: function() {
					return w( 'x' ).wrapper;
				},
				lower: null
			}
		} ),
		'test block, edge[top] - block before widget': t( '<div id="y">y</div>' + blockTpl.output( { id: 'x' } ), {
			that: {
				mouse: { x: 10, y: 10 },
				element: function() {
					return w( 'x' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge',
				upper: function() {
					return doc.getById( 'y' );
				},
				lower: function() {
					return w( 'x' ).wrapper;
				}
			}
		} ),
		'test block, edge[bottom] - block after widget': t( blockTpl.output( { id: 'x' } ) + '<div id="y">y</div>', {
			that: {
				mouse: { x: 10, y: 90 },
				element: function() {
					return w( 'x' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge',
				upper: function() {
					return w( 'x' ).wrapper;
				},
				lower: function() {
					return doc.getById( 'y' );
				}
			}
		} ),
		'test block, edge[top] - inline before widget': t( '<strong>y</strong>' + blockTpl.output( { id: 'x' } ), {
			that: {
				mouse: { x: 10, y: 10 },
				element: function() {
					return w( 'x' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge'
			}
		} ),
		'test block, edge[bottom] - inline after widget': t( blockTpl.output( { id: 'x' } ) + '<strong>y</strong>', {
			that: {
				mouse: { x: 10, y: 90 },
				element: function() {
					return w( 'x' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge'
			}
		} ),
		'test block, edge[bottom] - two widgets': t( blockTpl.output( { id: 'x' } ) + blockTpl.output( { id: 'y' } ), {
			that: {
				mouse: { x: 10, y: 90 },
				element: function() {
					return w( 'x' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge',
				upper: function() {
					return w( 'x' ).wrapper;
				},
				lower: function() {
					return w( 'y' ).wrapper;
				}
			}
		} ),
		'test block, expand - two widgets': t( blockTpl.output( { id: 'x' } ) + blockTpl.output( { id: 'y' } ), {
			that: {
				mouse: { x: 100, y: 120 },
				element: function() {
					var x = w( 'x' ),
						y = w( 'y' );

					x.wrapper.setStyle( 'margin-bottom', '50px' );
					y.wrapper.setStyle( 'margin-top', '50px' );

					return doc.getBody();
				}
			},
			trigger: {
				name: 'triggerExpand',
				upper: function() {
					return w( 'x' ).wrapper;
				},
				lower: function() {
					return w( 'y' ).wrapper;
				}
			}
		} ),

		// --- INLINE ----------------------------------------------------------------------------------------------------

		'test inline, editable[top] - widget as first child': t( inlineTpl.output( { id: 'y' } ), {
			that: {
				mouse: { x: 20, y: 20 }
			},
			trigger: {
				name: 'triggerEditable'
			}
		} ),
		'test inline, editable[bottom] - widget as last child': t( inlineTpl.output( { id: 'y' } ), {
			that: {
				mouse: { x: 20, y: 120 }
			},
			trigger: {
				name: 'triggerEditable'
			}
		} ),
		'test inline, edge[top] - widget as first child': t( inlineTpl.output( { id: 'y' } ), {
			that: {
				mouse: { x: 10, y: 10 },
				element: function() {
					return w( 'y' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge'
			}
		} ),
		'test inline, edge[bottom] - widget as last child': t( inlineTpl.output( { id: 'y' } ), {
			that: {
				mouse: { x: 10, y: 90 },
				element: function() {
					return w( 'y' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge'
			}
		} ),
		'test inline, edge[top] - block before widget': t( '<div>x</div>' + inlineTpl.output( { id: 'y' } ), {
			that: {
				mouse: { x: 10, y: 10 },
				element: function() {
					return w( 'y' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge'
			}
		} ),
		'test inline, edge[bottom] - block after widget': t( inlineTpl.output( { id: 'y' } ) + '<div>x</div>', {
			that: {
				mouse: { x: 10, y: 90 },
				element: function() {
					return w( 'y' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge'
			}
		} ),
		'test inline, edge[top] - inline before widget': t( '<strong>x</strong>' + inlineTpl.output( { id: 'y' } ), {
			that: {
				mouse: { x: 10, y: 10 },
				element: function() {
					return w( 'y' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge'
			}
		} ),
		'test inline, edge[bottom] - inline after widget': t( inlineTpl.output( { id: 'y' } ) + '<strong>x</strong>', {
			that: {
				mouse: { x: 10, y: 90 },
				element: function() {
					return w( 'y' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge'
			}
		} ),
		'test inline, edge[bottom] - two widgets': t( inlineTpl.output( { id: 'x' } ) + inlineTpl.output( { id: 'y' } ), {
			that: {
				mouse: { x: 10, y: 90 },
				element: function() {
					return w( 'x' ).element;
				}
			},
			trigger: {
				name: 'triggerEdge'
			}
		} ),
		'test inline, expand - two widgets': t( inlineTpl.output( { id: 'x' } ) + inlineTpl.output( { id: 'y' } ), {
			that: {
				mouse: { x: 10, y: 120 },
				element: function() {
					var widget = w( 'x' );

					widget.wrapper.setStyles( {
						display: 'block',
						'margin-bottom': '50px'
					} );

					return widget;
				}
			},
			trigger: {
				name: 'triggerExpand'
			}
		} ),

		// --- NESTED EDITABLES ----------------------------------------------------------------------------------------

		'test nested, edge[top] - first child': t( nestedTpl.output( { id: 'z' } ), {
			that: {
				mouse: { x: 10, y: 10 },
				element: function() {
					return w( 'z' ).parts.nested.getFirst();
				}
			},
			trigger: {
				name: 'triggerEdge',
				upper: null,
				lower: function() {
					return w( 'z' ).parts.nested.getFirst();
				}
			}
		} ),
		'test nested, edge[bottom] - last child': t( nestedTpl.output( { id: 'z' } ), {
			that: {
				mouse: { x: 10, y: 90 },
				element: function() {
					return w( 'z' ).parts.nested.getLast();
				}
			},
			trigger: {
				name: 'triggerEdge',
				upper: function() {
					return w( 'z' ).parts.nested.getLast();
				},
				lower: null
			}
		} ),
		'test nested, edge[bottom] - two blocks': t( nestedTpl.output( { id: 'z' } ), {
			that: {
				mouse: { x: 10, y: 40 },
				element: function() {
					return w( 'z' ).parts.nested.getFirst();
				}
			},
			trigger: {
				name: 'triggerEdge',
				upper: function() {
					return w( 'z' ).parts.nested.getFirst();
				},
				lower: function() {
					return w( 'z' ).parts.nested.getLast();
				}
			}
		} ),
		'test nested, edge[bottom] - nested editable as a last child': t( nestedTpl2.output( { id: 'z' } ), {
			that: {
				mouse: { x: 10, y: 90 },
				element: function() {
					return w( 'z' ).parts.nested;
				}
			},
			trigger: {
				name: 'triggerEdge'
			}
		} ),
		'test nested, expand - two blocks in nested': t( nestedTpl.output( { id: 'z' } ), {
			that: {
				mouse: { x: 10, y: 50 },
				element: function() {
					var nested = w( 'z' ).parts.nested,
						first = nested.getFirst(),
						last = nested.getLast();

					first.setStyle( 'height', '20px' );
					last.setStyle( 'height', '20px' );
					first.setStyle( 'margin-bottom', '50px' );
					last.setStyle( 'margin-top', '50px' );

					return nested;
				}
			},
			trigger: {
				name: 'triggerExpand',
				upper: function() {
					return w( 'z' ).parts.nested.getFirst();
				},
				lower: function() {
					return w( 'z' ).parts.nested.getLast();
				}
			}
		} ),

		// --- NON EDITABLE ----------------------------------------------------------------------------------------

		'test non-editable, edge[top] - first child': t( nonEditTpl.output( { id: 'w' } ), {
			that: {
				mouse: { x: 10, y: 10 },
				element: function() {
					return w( 'w' ).element.getFirst();
				}
			},
			trigger: {
				name: 'triggerEdge',
				upper: null,
				lower: function() {
					return w( 'w' ).wrapper;
				}
			}
		} ),
		'test non-editable, edge[bottom] - block after block': t( nonEditTpl.output( { id: 'w' } ), {
			that: {
				mouse: { x: 10, y: 40 },
				element: function() {
					return w( 'w' ).element.getFirst();
				}
			},
			trigger: {
				name: 'triggerEdge'
			}
		} ),
		'test non-editable, edge[top] - block before block': t( nonEditTpl.output( { id: 'w' } ), {
			that: {
				mouse: { x: 10, y: 60 },
				element: function() {
					return w( 'w' ).element.getLast();
				}
			},
			trigger: {
				name: 'triggerEdge'
			}
		} ),
		'test non-editable, edge[bottom] - last child': t( nonEditTpl.output( { id: 'w' } ), {
			that: {
				mouse: { x: 10, y: 90 },
				element: function() {
					return w( 'w' ).element.getLast();
				}
			},
			trigger: {
				name: 'triggerEdge',
				upper: function() {
					return w( 'w' ).wrapper;
				},
				lower: null
			}
		} ),
		'test non-editable, expand[bottom] - block after block': t( nonEditTpl.output( { id: 'w' } ), {
			that: {
				mouse: { x: 10, y: 40 },
				element: function() {
					return w( 'w' ).element.getFirst();
				}
			},
			trigger: {
				name: 'triggerExpand'
			}
		} ),
		'test non-editable, expand[top] - block before block': t( nonEditTpl.output( { id: 'w' } ), {
			that: {
				mouse: { x: 10, y: 60 },
				element: function() {
					return w( 'w' ).element.getLast();
				}
			},
			trigger: {
				name: 'triggerExpand'
			}
		} ),

		// --- COMMANDS ------------------------------------------------------------------------------------

		'test commands[previous], first block in nested': c( nestedTpl.output( { id: 'z' } ), {
			widget: function() {
				return w( 'z' );
			},
			selection: function( widget, range ) {
				var za = widget.parts.nested.getFirst();

				// "<div class="za">z^a</div>"
				range.setStart( za.getFirst(), 1 );
				range.collapse();
			},
			command: 'accessPreviousSpace',
			hotNode: function( widget ) {
				return widget.parts.nested.getChild( 0 );
			}
		} ),
		'test commands[next], block after block in nested': c( nestedTpl.output( { id: 'z' } ), {
			widget: function() {
				return w( 'z' );
			},
			selection: function( widget, range ) {
				var za = widget.parts.nested.getFirst();

				// "<div class="za">z^a</div>"
				range.setStart( za.getFirst(), 1 );
				range.collapse();
			},
			command: 'accessNextSpace',
			hotNode: function( widget ) {
				return widget.parts.nested.getChild( 1 );
			}
		} ),
		'test commands[previous], block before block in nested': c( nestedTpl.output( { id: 'z' } ), {
			widget: function() {
				return w( 'z' );
			},
			selection: function( widget, range ) {
				var zb = widget.parts.nested.getLast();

				// "<div class="zb">z^b</div>"
				range.setStart( zb.getFirst(), 1 );
				range.collapse();
			},
			command: 'accessPreviousSpace',
			hotNode: function( widget ) {
				return widget.parts.nested.getChild( 1 );
			}
		} ),
		'test commands[next], last block in nested': c( nestedTpl.output( { id: 'z' } ), {
			widget: function() {
				return w( 'z' );
			},
			selection: function( widget, range ) {
				var zb = widget.parts.nested.getLast();

				// "<div class="zb">z^b</div>"
				range.setStart( zb.getFirst(), 1 );
				range.collapse();
			},
			command: 'accessNextSpace',
			hotNode: function( widget ) {
				return widget.parts.nested.getChild( 2 );
			}
		} ),
		'test commands[previous], access before widget': c( '<div>q</div>' + nestedTpl.output( { id: 'z' } ), {
			widget: function() {
				return w( 'z' );
			},
			selection: function( widget, range ) {
				var nested = widget.parts.nested;

				nested.setHtml( 'y' );

				// "<div class="nested">^y</div>"
				range.setStart( nested, 0 );
				range.collapse();
			},
			command: 'accessPreviousSpace',
			hotNode: function( widget ) {
				return widget.wrapper.getPrevious();
			}
		} ),
		'test commands[next], access after widget': c( nestedTpl.output( { id: 'z' } ), {
			widget: function() {
				return w( 'z' );
			},
			selection: function( widget, range ) {
				var nested = widget.parts.nested;

				nested.setHtml( 'y' );

				// "<div class="nested">^y</div>"
				range.setStart( nested, 0 );
				range.collapse();
			},
			command: 'accessNextSpace',
			hotNode: function( widget ) {
				return widget.wrapper.getNext();
			}
		} ),

		/* See #12474

		// --- ACF in nested ------------------------------------------------------------------------------------

		'test ACF command[next], out of widget': c( nestedTplAc.output( { id: 'u' } ), {
			widget: function() {
				return w( 'u' );
			},
			selection: function( widget, range ) {
				var nested = widget.parts.nested;

				nested.setHtml( 'x' );

				range.setStart( nested, 0 );
				range.collapse();
			},
			command: 'accessNextSpace',
			hotNode: function( widget ) {
				var hotNode = widget.wrapper.getNext();

				assert.areSame( 'p', hotNode.getName(), 'Node must be P.' );

				return hotNode;
			}
		} ),

		'test ACF command[next], inside widget': c( nestedTplAc.output( { id: 'u' } ), {
			widget: function() {
				return w( 'u' );
			},
			selection: function( widget, range ) {
				var nested = widget.parts.nested,
					blockquote = nested.getFirst();

				// "<blockquote>^u</blockquote>"
				range.setStart( blockquote, 0 );
				range.collapse();
			},
			command: 'accessNextSpace',
			hotNode: function( widget ) {
				var hotNode = widget.parts.nested.getChild( 1 );

				assert.areSame( 'br', hotNode.getName(), 'Node must be BR.' );

				return hotNode;
			}
		} )

		*/
	} );
} )();