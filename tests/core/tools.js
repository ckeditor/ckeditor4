/* bender-tags: editor,unit */

var vendorPrefix = CKEDITOR.env.gecko ? '-moz-' :
				   CKEDITOR.env.webkit ? '-webkit-' :
				   CKEDITOR.env.ie ? '-ms-' :
				   '';

bender.test(
{
		assertNormalizedCssText: function( expected, elementId, msg ) {
			assert.areSame( expected, CKEDITOR.tools.normalizeCssText(
				CKEDITOR.document.getById( elementId ).getAttribute( 'style' ) ), msg );
		},

		test_extend: function() {
			var fakeFn = function() {};
			var fakeObj = { fake1 : 1, fake2 : 2 };
			var fakeArray = [ 'Test', 10, fakeFn, fakeObj ];

			var target =
			{
				prop1 : 'Test',
				prop2 : 10,
				prop3 : fakeFn,
				prop4 : fakeObj,
				prop5 : fakeArray
			};

			CKEDITOR.tools.extend( target,
				{
					prop3 : 'Wrong',
					prop6 : 'Good',
					prop7 : fakeArray
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

		test_htmlEncode1: function() {
			assert.areSame( '&lt;b&gt;Test&lt;/b&gt;', CKEDITOR.tools.htmlEncode( '<b>Test</b>' ) );
		},

		test_htmlEncode2: function() {
			assert.areSame( 'Test\'s &amp; "quote"', CKEDITOR.tools.htmlEncode( 'Test\'s & "quote"' ) );
		},

		test_htmlEncode3: function() {
			assert.areSame( 'A   B   \n\n\t\tC\n \t D', CKEDITOR.tools.htmlEncode( 'A   B   \n\n\t\tC\n \t D' ), 'Tab should not be touched.' );
		},

		test_htmlDecode: function() {
				assert.areSame( '<a & b >', CKEDITOR.tools.htmlDecode( '&lt;a &amp; b &gt;' ), 'Invalid result for htmlDecode' );
				assert.areSame( '<a & b ><a & b >', CKEDITOR.tools.htmlDecode( '&lt;a &amp; b &gt;&lt;a &amp; b &gt;' ), 'Invalid result for htmlDecode' );
		},

		test_htmlEncode_3874: function() {
			assert.areSame( 'line1\nline2', CKEDITOR.tools.htmlEncode( 'line1\nline2' ) );
		},

		test_htmlEncodeAttr: function() {
			assert.areSame( '&lt;a b=&quot;c&quot;/&gt;', CKEDITOR.tools.htmlEncodeAttr( '<a b="c"/>' ) );
		},

		test_cssStyleToDomStyle1: function() {
			assert.areSame( 'backgroundColor', CKEDITOR.tools.cssStyleToDomStyle( 'background-color' ) );
		},

		test_cssStyleToDomStyle2: function() {
			assert.areSame( ( CKEDITOR.env.ie && !( document.documentMode > 8 ) ) ? 'styleFloat' : 'cssFloat', CKEDITOR.tools.cssStyleToDomStyle( 'float' ) );
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
			var obj =
			{
				name : 'John',
				cars :
				{
					Mercedes : { color : 'blue' },
					Porsche : { color : 'red' }
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
			var func = CKEDITOR.tools.addFunction( function( argA ) {
				assert.areSame( argA, argARef );
			} );

			var argARef  = 'http://ckeditor.com/index.html#myanchor';
			CKEDITOR.tools.callFunction( func, argARef );
		},

		test_createClass: function() {
			var A = CKEDITOR.tools.createClass(
				{
					_ :
					{
						type: function() {
							return 'A:';
						}
					},
					$: function( name ) {
						this._name = name;
					},
					proto :
					{
						name: function() {
							// Call private method.
							return  this._.type() + this._name;
						}
					}
				} );

			var B = CKEDITOR.tools.createClass(
					{
						base : A,
						$: function() {
							// Call super constructor.
							this.base.apply( this, arguments );
						},
						proto :
						{
							type: function() {
								return 'B:';
							}
						}
					} );

			var C = CKEDITOR.tools.createClass(
				{
					base : B,
					$: function() {
						// Call super constructor recursively.
						this.base.apply( this, arguments );
					},
					proto :
					{
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

		testNormalizeCssText: function() {
			this.assertNormalizedCssText(
				'color:red;font-size:10px;width:10.5em;', 'style1', 'order, lowercase and white spaces' );

			this.assertNormalizedCssText( 'color:red;font-family:arial black,helvetica,georgia;', 'style2', 'font names' );
		},

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

		testCssLength: function() {
			var cssLength = CKEDITOR.tools.cssLength;

			assert.areSame( '', cssLength( false ) );	// reset the style
			assert.areSame( '', cssLength( null ) );	// reset the style
			assert.areSame( '', cssLength( undefined ) );	// reset the style
			assert.areSame( '0px', cssLength( 0 ) );
			assert.areSame( '42px', cssLength( 42 ) );
			assert.areSame( '-42px', cssLength( -42 ) );
			assert.areSame( '42.42px', cssLength( 42.42 ) );
			assert.areSame( '', cssLength( 0/0 ) );	// Gives NaN

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
			for ( var k in obj )
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
		}
	} );