/* bender-tags: editor,unit */

( function() {
	'use strict';

	var vendorPrefix = CKEDITOR.env.gecko ? '-moz-' :
			CKEDITOR.env.webkit ? '-webkit-' :
			CKEDITOR.env.ie ? '-ms-' :
			'';

	var htmlEncode = CKEDITOR.tools.htmlEncode,
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

		'test htmlEncode - #3874': function() {
			assert.areSame( 'line1\nline2', htmlEncode( 'line1\nline2' ) );
		},

		// http://dev.ckeditor.com/ticket/13105#comment:8
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

		test_trim1: function() {
			assert.areSame( 'test', CKEDITOR.tools.trim( '    test   ' ) );
		},

		test_trim2: function() {
			assert.areSame( 'test', CKEDITOR.tools.trim( ' \n \t  test\n  \t ' ) );
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

		// (#10750)
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

		// #14252
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

		'test objectKeys': function() {
			var keys = CKEDITOR.tools.objectKeys;

			arrayAssert.itemsAreEqual( [ 'foo', 'bar', '$ x !/', 'bom' ], keys( { foo: 1, bar: 'a', '$ x !/': false, bom: undefined } ) );
			arrayAssert.itemsAreEqual( [], keys( {} ) );
		},

		'test convertArrayToObject': function() {
			var arr = [ 'foo', 'bar', 'foo' ],
				obj;

			obj = CKEDITOR.tools.convertArrayToObject( arr );
			assert.isTrue( obj.foo );
			assert.isTrue( obj.bar );
			arrayAssert.itemsAreEqual( [ 'foo', 'bar' ], CKEDITOR.tools.objectKeys( obj ) );

			obj = CKEDITOR.tools.convertArrayToObject( arr, 1 );
			assert.areSame( 1, obj.foo );
			assert.areSame( 1, obj.bar );

			arrayAssert.itemsAreEqual( [], CKEDITOR.tools.objectKeys( CKEDITOR.tools.convertArrayToObject( {} ) ) );
		},

		'test eventsBuffer': function() {
			var output = 0,
				buffer = CKEDITOR.tools.eventsBuffer( 200, function() {
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

		'test eventsBuffer.reset': function() {
			var output = 0,
				buffer = CKEDITOR.tools.eventsBuffer( 100, function() {
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

		'test eventsBuffer contex': function() {
			var spy = sinon.spy(),
				ctxObj = {},
				buffer = CKEDITOR.tools.eventsBuffer( 100, spy, ctxObj );

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

		'test checkIfAnyObjectPropertyMatches': function() {
			var c = CKEDITOR.tools.checkIfAnyObjectPropertyMatches,
				r1 = /foo/,
				r2 = /f.*oo/;

			assert.isTrue( c( { foo: 1 }, r1 ) );
			assert.isTrue( c( { foo: 1, bar: 1 }, r1 ) );
			assert.isTrue( c( { bar: 1, fxoo: 1 }, r2 ) );

			assert.isFalse( c( {}, r1 ) );
			assert.isFalse( c( { bar: 1 }, r1 ) );
			assert.isFalse( c( { bar: 1, f: 1, oo: 1 }, r2 ) ); // Ekhem, don't try to objectKeys().join();
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

		'test keystrokeToString': function() {
			var toString = CKEDITOR.tools.keystrokeToString,
				lang = this.editor.lang.common.keyboard,
				tests = [
					// [ Keystroke, display string, display string on Mac, ARIA string, ARIA string on Mac ]
					[ CKEDITOR.CTRL + 65 /*A*/, 'Ctrl+A', '⌘+A', 'Ctrl+A', 'Command+A' ],
					[ CKEDITOR.ALT + 66 /*B*/, 'Alt+B', '⌥+B', 'Alt+B', 'Alt+B' ],
					[ CKEDITOR.SHIFT + 67 /*C*/, 'Shift+C', '⇧+C', 'Shift+C', 'Shift+C' ],
					[ CKEDITOR.CTRL + CKEDITOR.ALT + 68 /*D*/, 'Ctrl+Alt+D', '⌘+⌥+D', 'Ctrl+Alt+D', 'Command+Alt+D' ],
					[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 69 /*E*/, 'Ctrl+Shift+E', '⌘+⇧+E', 'Ctrl+Shift+E', 'Command+Shift+E' ],
					[ CKEDITOR.ALT + CKEDITOR.SHIFT + 70 /*F*/, 'Alt+Shift+F', '⌥+⇧+F', 'Alt+Shift+F', 'Alt+Shift+F' ],
					[ CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + 71 /*G*/, 'Ctrl+Alt+Shift+G', '⌘+⌥+⇧+G', 'Ctrl+Alt+Shift+G', 'Command+Alt+Shift+G' ],
					[ CKEDITOR.CTRL + 32 /*SPACE*/, 'Ctrl+Space', '⌘+Space', 'Ctrl+Space', 'Command+Space' ],
					[ CKEDITOR.ALT + 13 /*ENTER*/, 'Alt+Enter', '⌥+Enter', 'Alt+Enter', 'Alt+Enter' ]
				],
				test,
				expIndex = CKEDITOR.env.mac ? 2 : 1;

			for ( var i = 0, l = tests.length; i < l; i++ ) {
				test = tests[ i ];
				assert.areEqual( test[ expIndex ], toString( lang, test[ 0 ] ).display, 'Keystroke display string representation is invalid.' );
				assert.areEqual( test[ expIndex + 2 ], toString( lang, test[ 0 ] ).aria, 'Keystroke ARIA string representation is invalid.' );
			}
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

		'test escapeCss - standard selector': function() {
			var selector = 'aaa';
			var escapedSelector = CKEDITOR.tools.escapeCss( selector );

			// Check standard selector.
			assert.areSame( escapedSelector, 'aaa', 'standard selector' );
		}
	} );
} )();
