/* bender-tags: editor */

( function() {
	'use strict';

	var vendorPrefix = CKEDITOR.env.gecko ? '-moz-' :
		CKEDITOR.env.webkit ? '-webkit-' :
		CKEDITOR.env.ie ? '-ms-' :
		'',

		htmlEncode = CKEDITOR.tools.htmlEncode,
		htmlDecode = CKEDITOR.tools.htmlDecode;

	bender.editor = {
		config: {
			language: 'en'
		}
	};
	function assertNormalizeCssText( expected, input, message ) {
		return function() {
			assert.areSame( expected, CKEDITOR.tools.normalizeCssText( input ), message );
		};
	}

	bender.test( {
		test_extend: function() {
			function fakeFn() {}

			var fakeObj = { fake1: 1, fake2: 2 };
			var fakeArray = [ 'Test', 10, fakeFn, fakeObj ];

			var target = {
				prop1: 'Test',
				prop2: 10,
				prop3: fakeFn,
				prop4: fakeObj,
				prop5: fakeArray
			};

			CKEDITOR.tools.extend( target, {
				prop3: 'Wrong',
				prop6: 'Good',
				prop7: fakeArray
			} );

			assert.areSame( 'Test'		, target.prop1, 'prop1 doesn\'t match' );
			assert.areSame( 10			, target.prop2, 'prop2 doesn\'t match' );
			assert.areSame( fakeFn		, target.prop3, 'prop3 doesn\'t match' );
			assert.areSame( fakeObj		, target.prop4, 'prop4 doesn\'t match' );
			assert.areSame( fakeArray	, target.prop5, 'prop5 doesn\'t match' );
			assert.areSame( 'Good'		, target.prop6, 'prop6 doesn\'t match' );
			assert.areSame( fakeArray	, target.prop7, 'prop7 doesn\'t match' );
		},

		// (#3120)
		'test extend dont enum attribute': function() {
			var dontEnumObj = CKEDITOR.tools.convertArrayToObject( CKEDITOR.tools.object.DONT_ENUMS, 1 ),
				target = {};

			CKEDITOR.tools.extend( target, dontEnumObj, true );

			// hasOwnProperty function is shadowed, so objectAssert.areEqual assertion will fail.
			arrayAssert.itemsAreEqual( CKEDITOR.tools.object.DONT_ENUMS, CKEDITOR.tools.object.keys( target ) );
		},

		test_isArray1: function() {
			assert.isTrue( CKEDITOR.tools.isArray( [] ) );
		},

		test_isArray2: function() {
			assert.isFalse( CKEDITOR.tools.isArray( { length: 1 } ) );
		},

		test_isArray3: function() {
			assert.isFalse( CKEDITOR.tools.isArray( null ) );
		},

		test_isArray4: function() {
			assert.isFalse( CKEDITOR.tools.isArray( window.x ) );
		},

		'test_htmlEncode - all covered entities': function() {
			assert.areSame( '&lt;b&gt;Test&amp;fun!&lt;/b&gt;', htmlEncode( '<b>Test&fun!</b>' ) );
		},

		'test htmlEncode - do not touch quotes': function() {
			assert.areSame( 'Test\'s &amp; "quote"', htmlEncode( 'Test\'s & "quote"' ) );
		},

		'test htmlEncode - tabs': function() {
			assert.areSame( 'A   B   \n\n\t\tC\n \t D', htmlEncode( 'A   B   \n\n\t\tC\n \t D' ), 'Tab should not be touched.' );
		},

		// Backwards compatibility with careless plugins like dialog or dialogui. All values must be accepted.
		'test htmlEncode - backwards compat': function() {
			assert.areSame( '', htmlEncode( undefined ), 'undef' );
			assert.areSame( '', htmlEncode( null ), 'null' );
			assert.areSame( '3', htmlEncode( 3 ), '3' );
			assert.areSame( '0', htmlEncode( 0 ), '0' );
		},

		'test htmlEncode - https://dev.ckeditor.com/ticket/3874': function() {
			assert.areSame( 'line1\nline2', htmlEncode( 'line1\nline2' ) );
		},

		// https://dev.ckeditor.com/ticket/13105#comment:8
		'test htmlDecode - all covered named entities': function() {
			assert.areSame( '< a & b > c \u00a0 d \u00ad e "', htmlDecode( '&lt; a &amp; b &gt; c &nbsp; d &shy; e &quot;' ) );
		},

		'test htmlDecode - numeric entities': function() {
			assert.areSame( '\u0001 \u000a \u00ff \uffff \u000c', htmlDecode( '&#1; &#10; &#255; &#65535; &#0012;' ) );
		},

		'test htmlDecode - duplications': function() {
			assert.areSame( '<a & b ><a & b >', htmlDecode( '&lt;a &amp; b &gt;&lt;a &amp; b &gt;' ) );
		},

		'test htmlDecode - double encoding': function() {
			assert.areSame( '&lt; &amp; &gt; &nbsp; &shy;', htmlDecode( '&amp;lt; &amp;amp; &amp;gt; &amp;nbsp; &amp;shy;' ) );
		},

		'test htmlDecode - triple encoding': function() {
			assert.areSame( '&amp;lt; &amp;amp; &amp;gt;', htmlDecode( '&amp;amp;lt; &amp;amp;amp; &amp;amp;gt;' ) );
		},

		'test htmlEncodeAttr - all covered entities': function() {
			assert.areSame( '&lt;a b=&quot;c&amp;d&quot;/&gt;', CKEDITOR.tools.htmlEncodeAttr( '<a b="c&d"/>' ) );
		},

		'test htmlDecodeAttr - all covered entities': function() {
			assert.areSame( '< " > & \u00a0 \u00ad \u000a', CKEDITOR.tools.htmlDecodeAttr( '&lt; &quot; &gt; &amp; &nbsp; &shy; &#10;' ) );
		},

		'test htmlDecodeAttr - double encoding': function() {
			assert.areSame( '&lt; &quot; &gt; &amp;', CKEDITOR.tools.htmlDecodeAttr( '&amp;lt; &amp;quot; &amp;gt; &amp;amp;' ) );
		},

		test_cssStyleToDomStyle1: function() {
			assert.areSame( 'backgroundColor', CKEDITOR.tools.cssStyleToDomStyle( 'background-color' ) );
		},

		test_cssStyleToDomStyle2: function() {
			assert.areSame( ( CKEDITOR.env.ie && document.documentMode <= 8 ) ? 'styleFloat' : 'cssFloat', CKEDITOR.tools.cssStyleToDomStyle( 'float' ) );
		},

		test_getNextNumber: function() {
			var number = CKEDITOR.tools.getNextNumber();
			assert.areSame( number +  1, CKEDITOR.tools.getNextNumber() );
			assert.areSame( number +  2, CKEDITOR.tools.getNextNumber() );
			assert.areSame( number +  3, CKEDITOR.tools.getNextNumber() );
		},

		test_ltrim1: function() {
			assert.areSame( 'test   ', CKEDITOR.tools.ltrim( '    test   ' ) );
		},

		test_ltrim2: function() {
			assert.areSame( 'test\n  \t ', CKEDITOR.tools.ltrim( ' \n \t  test\n  \t ' ) );
		},

		test_rtrim1: function() {
			assert.areSame( '    test', CKEDITOR.tools.rtrim( '    test   ' ) );
		},

		test_rtrim2: function() {
			assert.areSame( ' \n \t  test', CKEDITOR.tools.rtrim( ' \n \t  test\n  \t ' ) );
		},

		test_clone: function() {
			var obj = {
				name: 'John',
				cars: {
					Mercedes: { color: 'blue' },
					Porsche: { color: 'red' }
				}
			};

			var clone = CKEDITOR.tools.clone( obj );

			clone.name = 'Paul';
			clone.cars.Porsche.color = 'silver';

			assert.areSame( 'John', obj.name );
			assert.areSame( 'Paul', clone.name );

			assert.areNotSame( obj.cars, clone.cars );
			assert.areSame( 'red', obj.cars.Porsche.color );
			assert.areSame( 'silver', clone.cars.Porsche.color );
		},

		test_clone_DOM: function() {
			var anchor = document.createElement( 'a' );
			var obj = {
				anchor: anchor
			};

			var clone = CKEDITOR.tools.clone( obj );

			assert.areSame( clone.anchor, anchor );
		},

		test_clone_Window: function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
				assert.ignore();
			}

			var obj = {
				window: window
			};

			var clone = CKEDITOR.tools.clone( obj );

			assert.areSame( clone.window, window );
		},

		test_clone_Document: function() {
			var obj = {
				document: document
			};

			var clone = CKEDITOR.tools.clone( obj );

			assert.areSame( clone.document, document );
		},

		test_repeat: function() {
			assert.areSame( '&nbsp;&nbsp;&nbsp;', CKEDITOR.tools.repeat( '&nbsp;', 3 ) );
		},
// Function escapeCssSelector removed in r5956
//		test_escapeCssSelector: function ()
//		{
//			assert.areSame( '\\.\\,\\*\\=\\~\\$\\^\\(\\)\\ \\:\\#\\+\\>', CKEDITOR.tools.escapeCssSelector( '.,*=~$^() :#+>' ) );
//		},

		test_callFunction: function() {
			var argARef  = 'http://ckeditor.com/index.html#myanchor',
			func = CKEDITOR.tools.addFunction( function( argA ) {
				assert.areSame( argA, argARef );
			} );

			CKEDITOR.tools.callFunction( func, argARef );
		},

		test_createClass: function() {
			var A = CKEDITOR.tools.createClass( {
					_: {
						type: function() {
							return 'A:';
						}
					},
					$: function( name ) {
						this._name = name;
					},
					proto: {
						name: function() {
							// Call private method.
							return this._.type() + this._name;
						}
					}
				} );

			var B = CKEDITOR.tools.createClass( {
						base: A,
						$: function() {
							// Call super constructor.
							this.base.apply( this, arguments );
						},
						proto: {
							type: function() {
								return 'B:';
							}
						}
					} );

			var C = CKEDITOR.tools.createClass( {
					base: B,
					$: function() {
						// Call super constructor recursively.
						this.base.apply( this, arguments );
					},
					proto: {
						// Overrides super class method.
						name: function() {
							// Call the super method.
							return C.baseProto.name.call( this ).replace( /A/, 'C' );
						}
					}
				} );

			var a = new A( 'foo' );
			assert.areSame( 'A:foo', a.name(), 'check the name of a' );
			assert.isTrue( a instanceof A, 'check instanceof A' );

			var b = new B( 'bar' );
			assert.areSame( 'A:bar', b.name(), 'check the name of b' );
			assert.areSame( B.base, A, 'check base class of B' );
			assert.isTrue( b instanceof A && b instanceof B, 'check instanceof both A & B' );

			var c = new C( 'lol' );
			assert.areSame( 'C:lol', c.name(), 'check the name of c' );
			assert.areSame( C.base, B, 'check base class of C' );
			assert.isTrue( c instanceof A && c instanceof B && c instanceof C, 'check instanceof both A & B & C' );
		},

		testNormalizeCssText: assertNormalizeCssText( 'color:red;font-size:10px;width:10.5em;', ' width: 10.5em ; COLOR : red; font-size:10px  ; ', 'order, lowercase and white spaces' ),

		testNormalizeCssText2: function() {
			var n = CKEDITOR.tools.normalizeCssText;

			assert.areSame( '', n( ' ' ), 'empty' );

			assert.areSame( 'background:-webkit-gradient(linear, 0 0, 0 100, from(#fff), to(#d3d3d3));',
				n( 'background: -webkit-gradient(linear, 0 0, 0 100, from(#fff), to(#d3d3d3));' ), 'gradient' );

			assert.areSame( 'border-radius:3px;cursor:default;float:left;height:18px;opacity:0.4;outline:none;padding:2px 4px;',
				n( 'height: 18px; padding: 2px 4px; border-radius: 3px; outline: none; cursor: default;	float: left; opacity: 0.4' ), 'various 1' );

			assert.areSame( 'color:red;filter:alpha(opacity = 70);width:10px;',
				n( 'color: red; filter: alpha(opacity = 70); width: 10px' ), 'filter' );

			assert.areSame( 'color:red;width:bold;', n( 'COLOR: red; WIDTH: bold' ), 'upper case' );

			assert.areSame( 'color:rgba(255, 35, 35, 0.4);top:0;', n( 'color: rgba(255, 35, 35, 0.4); top: 0' ), 'rgba' );

			assert.areSame( 'background-image:url(\'http://cke.com/g.gif?hello=1&bye=0\');display:none;',
				n( 'background-image: url(\'http://cke.com/g.gif?hello=1&bye=0\'); display: none;' ), 'special chars in URL' );
		},

		testNormalizeCssText3: function() {
			var n = CKEDITOR.tools.normalizeCssText;

			assert.areSame( '', n( ' ', true ), 'empty' );

			assert.areSame( 'color:red;float:left;margin:0.5em;width:10px;',
				n( 'color: red; width: 10px; margin: 0.5em; float: left', true ), 'various' );
		},

		testQuoteEntity: assertNormalizeCssText( 'font-family:"foo";', 'font-family: &quot;foo&quot;;', '' ),

		// (https://dev.ckeditor.com/ticket/10750)
		'test Normalize double quote': assertNormalizeCssText( 'font-family:"crazy font";', 'font-family: "crazy font";',
			'quoted font name' ),
		'test Normalize single quote': assertNormalizeCssText( 'font-family:\'crazy font\';', 'font-family: \'crazy font\';',
			'single-quoted font name' ),

		'test Normalize generic family name serif': assertNormalizeCssText( 'font-family:serif;', 'font-family: serif;',
			'generic-family name is not escaped' ),
		'test Normalize generic family name sans-serif': assertNormalizeCssText( 'font-family:sans-serif;', 'font-family: sans-serif;',
			'generic-family name is not escaped' ),
		'test Normalize generic family name cursive': assertNormalizeCssText( 'font-family:cursive;', 'font-family: cursive;',
			'generic-family name is not escaped' ),
		'test Normalize generic family name fantasy': assertNormalizeCssText( 'font-family:fantasy;', 'font-family: fantasy;',
			'generic-family name is not escaped' ),
		'test Normalize generic family name monospace': assertNormalizeCssText( 'font-family:monospace;', 'font-family: monospace;',
			'generic-family name is not escaped' ),

		'test Normalize generic and non-generic mix': assertNormalizeCssText( 'font-family:"foo",serif;', 'font-family: "foo", serif;',
			'family-name and generic-family mix' ),
		'test Normalize letter casing sensitivity': assertNormalizeCssText( 'font-family:"FFo baR";', 'font-family: "FFo baR";',
			'letter casing sensivity' ),
		// It's also possible to use font named as any generic-family member as long as it's enclosed within quotes.
		'test Normalize generic-family token as family-name': assertNormalizeCssText( 'font-family:"serif";', 'font-family:"serif";',
			'accept generic-family token as family-name' ),
		'test Normalize unquoted family name with hyphen': assertNormalizeCssText( 'font-family:my-cool-font;', 'font-family:my-cool-font;',
			'unquoted family name with hyphen' ),
		'test Normalize font name with multiple spaces': assertNormalizeCssText( 'font-family:"Space    font";', 'font-family:"Space    font";',
			'font name with multiple spaces' ),

		'test Normalize family name with quotes': assertNormalizeCssText( 'font-family:"\'Sarcasm\'";', 'font-family:"\'Sarcasm\'";',
			'family name with quotes' ),
		'test Normalize family name with special characters': assertNormalizeCssText( 'font-family:"\'This is   -!$   custom Font\'";', 'font-family:"\'This is   -!$   custom Font\'";',
			'family name with special characters' ),

		// If there's a syntax error in the style - just leave it like that.
		'test Normalize syntax error': assertNormalizeCssText( 'font-family:"crazy font",;', 'font-family:"crazy font",;',
			'style syntax error' ),


		testConvertRgbToHex: function() {
			var c = CKEDITOR.tools.convertRgbToHex;

			assert.areSame( '', c( '' ), 'empty 1' );
			assert.areSame( 'rgb()', c( 'rgb()' ), 'empty 2' );

			assert.areSame( '#000000', c( 'rgb(0, 0, 0)' ), 'case 1' );
			assert.areSame( '#326496', c( 'rgb(50, 100, 150)' ), 'case 2' );
			assert.areSame( '#010209', c( 'rgb(1, 2, 9)' ), 'case 3' );

			assert.areSame( '#010203', c( 'rgb(  1,2 , 3 )' ), 'case 4' );

			assert.areSame( 'color:#010203; border-color:#ffff00;', c( 'color:rgb(1,2,3); border-color:rgb(255,255,0);' ), 'multiple' );
		},

		// https://dev.ckeditor.com/ticket/14252
		testNormalizeHex: function() {
			var c = CKEDITOR.tools.normalizeHex;

			assert.areSame( '', c( '' ), 'empty' );

			assert.areSame( '#000000', c( '#000000' ), 'Long hex' );
			assert.areSame( '#000000', c( '#000' ), 'Short hex' );

			assert.areSame( '#ffff00', c( '#ffff00' ), 'Long, lower-case hex' );
			assert.areSame( '#ffff00', c( '#FFFF00' ), 'Long, upper-case hex' );
			assert.areSame( '#ffff00', c( '#ff0' ), 'Short, lower-case hex' );
			assert.areSame( '#ffff00', c( '#FF0' ), 'Short, upper-case hex' );
			assert.areSame( '#ffff00', c( '#FfFf00' ), 'Long, mixed-case hex' );
			assert.areSame( '#ffff00', c( '#Ff0' ), 'Short, mixed-case hex' );
		},

		testCssLength: function() {
			var cssLength = CKEDITOR.tools.cssLength;

			assert.areSame( '', cssLength( false ) );	// reset the style
			assert.areSame( '', cssLength( null ) );	// reset the style
			assert.areSame( '', cssLength( undefined ) );	// reset the style
			assert.areSame( '0px', cssLength( 0 ) );
			assert.areSame( '42px', cssLength( 42 ) );
			assert.areSame( '-42px', cssLength( -42 ) );
			assert.areSame( '42.42px', cssLength( 42.42 ) );
			assert.areSame( '', cssLength( 0 / 0 ) );	// Gives NaN

			assert.areSame( '', cssLength( '' ) );
			assert.areSame( ' ', cssLength( ' ' ) );
			assert.areSame( ' CK ', cssLength( ' CK ' ) );

			assert.areSame( 'NaN', cssLength( 'NaN' ) );
			assert.areSame( 'Infinity', cssLength( 'Infinity' ) );
			assert.areSame( 'false', cssLength( 'false' ) );
			assert.areSame( 'null', cssLength( 'null' ) );

			assert.areSame( '0px', cssLength( '0' ) );
			assert.areSame( '42.42px', cssLength( '42.42' ) );
			assert.areSame( '42.42px', cssLength( ' 42.42	' ) );
			assert.areSame( '42px', cssLength( '42px' ) );
			assert.areSame( ' 42%', cssLength( ' 42%' ) );
			assert.areSame( '42em ', cssLength( '42em ' ) );
		},

		'test cssVendorPrefix - object': function() {
			var obj = CKEDITOR.tools.cssVendorPrefix( 'border-radius', 'val' );

			assert.areSame( 'val', obj[ vendorPrefix + 'border-radius' ] );
			assert.areSame( 'val', obj[ 'border-radius' ] );

			// Coool...
			var len = 0;
			for ( var k in obj ) // jshint ignore:line
				len++;

			assert.areSame( 2, len );
		},

		'test cssVendorPrefix - string': function() {
			var str = CKEDITOR.tools.cssVendorPrefix( 'border-radius', 'val', true );

			assert.areSame( vendorPrefix + 'border-radius:val;border-radius:val', str );
		},

		'test writeCssText': function() {
			var write = CKEDITOR.tools.writeCssText;

			assert.areSame( '', write() );
			assert.areSame( '', write( {} ) );
			assert.areSame( 'a:0', write( { a: '0' } ) );
			assert.areSame( 'a:0; b:1', write( { a: '0', b: '1' } ) );
			assert.areSame( 'a:1; b:0; c:2', write( { b: '0', c: '2', a: '1' }, true ) );
		},

		'test objectCompare': function() {
			var obj1 = { a: 1, b: '2' },
				obj2 = { a: 1 },
				obj3 = { a: 1, b: '2' },
				obj4 = { a: 1, b: '3' };

			var comp = CKEDITOR.tools.objectCompare;

			assert.isTrue( comp( obj1, obj1 ), 'obj1, obj1' );
			assert.isTrue( comp( obj1, obj1, true ), 'obj1, obj1, onlyLeft' );

			assert.isFalse( comp( obj1, obj2 ), 'obj1, obj2' );
			assert.isFalse( comp( obj1, obj2, true ), 'obj1, obj2, onlyLeft' );

			assert.isFalse( comp( obj2, obj1 ), 'obj2, obj1' );
			assert.isTrue( comp( obj2, obj1, true ), 'obj2, obj1, onlyLeft' );

			assert.isTrue( comp( obj1, obj3 ), 'obj1, obj3' );
			assert.isTrue( comp( obj1, obj3, true ), 'obj1, obj3, onlyLeft' );

			assert.isTrue( comp( obj3, obj1 ), 'obj3, obj1' );
			assert.isTrue( comp( obj3, obj1, true ), 'obj3, obj1, onlyLeft' );

			assert.isFalse( comp( obj1, obj4 ), 'obj1, obj4' );
		},

		'test copy': function() {
			var orig = {
				a: 1,
				b: true,
				c: [ 1, 2, 3 ],
				d: { e: 1 }
			};

			var copy = CKEDITOR.tools.copy( orig );

			assert.areNotSame( copy, orig );
			assert.areSame( copy.a, orig.a );
			assert.areSame( copy.b, orig.b );
			assert.areSame( copy.c, orig.c );
			assert.areSame( copy.d, orig.d );
		},

		'test convertArrayToObject': function() {
			var arr = [ 'foo', 'bar', 'foo' ],
				obj;

			obj = CKEDITOR.tools.convertArrayToObject( arr );
			assert.isTrue( obj.foo );
			assert.isTrue( obj.bar );
			arrayAssert.itemsAreEqual( [ 'foo', 'bar' ], CKEDITOR.tools.object.keys( obj ) );

			obj = CKEDITOR.tools.convertArrayToObject( arr, 1 );
			assert.areSame( 1, obj.foo );
			assert.areSame( 1, obj.bar );

			arrayAssert.itemsAreEqual( [], CKEDITOR.tools.object.keys( CKEDITOR.tools.convertArrayToObject( {} ) ) );
		},

		'test eventsBuffer': function() {
			assert.isTrue( CKEDITOR.tools.eventsBuffer( 200, function() {} ) instanceof CKEDITOR.tools.buffers.event );
		},

		'test buffers.event': function() {
			var output = 0,
				buffer = new CKEDITOR.tools.buffers.event( 200, function() {
					output++;
				} );

			assert.areSame( 0, output );

			buffer.input();

			assert.areSame( 1, output );

			buffer.input();
			buffer.input();
			buffer.input();

			assert.areSame( 1, output );

			wait( function() {
				assert.areSame( 1, output );

				wait( function() {
					assert.areSame( 2, output );

					buffer.input();

					assert.areSame( 2, output );

					wait( function() {
						assert.areSame( 3, output );

						// Check that input triggered after 70ms from previous
						// buffer.input will trigger output after next 140ms (200-70).
						wait( function() {
							buffer.input();

							assert.areSame( 3, output );

							wait( function() {
								assert.areSame( 4, output );
							}, 140 );
						}, 70 );
					}, 210 );
				}, 110 );
			}, 100 );
		},

		'test buffers.event.reset': function() {
			var output = 0,
				buffer = new CKEDITOR.tools.buffers.event( 100, function() {
					output++;
				} );

			assert.areSame( 0, output );

			buffer.input();

			assert.areSame( 1, output );

			buffer.input();
			buffer.reset();

			wait( function() {
				assert.areSame( 1, output );

				buffer.input();

				assert.areSame( 2, output );
			}, 110 );
		},

		'test buffers.event context': function() {
			var spy = sinon.spy(),
				ctxObj = {},
				buffer = new CKEDITOR.tools.buffers.event( 100, spy, ctxObj );

			buffer.input();

			assert.areSame( ctxObj, spy.getCall( 0 ).thisValue, 'callback was executed with the right context' );
		},

		'test capitalize': function() {
			var c = CKEDITOR.tools.capitalize;

			assert.areSame( '', c( '' ) );
			assert.areSame( 'A', c( 'A' ) );
			assert.areSame( 'A', c( 'a' ) );
			assert.areSame( 'Ab', c( 'ab' ) );
			assert.areSame( 'Ab', c( 'aB' ) );
			assert.areSame( 'Abcdef', c( 'aBcDeF' ) );

			assert.areSame( 'A', c( 'a', true ) );
			assert.areSame( 'Ab', c( 'ab', true ) );
			assert.areSame( 'AB', c( 'aB', true ) );
			assert.areSame( 'ABcDeF', c( 'aBcDeF', true ) );
		},

		'test throttle': function() {
			assert.isTrue( CKEDITOR.tools.throttle( 200, function() {} ) instanceof CKEDITOR.tools.buffers.throttle );
		},

		'test buffers.throttle': function() {
			if ( bender.config.isTravis && CKEDITOR.env.gecko ) {
				// test randomly fails on FF on Travis.
				assert.ignore();
			}

			var foo = 'foo',
				baz = 'baz',
				inputSpy = sinon.spy(),
				buffer = new CKEDITOR.tools.buffers.throttle( 200, inputSpy );

			buffer.input( foo );

			assert.areSame( 1, inputSpy.callCount, 'Call count after the first call' );
			assert.isTrue( inputSpy.calledWithExactly( foo ), 'Call argument after the first call' );

			buffer.input( baz );

			assert.areSame( 1, inputSpy.callCount, 'Call count after the second call' );
			assert.isTrue( inputSpy.calledWithExactly( foo ), 'Call argument the after second call' );

			wait( function() {
				assert.areSame( 1, inputSpy.callCount, 'Call count after the second call timeout (1st)' );
				assert.isTrue( inputSpy.calledWithExactly( foo ), 'Call argument after the second call timeout (1st)' );

				wait( function() {
					assert.areSame( 2, inputSpy.callCount, 'Call count after the second call timeout (2nd)' );
					assert.isTrue( inputSpy.getCall( 1 ).calledWithExactly( baz ), 'Call argument after the second call timeout (2nd)' );

					buffer.input( foo );

					wait( function() {
						assert.areSame( 3, inputSpy.callCount, 'Call count after the third call' );
						assert.isTrue( inputSpy.getCall( 2 ).calledWithExactly( foo ), 'Call argument after the third call' );

						// Check that input triggered after 70ms from previous
						// buffer.input will trigger output after next 140ms (200-70).
						wait( function() {
							buffer.input( baz );

							assert.areSame( 3, inputSpy.callCount, 'Call count after the fourth call' );

							wait( function() {
								assert.areSame( 4, inputSpy.callCount, 'Call count after the fourth call timeout' );
								assert.isTrue( inputSpy.getCall( 3 ).calledWithExactly( baz ), 'Call argument after the fourth call timeout' );
							}, 140 );
						}, 70 );
					}, 210 );
				}, 110 );
			}, 100 );
		},

		'test buffers.throttle always uses the most recent argument': function() {
			var input = sinon.stub(),
				buffer = new CKEDITOR.tools.buffers.throttle( 50, input );

			buffer.input( 'first' );

			assert.areSame( 1, input.callCount, 'Call count after the first call' );
			sinon.assert.calledWithExactly( input.getCall( 0 ), 'first' );

			buffer.input( 'second' );

			buffer.input( 'third' );

			wait( function() {
				assert.areSame( 2, input.callCount, 'Call count after the timeout' );
				sinon.assert.calledWithExactly( input.getCall( 1 ), 'third' );
			}, 100 );
		},

		'test buffers.throttle.reset': function() {
			var inputSpy = sinon.spy(),
				buffer = new CKEDITOR.tools.buffers.throttle( 100, inputSpy );

			assert.areSame( 0, inputSpy.callCount, 'Initial call count' );

			buffer.input();

			assert.areSame( 1, inputSpy.callCount, 'Call count after the first call' );

			buffer.input();
			buffer.reset();

			assert.areSame( 1, inputSpy.callCount, 'Call count after reset' );

			buffer.input();

			assert.areSame( 2, inputSpy.callCount, 'Call count after the second call' );
		},

		'test buffers.throttle context': function() {
			var spy = sinon.spy(),
				ctxObj = {},
				buffer = new CKEDITOR.tools.buffers.throttle( 100, spy, ctxObj );

			buffer.input();

			assert.areSame( ctxObj, spy.getCall( 0 ).thisValue, 'callback was executed with the right context' );
		},

		'test checkIfAnyObjectPropertyMatches': function() {
			var c = CKEDITOR.tools.checkIfAnyObjectPropertyMatches,
				r1 = /foo/,
				r2 = /f.*oo/;

			assert.isTrue( c( { foo: 1 }, r1 ) );
			assert.isTrue( c( { foo: 1, bar: 1 }, r1 ) );
			assert.isTrue( c( { bar: 1, fxoo: 1 }, r2 ) );

			assert.isFalse( c( {}, r1 ) );
			assert.isFalse( c( { bar: 1 }, r1 ) );
			assert.isFalse( c( { bar: 1, f: 1, oo: 1 }, r2 ) ); // Ekhem, don't try to object.keys().join();
		},

		'test checkIfAnyArrayItemMatches': function() {
			var c = CKEDITOR.tools.checkIfAnyArrayItemMatches,
				r1 = /foo/,
				r2 = /f.+oo/;

			assert.isTrue( c( [ 'foo' ], r1 ) );
			assert.isTrue( c( [ 'bar', 'foo' ], r1 ) );
			assert.isTrue( c( [ 'foo', 'bar', 'foo' ], r1 ) );

			assert.isFalse( c( [], r1 ) );
			assert.isFalse( c( [ 'bar' ], r1 ) );
			assert.isFalse( c( [ 'bar', 'f', 'oo' ], r1 ) );
			assert.isFalse( c( [ 'bar', 'f', 'oo' ], r2 ) ); // Ekhem, don't try to join();
		},

		'test transformPlainTextToHtml ENTER_BR': function() {
			var text = '<b>foo</b>\n\nbar\n\tboom',
				html = CKEDITOR.tools.transformPlainTextToHtml( text, CKEDITOR.ENTER_BR );

			assert.areSame( '&lt;b&gt;foo&lt;/b&gt;<br><br>bar<br>&nbsp;&nbsp; &nbsp;boom', html );
		},

		'test transformPlainTextToHtml ENTER_P': function() {
			var text = '<b>foo</b>\n\nbar\n\tboom',
				html = CKEDITOR.tools.transformPlainTextToHtml( text, CKEDITOR.ENTER_P );

			assert.areSame( '<p>&lt;b&gt;foo&lt;/b&gt;</p><p>bar<br>&nbsp;&nbsp; &nbsp;boom</p>', html );
		},

		'test getUniqueId': function() {
			var uuid = CKEDITOR.tools.getUniqueId();

			assert.isString( uuid, 'UUID should be a string.' );
			assert.isMatching( /[a-z]/, uuid[ 0 ], 'First character of UUID should be z letter.' );
			assert.areSame( 33, uuid.length, 'UUID.length' );
		},

		'test setCookie': function() {
			var name = 'test-cookie-name',
				value = 'test-value' + Math.random();

			CKEDITOR.tools.setCookie( name, value );
			assert.isMatching( name + '=' + value, document.cookie, 'cookie is set correctly' );
		},

		'test getCookie': function() {
			var name = 'test2-cookie-name',
				value = 'test-value' + Math.random();

			document.cookie = encodeURIComponent( name ) + '=' + encodeURIComponent( value ) + ';path=/';
			assert.areSame( CKEDITOR.tools.getCookie( name ), value, 'getCookie returns proper cookie' );
		},

		'test getCsrfToken': function() {
			var token = CKEDITOR.tools.getCsrfToken();

			// Check if token is saved in cookie.
			assert.isMatching( 'ckCsrfToken=' + token, document.cookie, 'getCsrfToken sets proper cookie' );

			// Check token length.
			assert.areEqual( token.length, 40, 'token has proper length' );

			// Check if next token will be the same.
			assert.areEqual( token, CKEDITOR.tools.getCsrfToken(), 'getCsrfToken returns token from cookie' );
		},

		'test escapeCss - invalid selector': function() {
			var selector;
			var escapedSelector = CKEDITOR.tools.escapeCss( selector );

			// Check undefined selector.
			assert.areSame( escapedSelector, '', 'invalid selector - undefined' );

			selector = null;
			escapedSelector = CKEDITOR.tools.escapeCss( selector );

			// Check null selector.
			assert.areSame( escapedSelector, '', 'invalid selector - null' );

			selector = '';
			escapedSelector = CKEDITOR.tools.escapeCss( selector );

			// Check empty selector.
			assert.areSame( escapedSelector, '', 'invalid selector - empty' );
		},

		'test escapeCss - starts-with-number selector': function() {
			var selector = '100';
			var escapedSelector = CKEDITOR.tools.escapeCss( selector );

			// Check starts-with-number selector.
			assert.areSame( escapedSelector, '\\31 00', 'starts-with-number selector' );

			selector = '0';
			escapedSelector = CKEDITOR.tools.escapeCss( selector );

			// Check only-one-number selector.
			assert.areSame( escapedSelector, '\\30 ', 'only-one-number selector' );
		},

		// (#681)
		'test escapeCss - escaped colon in the css selector': function() {
			var selector = 'abc:def',
				escapedSelector = CKEDITOR.tools.escapeCss( selector );

			assert.areSame( escapedSelector, 'abc\\:def', 'The colon character is not escaped in CSS selector.' );
		},

		// (#681)
		'test escapeCss - escaped dot in the css selector': function() {
			var selector = 'abc.def',
				escapedSelector = CKEDITOR.tools.escapeCss( selector );

			assert.areSame( escapedSelector, 'abc\\.def', 'The dot character is not escaped in CSS selector.' );
		},

		// (#681)
		'test escapeCss - escaped null in the css selector': function() {
			var selector = 'a\0',
				escapedSelector = CKEDITOR.tools.escapeCss( selector );

			assert.areSame( escapedSelector, 'a\uFFFD', 'The null character is not escaped in CSS selector.' );
		},

		// (#681)
		'test escapeCss - escaped U+0001 to U+001F or U+007F in the css selector': function() {
			var selector = '\x7F\x01\x02\x1E\x1F',
				escapedSelector = CKEDITOR.tools.escapeCss( selector );

			assert.areSame( escapedSelector, '\\7f \\1 \\2 \\1e \\1f ', 'Character from U+0001 to U+001F or U+007F is not escaped in CSS selector.' );
		},

		// (#681)
		'test escapeCss - escaped U+002D in the css selector': function() {
			var selectorWithSecondCharIsNumber = '-1a',
				escapedSelectorWithSecondCharIsNumber = CKEDITOR.tools.escapeCss( selectorWithSecondCharIsNumber ),
				selectorWithSecondCharIsNotNumber = '-a',
				escapedSelectorWithSecondCharNotNumber = CKEDITOR.tools.escapeCss( selectorWithSecondCharIsNotNumber );

			assert.areSame( escapedSelectorWithSecondCharIsNumber, '-\\31 a', 'has U+002D in selector and second character and is in the range [0-9]' );
			assert.areSame( escapedSelectorWithSecondCharNotNumber, '-a', 'has U+002D in selector and second character and is not in the range [0-9]' );
		},

		'test escapeCss - standard selector': function() {
			var selector = 'aaa';
			var escapedSelector = CKEDITOR.tools.escapeCss( selector );

			// Check standard selector.
			assert.areSame( escapedSelector, 'aaa', 'standard selector' );
		},

		// #810
		'test getMouseButton': function() {
			var isIe8 = CKEDITOR.env.ie && CKEDITOR.env.version < 9;

			generateMouseButtonAsserts( [
				[ CKEDITOR.MOUSE_BUTTON_LEFT, 1 ],
				[ CKEDITOR.MOUSE_BUTTON_MIDDLE, 4 ],
				[ CKEDITOR.MOUSE_BUTTON_RIGHT, 2 ]
			] );

			function generateMouseButtonAsserts( inputs ) {
				CKEDITOR.tools.array.forEach( inputs, function( input ) {
					assert.areSame( input[ 0 ],
						CKEDITOR.tools.getMouseButton( generateEvent( input[ isIe8 ? 1 : 0 ] ) ) );
				} );
			}

			function generateEvent( button ) {
				return {
					data: {
						$: {
							button: button
						}
					}
				};
			}
		},

		// (#2565)
		'test getMouseButton with native DOM event': function() {
			var isIe8 = CKEDITOR.env.ie && CKEDITOR.env.version < 9;

			generateMouseButtonAsserts( [
				[ CKEDITOR.MOUSE_BUTTON_LEFT, 1 ],
				[ CKEDITOR.MOUSE_BUTTON_MIDDLE, 4 ],
				[ CKEDITOR.MOUSE_BUTTON_RIGHT, 2 ]
			] );

			function generateMouseButtonAsserts( inputs ) {
				CKEDITOR.tools.array.forEach( inputs, function( input ) {
					assert.areSame( input[ 0 ],
						CKEDITOR.tools.getMouseButton( generateEvent( input[ isIe8 ? 1 : 0 ] ) ) );
				} );
			}

			function generateEvent( button ) {
				var event;

				if ( document.createEventObject ) {
					event = document.createEventObject();
					event.button = button;
				} else {
					event = document.createEvent( 'MouseEvent' );
					event.initMouseEvent( 'click', true, true, window, 0, 0, 0, 80, 20,
						false, false, false, false, button, null );
				}

				return event;
			}
		},

		// (#2845)
		'test normalizeMouseButton': function() {
			var isIe8 = CKEDITOR.env.ie && CKEDITOR.env.version < 9;

			generateMouseButtonAsserts( [
				[ CKEDITOR.MOUSE_BUTTON_LEFT, 1 ],
				[ CKEDITOR.MOUSE_BUTTON_MIDDLE, 4 ],
				[ CKEDITOR.MOUSE_BUTTON_RIGHT, 2 ]
			] );

			function generateMouseButtonAsserts( inputs ) {
				CKEDITOR.tools.array.forEach( inputs, function( input ) {
					assert.areSame( input[ 0 ],
						CKEDITOR.tools.normalizeMouseButton( input[ isIe8 ? 1 : 0 ] ) );
				} );
			}
		},

		// (#2845)
		'test reversed normalizeMouseButton': function() {
			var isIe8 = CKEDITOR.env.ie && CKEDITOR.env.version < 9;

			generateMouseButtonAsserts( [
				[ CKEDITOR.MOUSE_BUTTON_LEFT, 1 ],
				[ CKEDITOR.MOUSE_BUTTON_MIDDLE, 4 ],
				[ CKEDITOR.MOUSE_BUTTON_RIGHT, 2 ]
			] );

			function generateMouseButtonAsserts( inputs ) {
				CKEDITOR.tools.array.forEach( inputs, function( input ) {
					assert.areSame( input[ isIe8 ? 1 : 0 ],
						CKEDITOR.tools.normalizeMouseButton( input[ 0 ], true ) );
				} );
			}
		},

		// #662
		'test hexstring to bytes converter': function() {
			var testCases = [
				{
					hex: '00',
					bytes:	[ 0 ]
				},
				{
					hex: '000000',
					bytes: [ 0, 0, 0 ]
				},
				{
					hex: '011001',
					bytes: [ 1, 16, 1 ]
				},
				{
					hex: '0123456789ABCDEF',
					bytes: [ 1, 35, 69, 103, 137, 171, 205, 239 ]
				},
				{
					hex: 'FFFFFFFF',
					bytes: [ 255, 255, 255, 255 ]
				},
				{
					hex: 'fc0fc0',
					bytes: [ 252, 15, 192 ]
				},
				{
					hex: '08A11D8ADA2B',
					bytes: [ 8, 161, 29, 138, 218, 43 ]
				}
			];
			CKEDITOR.tools.array.forEach( testCases, function( test ) {
				arrayAssert.itemsAreEqual( test.bytes, CKEDITOR.tools.convertHexStringToBytes( test.hex ) );
			} );
		},

		// #662
		'test bytes to base64 converter': function() {
			var testCases = [
				{
					bytes: [ 0 ],
					base64: 'AA=='
				},
				{
					bytes: [ 0, 0, 0 ],
					base64: 'AAAA'
				},
				{
					bytes: [ 1, 16, 1 ],
					base64: 'ARAB'
				},
				{
					bytes: [ 1, 35, 69, 103, 137, 171, 205, 239 ],
					base64: 'ASNFZ4mrze8='
				},
				{
					bytes: [ 255, 255, 255 ],
					base64: '////'
				},
				{
					bytes: [ 252, 15, 192 ],
					base64: '/A/A'
				},
				{
					bytes: [ 8, 161, 29, 138, 218, 43 ],
					base64: 'CKEditor'
				},
				{
					// jscs:disable
					bytes: [ 0, 16, 131, 16, 81, 135, 32, 146, 139, 48, 211, 143, 65, 20, 147, 81, 85, 151, 97, 150, 155, 113, 215, 159, 130, 24, 163, 146, 89, 167, 162, 154, 171, 178, 219, 175, 195, 28, 179, 211, 93, 183, 227, 158, 187, 243, 223, 191 ],
					// jscs:enable
					base64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
				}
			];

			CKEDITOR.tools.array.forEach( testCases, function( test ) {
				assert.areSame( test.base64, CKEDITOR.tools.convertBytesToBase64( test.bytes ) );
			} );
		},

		// (#2224)
		'test convertToPx': function() {
			// (#3717)
			if ( bender.tools.env.mobile ) {
				assert.ignore();
			}

			var conversionArray = [ {
				input: '10px',
				output: 10
			}, {
				input: '-15px',
				output: -15
			}, {
				input: '10pt',
				output: 13
			}, {
				input: '-20px',
				output: -20
			}, {
				input: '.25in',
				output: 24
			}, {
				input: '-.5in',
				output: -48
			}, {
				input: '50%',
				output: '50%'
			} ];

			CKEDITOR.tools.array.forEach( conversionArray, function( item ) {
				assert.areSame( item.output, CKEDITOR.tools.convertToPx( item.input ), 'Value ' + item.input + ' should be converted to ' + item.output );
			} );
		},

		// (#5158)
		'test convertToPx works after calculator element was removed': function() {
			// Attach calculator element to the DOM.
			CKEDITOR.tools.convertToPx( '10px' );

			// Based on convertToPx implementation
			// calculator is the last element under `body` after `convertToPx` invocation.
			var bodyChildren = CKEDITOR.document.getBody().getChildren(),
				calculator = bodyChildren.getItem( bodyChildren.count() - 1 );

			calculator.remove();

			var result = CKEDITOR.tools.convertToPx( '10px' );
			assert.areEqual( 10, result );
		},

		'test bind without context and without arguments': function() {
			var testSpy = sinon.spy(),
				bindedFn = CKEDITOR.tools.bind( testSpy );

			bindedFn( 'foo' );
			assert.areSame( 1, testSpy.callCount );
			assert.isTrue( testSpy.calledWithExactly( 'foo' ) );

			bindedFn( 'bar' );
			assert.areSame( 2, testSpy.callCount );
			assert.isTrue( testSpy.calledWithExactly( 'bar' ) );
		},

		'text bind with context and without arguments': function() {
			var testSpy = sinon.spy(),
				testObj = {},
				bindedFn = CKEDITOR.tools.bind( testSpy, testObj );

			bindedFn( 'foo' );
			assert.areSame( 1, testSpy.callCount );
			assert.areSame( testObj, testSpy.getCall( 0 ).thisValue );
			assert.isTrue( testSpy.calledWithExactly( 'foo' ) );

			bindedFn( 'bar' );
			assert.areSame( 2, testSpy.callCount );
			assert.areSame( testObj, testSpy.getCall( 1 ).thisValue );
			assert.isTrue( testSpy.calledWithExactly( 'bar' ) );
		},

		// (#3247)
		'test bind without context and with arguments': function() {
			var testSpy = sinon.spy(),
				bindedFn = CKEDITOR.tools.bind( testSpy, null, 'baz', 100 );

			bindedFn( 'foo' );
			assert.areSame( 1, testSpy.callCount );
			assert.isTrue( testSpy.calledWithExactly( 'baz', 100, 'foo' ) );

			bindedFn( 'bar' );
			assert.areSame( 2, testSpy.callCount );
			assert.isTrue( testSpy.calledWithExactly( 'baz', 100, 'bar' ) );
		},

		// (#3247)
		'text bind with context and with arguments': function() {
			var testSpy = sinon.spy(),
				testObj = {},
				bindedFn = CKEDITOR.tools.bind( testSpy, testObj, 'baz', 100 );

			bindedFn( 'foo' );
			assert.areSame( 1, testSpy.callCount );
			assert.areSame( testObj, testSpy.getCall( 0 ).thisValue );
			assert.isTrue( testSpy.calledWithExactly( 'baz', 100, 'foo' ) );

			bindedFn( 'bar' );
			assert.areSame( 2, testSpy.callCount );
			assert.areSame( testObj, testSpy.getCall( 0 ).thisValue );
			assert.isTrue( testSpy.calledWithExactly( 'baz', 100, 'bar' ) );
		},

		// (#4761)
		'test buildStyleHtml returns relative URL for passed relative URL string': function() {
			var relativeUrl = '/file.css',
				styledStringElem = CKEDITOR.tools.buildStyleHtml( relativeUrl );

			assert.areSame( -1, styledStringElem.indexOf( 'http' ), 'http should not be present in relative URL' );
		},

		// (#4761)
		'test buildStyleHtml returns absolute URL for passed absolute URL string': function() {
			var relatedUrl = 'http://example.com/file.css',
				styledStringElem = CKEDITOR.tools.buildStyleHtml( relatedUrl ),
				httpPosition = styledStringElem.indexOf( 'http' );

			assert.isTrue( httpPosition > -1 , 'Absolute URL missed http protocol' );
		},

		// (#4761)
		'test buildStyleHtml returns passed style text embedded in style element': function() {
			var styleText = '*{color:red}',
				expected = '<style>' + styleText + '</style>',
				styledStringElem = CKEDITOR.tools.buildStyleHtml( styleText );

			assert.areSame( expected, styledStringElem, 'Styled text was not exact same wrapped in style element' );
		},

		// (#4761)
		'test buildStyleHtml with no timestamp returns stylesheet URL without cache key for passed string': function() {
			var originalTimestamp = CKEDITOR.timestamp,
				relativeUrl = '/file.css',
				expectedHref = 'href="' + relativeUrl + '"',
				html;

			CKEDITOR.timestamp = '';
			html = CKEDITOR.tools.buildStyleHtml( relativeUrl );
			var expectedPosition = html.indexOf( expectedHref );

			CKEDITOR.timestamp = originalTimestamp;
			assert.isTrue( expectedPosition > -1, 'Built HTML does not contains expected href attribute' );
		},

		// (#4761)
		'test buildStyleHtml adds timestamp as cache key to provided URL': function() {
			var originalTimestamp = CKEDITOR.timestamp,
				relativeUrl = '/file.css',
				fakeTimestamp = 'cke4',
				expectedHref = 'href="' + relativeUrl + '?t=' + fakeTimestamp + '"',
				html;

			CKEDITOR.timestamp = fakeTimestamp;
			html = CKEDITOR.tools.buildStyleHtml( relativeUrl );
			var expectedPosition = html.indexOf( expectedHref );

			CKEDITOR.timestamp = originalTimestamp;
			assert.isTrue( expectedPosition > -1, 'Built HTML does not contains expected href with timestamp' );
		},

		// (#4761)
		'test buildStyleHtml adds timestamp as cache key to provided URLs': function() {
			var originalTimestamp = CKEDITOR.timestamp,
				relativeUrls = [ '/file.css', '../file2.css' ],
				fakeTimestamp = 'cke4',
				expectedHrefs = [
					'href="' + relativeUrls[ 0 ] + '?t=' + fakeTimestamp + '"',
					'href="' + relativeUrls[ 1 ] + '?t=' + fakeTimestamp + '"'
				],
				html;

			CKEDITOR.timestamp = fakeTimestamp;
			html = CKEDITOR.tools.buildStyleHtml( relativeUrls );

			CKEDITOR.timestamp = originalTimestamp;

			CKEDITOR.tools.array.forEach( expectedHrefs, function( expectedHref ) {
				var expectedPosition = html.indexOf( expectedHref );
				assert.isTrue( expectedPosition > -1, 'Built HTML does not contains expected hrefs with timestamp' );
			} );
		},

		// (#5184)
		'test debounce is called only once after multiple function calls': function() {
			var spy = sinon.spy(),
				timer = sinon.useFakeTimers(),
				debouncedFn = CKEDITOR.tools.debounce( spy, 100 );

			timer.tick( 50 );

			debouncedFn();
			debouncedFn();
			debouncedFn();

			timer.tick( 50 );

			debouncedFn();
			debouncedFn();
			debouncedFn();

			// Calling debounced function resets timer, so we have to use the original delay.
			timer.tick( 100 );
			timer.restore();

			assert.isTrue( spy.calledOnce );
		},

		// (#5184)
		'test debounce uses proper caller context': function() {
			var timer = sinon.useFakeTimers(),
				context = {},
				debouncedFn = CKEDITOR.tools.debounce( someFunc, 100 );

			// Change function context.
			debouncedFn = CKEDITOR.tools.bind( debouncedFn, context );

			debouncedFn();

			timer.tick( 100 );
			timer.restore();

			assert.isTrue( context.called );

			function someFunc() {
				this.called = true;
			}
		}
	} );
} )();
