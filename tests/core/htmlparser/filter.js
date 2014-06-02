/* bender-tags: editor,unit */

'use strict';

function assertFilter( expectedOutput, input, filter, msg, method ) {
	var writer = new CKEDITOR.htmlParser.basicWriter(),
		fragment;

	fragment = CKEDITOR.htmlParser.fragment.fromHtml( input );

	// Argument msg is optional.
	if ( msg == 'applyTo' || msg == 'write' ) {
		method = msg;
		msg = null;
	} else if ( !method )
		method = 'applyTo';

	if ( method == 'write' )
		fragment.writeHtml( writer, filter );
	else {
		filter.applyTo( fragment );
		fragment.writeHtml( writer );
	}

	assert.areEqual( expectedOutput, writer.getHtml( true ), '[' + method + '] ' + ( msg || '' ) );
}

function addNormalAndNonEditableRules( filter ) {
	filter.addRules( {
		root: function( el ) {
			if ( el.type == CKEDITOR.NODE_ELEMENT )
				el.attributes.roote = '1';
		},
		elements: {
			$: function( el ) {
				el.attributes.ax = '1';
			}
		},
		attributeNames: [
			[ /^a$/, 'ay' ]
		],
		elementNames: [
			[ /^(n:)?p$/, '$1e:p' ]
		],
		text: function( value ) {
			return value + 'E';
		}
	} );

	filter.addRules( {
		root: function( el ) {
			if ( el.type == CKEDITOR.NODE_ELEMENT )
				el.attributes.rootn = '1';
		},
		elements: {
			$: function( el ) {
				el.attributes.bx = '1';
			}
		},
		attributeNames: [
			[ /^b$/, 'by' ]
		],
		elementNames: [
			[ /^(e:)?p$/, '$1n:p' ]
		],
		text: function( value ) {
			return value + 'N';
		}
	}, {
		applyToAll: true
	} );
}

bender.test( {
	'test addRules with priorieties': function() {
		var filter = new CKEDITOR.htmlParser.filter(),
			order = [];

		filter.addRules( {
			text: function( value ) {
				return value + '-default1';
			}
		} );

		filter.addRules( {
			text: function( value ) {
				return value + '-100';
			}
		}, { priority: 100 } );

		filter.addRules( {
			text: function( value ) {
				return value + '-1';
			}
		}, { priority: 1 } );

		filter.addRules( {
			text: function( value ) {
				return value + '-default2';
			}
		} );

		assertFilter( '<p>foo-1-default1-default2-100</p>', '<p>foo</p>', filter, 'Rules were applied in correct order' );
		assertFilter( '<p>foo-1-default1-default2-100</p>', '<p>foo</p>', filter, 'Rules were applied in correct order', 'write' );
	},

	'test addRules with priorieties - same priorities': function() {
		var filter = new CKEDITOR.htmlParser.filter(),
			order = [];

		filter.addRules( {
			elements: {
				p: function( element ) {
					element.attributes.order += '1';
				}
			}
		}, { priority: 100 } );

		filter.addRules( {
			elements: {
				p: function( element ) {
					element.attributes.order += '2';
				}
			}
		}, { priority: 100 } );

		filter.addRules( {
			elements: {
				p: function( element ) {
					element.attributes.order += '3';
				}
			}
		}, { priority: 100 } );

		assertFilter( '<p order="0123">foo</p>', '<p order="0">foo</p>', filter, 'Rules were applied in correct order' );
	},

	'test addRules with priorieties - backward compatibility': function() {
		var filter = new CKEDITOR.htmlParser.filter(),
			order = [];

		filter.addRules( {
			text: function( value ) {
				return value + '-default1';
			}
		} );

		filter.addRules( {
			text: function( value ) {
				return value + '-100';
			}
		}, 100 );

		filter.addRules( {
			text: function( value ) {
				return value + '-1';
			}
		}, 1 );

		filter.addRules( {
			text: function( value ) {
				return value + '-default2';
			}
		} );

		assertFilter( '<p>foo-1-default1-default2-100</p>', '<p>foo</p>', filter, 'Rules were applied in correct order' );
		assertFilter( '<p>foo-1-default1-default2-100</p>', '<p>foo</p>', filter, 'Rules were applied in correct order', 'write' );
	},

	'test text rules': function() {
		var filter = new CKEDITOR.htmlParser.filter();
		filter.addRules( {
			text: function( value ) {
				return 'bar';
			}
		} );

		filter.addRules( {
			text: function( value ) {
				assert.areSame( 'bar', value );
				return value;
			}
		} );

		assertFilter( '<p>bar<b>bar</b></p>', '<p>foo <b>foo foo</b></p>', filter );
		assertFilter( '<p>bar<b>bar</b></p>', '<p>foo <b>foo foo</b></p>', filter, 'write' );
	},

	'test attributeNames rules': function() {
		var filter = new CKEDITOR.htmlParser.filter();
		filter.addRules( {
			attributeNames: [
				[ 'foo', 'bar' ],
				[ /^on/, 'data-on' ],
				[ /ignore-.*/, '' ]
			]
		} );

		assertFilter( '<p>A</p><p><b>B</b></p>', '<p>A</p><p><b>B</b></p>', filter );
		assertFilter( '<p>A</p><p><b>B</b></p>', '<p>A</p><p><b>B</b></p>', filter, 'write' );

		// First transformation will be applied 2 times. This is consistent with elementNames rule behaviour,
		// and it's caused by IEs behaviour (see element#filter).
		assertFilter( '<p bar="1">A</p><p><b barbar="foo">B</b></p>', '<p foo="1">A</p><p><b foofoo="foo">B</b></p>', filter );

		assertFilter( '<p data-onmouse="foo" data-onkey="bar">A</p>', '<p onmouse="foo" onkey="bar">A</p>', filter );

		assertFilter( '<p>A</p>', '<p ignore-foo="bar">A</p>', filter );

		assertFilter( '<p bar="1">A</p>', '<p ignore-foo="bar" foo="1">A</p>', filter );
	},

	'test elementNames rules': function() {
		var filter = new CKEDITOR.htmlParser.filter();
		filter.addRules( {
			elementNames: [
				[ 'foo', 'bar' ],
				[ /^cke:?/, '' ]
			]
		} );

		assertFilter( '<bar>A</bar><barbar>B</barbar>', '<foo>A</foo><foofoo>B</foofoo>', filter );
		assertFilter( '<bar>A</bar><barbar>B</barbar>', '<foo>A</foo><foofoo>B</foofoo>', filter, 'write' );
		assertFilter( '<bar>A</bar><bar>C</bar>', '<cke:bar>A</cke:bar><cke>B</cke><cke:foo>C</cke:foo>', filter );

		filter = new CKEDITOR.htmlParser.filter();
		filter.addRules( {
			elementNames: [
				[ 'c', 'x' ], // 3rd change
				[ 'a', 'b' ], // 1st change
				[ 'b', 'c' ]  // 2nd change
			]
		} );

		assertFilter( '<x>A</x><x>B</x>', '<a>A</a><b>B</b>', filter, 'All modifiers creating chain are applied.' );
	},

	'test attributes': function() {
		var filter = new CKEDITOR.htmlParser.filter();
		filter.addRules( {
			attributes: {
				foo: function( value, element ) {
					assert.areSame( 'bar', value );
					assert.areSame( 'p', element.name );

					element.attributes.added = 1;

					return 'bum';
				}
			}
		} );
		filter.addRules( {
			attributes: {
				foo: function( value, element ) {
					assert.areSame( 'bum', value, 'Updated value was passed to the next filter' );

					return value;
				}
			}
		} );

		assertFilter( '<p foo="bum" added="1">A</p>', '<p foo="bar">A</p>', filter );
		assertFilter( '<p foo="bum" added="1">A</p>', '<p foo="bar">A</p>', filter, 'write' );
	},

	'test attributes - return false or undefined': function() {
		var filter = new CKEDITOR.htmlParser.filter();
		filter.addRules( {
			attributes: {
				foo: function( value, element ) {
					if ( value == 'bom' )
						return false;
				}
			}
		} );
		filter.addRules( {
			attributes: {
				foo: function( value, element ) {
					assert.areSame( 'bum', value, 'Attribute "bom" was removed, so don\'t pass it to next filters' );
					return value;
				}
			}
		} );

		assertFilter( '<p foo="bum">A</p>', '<p foo="bum">A</p>', filter, 'Returning undefined should not change the attribute' );
		assertFilter( '<p>A</p>', '<p foo="bom">A</p>', filter, 'Returning false should remove attribute completely' );
	},

	'test elements': function() {
		var filter = new CKEDITOR.htmlParser.filter();
		filter.addRules( {
			elements: {
				p: function( element ) {
					assert.areSame( 'bar', element.attributes.foo );
					assert.areSame( 'true', element.attributes.id );

					element.name = 'div';
					delete element.attributes.id;
					element.attributes.foo = 'bum';
					element.attributes[ 'class' ] = 'red';
				},

				b: function() {
					return false;
				},

				i: function( element ) {
					delete element.name;
				}
			}
		} );

		assertFilter( '<div foo="bum" class="red">A</div>', '<p foo="bar" id="true">A</p>', filter );
		assertFilter( '<div foo="bum" class="red">A</div>', '<p foo="bar" id="true">A</p>', filter, 'write' );
		assertFilter( '<div>BC</div>', '<div><b>A</b>B<i>C</i></div>', filter );
	},

	'test comments': function() {
		var filter = new CKEDITOR.htmlParser.filter();
		filter.addRules( {
			comment: function( value ) {
				return value + ' bar';
			}
		} );

		assertFilter( '<p>A</p><!--foo bar--><p>B</p>', '<p>A</p><!--foo--><p>B</p>', filter );
	},

	'test comments 2': function() {
		var filter = new CKEDITOR.htmlParser.filter();
		filter.addRules( {
			comment: function( value ) {
				return CKEDITOR.htmlParser.fragment.fromHtml( value, 'div' );
			},

			elements: {
				// Test if filter will be applied to new element and its ascendant (next <p>).
				$: function( element ) {
					element.attributes.x = '1';
				}
			}
		} );

		assertFilter( '<p x="1">A</p><div x="1">foo</div><p x="1">B</p>', '<p>A</p><!--foo--><p>B</p>', filter );
	},

	// Test applying filter rules of duplicate name.
	'test filter rules same name': function() {
		var filter = new CKEDITOR.htmlParser.filter();
		filter.addRules( {
			elements: {
				div: function( element ) {
					assert.areSame( CKEDITOR.NODE_ELEMENT, element.type );
					assert.areSame( 'div', element.name );
					element.name = 'span';
					return element;
				}
			},
			attributes: {
				'class': function( attrValue ) {
					assert.areSame( 'class1', attrValue );
					return 'class2';
				}
			},
			text: function( value ) {
				assert.areSame( 'some text', value );
				return 'some other text';
			}
		} );

		filter.addRules( {
			elements: {
				div: function( element ) {
					assert.fail( 'This filter should not be applied.' );
				}
			},
			attributes: {
				'class': function( attrValue ) {
					assert.areSame( 'class2', attrValue );
					return attrValue;
				}
			},
			text: function( text ) {
				assert.areSame( 'some other text', text );
				return text;
			}
		} );

		assertFilter( '<span class="class2">some other text</span>', '<div class="class1">some text</div>', filter );
	},

	'test element filters - wildcard': function() {
		var filter = new CKEDITOR.htmlParser.filter(),
			order = 1;

		filter.addRules( {
			elements: {
				'^': function( element ) {
					element.attributes[ 'data-^' ] = order++;
				},
				'$': function( element, attrs ) {
					element.attributes[ 'data-$' ] = order++;
				},
				'p': function( element ) {
					element.attributes[ 'data-p' ] = order++;
				}
			}
		} );


		assertFilter( '<p data-^="1" data-p="2" data-$="3"><span data-^="4" data-$="5">foo</span></p>',
			'<p><span>foo</span></p>', filter,
			'Applying wildcard element filters failed.' );
	},

	'test root filter': function() {
		var els = [];

		var filter = new CKEDITOR.htmlParser.filter();
		filter.addRules( {
			root: function( el ) {
				els.push( el.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? '#frag' : el.name );

				if ( el.type == CKEDITOR.NODE_ELEMENT )
					el.attributes[ 'data-filtered' ] = 1;
			}
		} );

		var source = '<p><span>foo</span></p>',
			writer = new CKEDITOR.htmlParser.basicWriter(),
			fragment;

		// Parse without any context.
		fragment = CKEDITOR.htmlParser.fragment.fromHtml( source );

		fragment.writeHtml( writer, filter );
		assert.areEqual( 1, els.length );
		assert.areEqual( '<p><span>foo</span></p>', writer.getHtml( true ) );

		// Write children, with root filter applied.
		fragment.writeChildrenHtml( writer, filter, true );
		assert.areEqual( 2, els.length );
		assert.areEqual( '<p><span>foo</span></p>', writer.getHtml( true ) );

		// Write children, without root filter.
		fragment.writeChildrenHtml( writer, filter );
		arrayAssert.itemsAreEqual( [ '#frag', '#frag' ], els, 'Applying root filter failed.' );
		assert.areEqual( '<p><span>foo</span></p>', writer.getHtml( true ) );


		// Clean up.
		els = [];

		// Parse with a "div" context.
		fragment = CKEDITOR.htmlParser.fragment.fromHtml( source, 'div' );

		fragment.writeHtml( writer, filter );
		assert.areEqual( 1, els.length );
		assert.areEqual( '<div data-filtered="1"><p><span>foo</span></p></div>', writer.getHtml( true ) );

		// Write children, with root filter applied.
		fragment.writeChildrenHtml( writer, filter, true );
		assert.areEqual( 2, els.length );
		assert.areEqual( '<p><span>foo</span></p>', writer.getHtml( true ) );

		// Write children, without root filter.
		fragment.writeChildrenHtml( writer, filter );
		arrayAssert.itemsAreEqual( [ 'div', 'div' ], els, 'Applying root filter failed.' );
		assert.areEqual( '<p><span>foo</span></p>', writer.getHtml( true ) );
	},

	'test bottom-up filtering': function() {
		var filter = new CKEDITOR.htmlParser.filter(),
			order = 1,
			els = [];

		filter.addRules( {
			elements: {
				p: function( element ) {
					element.filterChildren( filter );
				},

				$: function( element ) {
					els.push( element.name );
					element.attributes.o = order++;
				}
			},

			text: function( value ) {
				els.push( '#' + value );
				return value;
			}
		} );

		assertFilter( '<div o="1"><p o="5"><b o="2">A</b><i o="3">B<u o="4">C</u></i></p></div>',
			'<div><p><b>A</b><i>B<u>C</u></i></p></div>', filter );

		arrayAssert.itemsAreEqual( [ 'div', 'b', '#A', 'i', '#B', 'u', '#C', 'p' ], els );
	},

	'test multiple filters': function() {
		var filter1 = new CKEDITOR.htmlParser.filter(),
			filter2 = new CKEDITOR.htmlParser.filter(),
			filter3 = new CKEDITOR.htmlParser.filter();

		filter1.addRules( {
			text: function( value ) {
				return value + 'f1';
			},

			elements: {
				p: function( element ) {
					element.attributes.f1 = '1';
					delete element.attributes.id;
				},
				b: function( element ) {
					delete element.name;
				},
				i: function( element ) {
					return false;
				}
			}
		} );

		filter2.addRules( {
			attributeNames: [
				[ /^f/, 'a' ]
			],

			text: function( value ) {
				return value + 'f2';
			},

			elements: {
				b: function( element ) {
					assert.fail( 'Element <b> should have been removed by previous filter.' );
				},
				i: function( element ) {
					assert.fail( 'Element <i> should have been removed by previous filter.' );
				},
				u: function( element ) {
					// Returns <s> element.
					return new CKEDITOR.htmlParser.fragment.fromHtml( '<s f2="1">X</s>' ).children[ 0 ];
				}
			}
		} );

		filter3.addRules( {
			text: function( value ) {
				return value + 'f3';
			},

			elements: {
				u: function( element ) {
					assert.fail( 'Element <u> should have been removed by previous filter.' );
				},
				s: function( element ) {
					assert.areSame( '1', element.attributes.a2 );
					element.attributes.a3 = '1';
				}
			}
		} );

		var fragment = CKEDITOR.htmlParser.fragment.fromHtml( '<p>A<b>B</b><u>C</u><i>D</i>E</p>' ),
			writer = new CKEDITOR.htmlParser.basicWriter();

		filter1.applyTo( fragment );
		fragment.writeHtml( writer );
		assert.areSame( '<p f1="1">Af1Bf1<u>Cf1</u>Ef1</p>', writer.getHtml( true ) );

		filter2.applyTo( fragment );
		fragment.writeHtml( writer );
		assert.areSame( '<p a1="1">Af1f2Bf1f2<s a2="1">Xf2</s>Ef1f2</p>', writer.getHtml( true ) );

		filter3.applyTo( fragment );
		fragment.writeHtml( writer );
		assert.areSame( '<p a1="1">Af1f2f3Bf1f2f3<s a2="1" a3="1">Xf2f3</s>Ef1f2f3</p>', writer.getHtml( true ) );
	},

	'test filterChildren with force filterRoot': function() {
		var filter = new CKEDITOR.htmlParser.filter(),
			writer = new CKEDITOR.htmlParser.basicWriter();

		filter.addRules( {
			root: function( element ) {
				assert.areSame( 'p', element.name );
				element.attributes.f = '1';
			},
			elements: {
				p: function() {
					assert.fail( 'Only root filter should be applied to <p>' );
				}
			},
			text: function( value ) {
				return value + 'bar';
			}
		} );

		// First - check with filterRoot == false.
		var fragment = CKEDITOR.htmlParser.fragment.fromHtml( '<b>foo</b><i>fuu</i>', 'p' );
		fragment.filterChildren( filter );
		fragment.writeHtml( writer );

		assert.areSame( '<p><b>foobar</b><i>fuubar</i></p>', writer.getHtml( true ) );

		// Now - check with filterRoot == true.
		var fragment = CKEDITOR.htmlParser.fragment.fromHtml( '<b>foo</b><i>fuu</i>', 'p' );
		fragment.filterChildren( filter, true );
		fragment.writeHtml( writer );

		assert.areSame( '<p f="1"><b>foobar</b><i>fuubar</i></p>', writer.getHtml( true ) );
	},

	'test blocking processing on elements with data-cke-processor="off" attribute': function() {
		var filter = new CKEDITOR.htmlParser.filter(),
			writer = new CKEDITOR.htmlParser.basicWriter();

		writer.sortAttributes = true;

		filter.addRules( {
			root: function( el ) {
				el.bar = '1';
			},
			elements: {
				span: function( el ) {
					el.attributes.foo = '1';
				}
			},
			attributeNames: [
				[ /^a$/, 'b' ]
			],
			text: function( value ) {
				return value + 'X';
			}
		} );

		var fragment = CKEDITOR.htmlParser.fragment.fromHtml(
			'<p><span a="1">1<span a="1">1.1</span><span a="1" data-cke-processor="off">1.2<span>1.2.1</span></span><span a="1">1.3</span></span></p>' );
		filter.applyTo( fragment );
		fragment.writeHtml( writer );

		assert.areSame(
			'<p><span b="1" foo="1">1X<span b="1" foo="1">1.1X</span><span a="1" data-cke-processor="off">1.2<span>1.2.1</span></span><span b="1" foo="1">1.3X</span></span></p>',
			writer.getHtml( true )
		);

		var elSpan = CKEDITOR.htmlParser.fragment.fromHtml( '<span a="1" data-cke-processor="off">A</span>' ).children[ 0 ];
		filter.applyTo( elSpan );
		elSpan.writeHtml( writer );

		assert.areSame( '<span a="1" data-cke-processor="off">A</span>', writer.getHtml( true ) );
	},

	'test no processing of non-editable elements': function() {
		var filter = new CKEDITOR.htmlParser.filter(),
			writer = new CKEDITOR.htmlParser.basicWriter();

		writer.sortAttributes = true;

		filter.addRules( {
			elements: {
				$: function( el ) {
					el.attributes.c = '1';
				}
			},
			attributeNames: [
				[ /^a$/, 'b' ]
			],
			text: function( value ) {
				return value + 'X';
			}
		} );

		var fragment = CKEDITOR.htmlParser.fragment.fromHtml(
			'<p a="1">1</p>' +
			'<section a="1">' +
				'<div a="1" contenteditable="false">' +
					'2.1<span a="1">2.1.1</span>' +
					'<p a="1" contenteditable="true">2.2.1<b a="1">2.2.2</b></p>' +
					'2.3<span a="1">2.3.1</span>' +
				'</div>' +
				'<p a="1">3</p>' +
			'</section>' +
			'<p a="1">4</p>'
		);
		filter.applyTo( fragment );
		fragment.writeHtml( writer );

		assert.areSame(
			'<p b="1" c="1">1X</p>' +
			'<section b="1" c="1">' +
				'<div a="1" contenteditable="false">' +
					'2.1<span a="1">2.1.1</span>' +
					'<p a="1" contenteditable="true">2.2.1<b a="1">2.2.2</b></p>' +
					'2.3<span a="1">2.3.1</span>' +
				'</div>' +
				'<p b="1" c="1">3X</p>' +
			'</section>' +
			'<p b="1" c="1">4X</p>',
			writer.getHtml( true )
		);
	},

	'test applyToAll option': function() {
		var filter = new CKEDITOR.htmlParser.filter(),
			writer = new CKEDITOR.htmlParser.basicWriter();

		writer.sortAttributes = true;

		addNormalAndNonEditableRules( filter );

		var fragment = CKEDITOR.htmlParser.fragment.fromHtml(
			'<p a="1" b="1">1</p>' +
			'<section a="1" b="1">' +
				'<div a="1" b="1" contenteditable="false">' +
					'2.1<span a="1" b="1">2.1.1</span>' +
					'<p a="1" b="1" contenteditable="true">2.2.1<b a="1" b="1">2.2.2</b></p>' +
					'2.3<span a="1" b="1">2.3.1</span>' +
				'</div>' +
				'<p a="1" b="1">3</p>' +
			'</section>' +
			'<p a="1" b="1">4</p>'
		);
		filter.applyTo( fragment );
		fragment.writeHtml( writer );

		assert.areSame(
			'<e:n:p ax="1" ay="1" bx="1" by="1">1EN</e:n:p>' +
			'<section ax="1" ay="1" bx="1" by="1">' +
				'<div a="1" bx="1" by="1" contenteditable="false">' +
					'2.1N<span a="1" bx="1" by="1">2.1.1N</span>' +
					'<n:p a="1" bx="1" by="1" contenteditable="true">2.2.1N<b a="1" bx="1" by="1">2.2.2N</b></n:p>' +
					'2.3N<span a="1" bx="1" by="1">2.3.1N</span>' +
				'</div>' +
				'<e:n:p ax="1" ay="1" bx="1" by="1">3EN</e:n:p>' +
			'</section>' +
			'<e:n:p ax="1" ay="1" bx="1" by="1">4EN</e:n:p>',
			writer.getHtml( true )
		);
	},

	'test applyToAll option - root filtering': function() {
		var filter = new CKEDITOR.htmlParser.filter(),
			writer = new CKEDITOR.htmlParser.basicWriter();

		writer.sortAttributes = true;

		addNormalAndNonEditableRules( filter );

		var el = CKEDITOR.htmlParser.fragment.fromHtml( '<p a="1" b="1" contenteditable="false">foo</p>' ).children[ 0 ];
		el.parent = null; // Disconnect from fragment.
		el.filter( filter );
		el.writeHtml( writer );

		assert.areSame(
			'<n:p a="1" bx="1" by="1" contenteditable="false" rootn="1">fooN</n:p>',
			writer.getHtml( true )
		);
	},

	'test applyToAll with excludeNestedEditable option': function() {
		var filter = new CKEDITOR.htmlParser.filter(),
			writer = new CKEDITOR.htmlParser.basicWriter();

		writer.sortAttributes = true;

		filter.addRules( {
			root: function( el ) {
				if ( el.type == CKEDITOR.NODE_ELEMENT )
					el.attributes.roota = '1';
			},
			elements: {
				$: function( el ) {
					el.attributes.ax = '1';
				}
			},
			attributeNames: [
				[ /^a$/, 'ay' ]
			],
			elementNames: [
				[ /^p$/, 'a:p' ]
			],
			text: function( value ) {
				return value + 'A';
			}
		}, {
			applyToAll: true,
			excludeNestedEditable: true
		} );

		var fragment = CKEDITOR.htmlParser.fragment.fromHtml(
			'<p a="1">1</p>' +
			'<section a="1">' +
				'<div a="1" contenteditable="false">' +
					'2.1<span a="1">2.1.1</span>' +
					'<p a="1" contenteditable="true">2.2.1<b a="1">2.2.2</b></p>' +
					'2.3<span a="1">2.3.1</span>' +
				'</div>' +
				'<p a="1">3</p>' +
			'</section>' +
			'<p a="1">4</p>'
		);

		filter.applyTo( fragment );
		fragment.writeHtml( writer );

		assert.areSame(
			'<a:p ax="1" ay="1">1A</a:p>' +
			'<section ax="1" ay="1">' +
				'<div ax="1" ay="1" contenteditable="false">' +
					'2.1A<span ax="1" ay="1">2.1.1A</span>' +
					'<p a="1" contenteditable="true">2.2.1<b a="1">2.2.2</b></p>' +
					'2.3A<span ax="1" ay="1">2.3.1A</span>' +
				'</div>' +
				'<a:p ax="1" ay="1">3A</a:p>' +
			'</section>' +
			'<a:p ax="1" ay="1">4A</a:p>',
			writer.getHtml( true )
		);
	},

	'test filterRulesGroup - basics': function() {
		var group1 = new CKEDITOR.htmlParser.filterRulesGroup(),
			group2 = new CKEDITOR.htmlParser.filterRulesGroup();

		assert.isTrue( !!group1 )
		assert.isTrue( !!group2 );
		assert.areNotSame( group1.rules, group2.rules );
		assert.isArray( group1.rules );
	},

	'test filterRulesGroup#findIndex - empty': function() {
		var group = new CKEDITOR.htmlParser.filterRulesGroup();

		assert.areSame( 0, group.findIndex( 1 ), 'priority 1' );
		assert.areSame( 0, group.findIndex( 10 ), 'priority 10' );
		assert.areSame( 0, group.findIndex( 100 ), 'priority 100' );
	},

	'test filterRulesGroup#findIndex': function() {
		var group = new CKEDITOR.htmlParser.filterRulesGroup();
		group.rules = [
			{ fn: 1, options: 1, priority: 5 },
			{ fn: 1, options: 1, priority: 10 },
			{ fn: 1, options: 1, priority: 10 },
			{ fn: 1, options: 1, priority: 11 }
		];

		assert.areSame( 0, group.findIndex( 1 ), 'priority 1' );
		assert.areSame( 1, group.findIndex( 7 ), 'priority 7' );
		assert.areSame( 3, group.findIndex( 10 ), 'priority 10' );
		assert.areSame( 4, group.findIndex( 100 ), 'priority 100' );
	},

	'test filterRulesGroup#add': function() {
		var group = new CKEDITOR.htmlParser.filterRulesGroup(),
			rule1 = function fn1() {},
			rule2 = function fn2() {},
			options1 = {},
			options2 = {};

		group.add( rule1, 10, options1 );

		assert.areSame( 1, group.rules.length );
		assert.areSame( rule1, group.rules[ 0 ].value );
		assert.areSame( options1, group.rules[ 0 ].options );
		assert.areSame( 10, group.rules[ 0 ].priority );

		group.add( rule2, 1, options2 );

		assert.areSame( 2, group.rules.length );
		assert.areSame( rule2, group.rules[ 0 ].value );
		assert.areSame( options2, group.rules[ 0 ].options );
		assert.areSame( 1, group.rules[ 0 ].priority );

		assert.areSame( rule1, group.rules[ 1 ].value );
	},

	'test filterRulesGroup#addMany': function() {
		var group = new CKEDITOR.htmlParser.filterRulesGroup(),
			rule1 = function fn1() {},
			rule2 = function fn2() {},
			rule3a = function fn3a() {},
			rule3b = function fn3b() {},
			options1 = {},
			options2 = {},
			options3 = {};

		group.add( rule1, 1, options1 );
		group.add( rule2, 10, options2 );

		group.addMany( [ rule3a, rule3b ], 5, options3 );

		assert.areSame( 4, group.rules.length );
		assert.areSame( rule1, group.rules[ 0 ].value );
		assert.areSame( rule3a, group.rules[ 1 ].value );
		assert.areSame( rule3b, group.rules[ 2 ].value );
		assert.areSame( rule2, group.rules[ 3 ].value );

		assert.areSame( 5, group.rules[ 1 ].priority );
		assert.areSame( 5, group.rules[ 2 ].priority );
		assert.areSame( options3, group.rules[ 1 ].options );
		assert.areSame( options3, group.rules[ 2 ].options );
	}
} );