/* bender-tags: editor */

( function() {
	'use strict';

	function createTest( rules, strictCheck ) {
		var filter = new CKEDITOR.filter( rules ),
			number = 1;

		return function( allowed, data, msg ) {
			assert[ allowed ? 'isTrue' : 'isFalse' ]( filter.check( data, true, strictCheck ), msg || ( 'Assertion (' + number + ') failed.' ) );
			number += 1;
		};
	}

	function st( styleDef ) {
		return new CKEDITOR.style( styleDef );
	}

	bender.test( {
		'test element - string': function() {
			var test = createTest( 'p(cl)[title]; a{color}; b' );

			test( true, 'p' );
			test( true, 'a' );
			test( true, 'b' );

			test( false, 'div' );
		},

		'test element - style': function() {
			var test = createTest( 'p(cl)[title]; a{color}; b' );

			test( true, st( { element: 'p' } ) );
			test( true, st( { element: 'a' } ) );
			test( true, st( { element: 'b' } ) );

			test( false, st( { element: 'div' } ) );
		},

		'test element + attributes - string': function() {
			var test = createTest( 'a p[attr1,attr2,attr3*]' );

			test( true, 'p[attr1]' );
			test( true, 'p[attr1,attr2]' );
			test( true, 'p[attr2]' );
			test( true, 'p[attr3]' );
			test( true, 'p[attr3-foo,attr3-bar]' );

			test( false, 'p[attr4]' );
			test( false, 'p(cl)' );
			test( false, 'p{color}' );
			test( false, 'p{attr1}' );
			test( false, 'b' );
			test( false, 'p[attr1,attr2,attr4]' );
			test( false, 'p(cl)[attr1]' );
		},

		'test element + styles - string': function() {
			var test = createTest( 'a p{color,width,border-*}' );

			test( true, 'p{color}' );
			test( true, 'p{color,width}' );
			test( true, 'p{border-width}' );
			test( true, 'p' );

			test( false, 'p{height}' );
			test( false, 'p(cl)' );
			test( false, 'p[attr1]' );
			test( false, 'b' );
			test( false, 'p{color,height}' );
			test( false, 'p(cl)[color]' );
		},

		'test element + styles - style': function() {
			var test = createTest( 'a p{color,width,border-*}' );

			// https://dev.ckeditor.com/ticket/13886
			test( true, st( { element: 'a', styles: {} } ) );
			test( true, st( { element: 'p', styles: { color: 'red' } } ) );
			test( true, st( { element: 'a', styles: { color: 'red', width: '10px' } } ) );
			test( true, st( { element: 'p', styles: { 'border-style': 'solid' } } ) );
			test( true, st( { element: 'p' } ) );

			test( false, st( { element: 'i', styles: { color: 'red' } } ) );
			test( false, st( { element: 'p', styles: { height: '10px' } } ) );
			test( false, st( { element: 'p', attributes: { 'class': 'left' } } ) );
		},

		'test element + classes - string': function() {
			var test = createTest( 'a p(cl1,cl2,cl3*)' );

			test( true, 'p(cl1)' );
			test( true, 'p(cl1,cl2)' );
			test( true, 'p(cl2,cl1)' );
			test( true, 'p(cl2,cl3,cl3c)' );
			test( true, 'p' );

			test( false, 'p{height}' );
			test( false, 'p[attr1]' );
			test( false, 'p(cl4)' );
			test( false, 'p(cl3,cl4)' );
			test( false, 'b' );
			test( false, 'p(cl1)[color]' );
		},

		'test element + classes - style': function() {
			var test = createTest( 'a p(cl1,cl2)' );

			test( true, st( { element: 'p', attributes: { 'class': 'cl1' } } ) );
			test( true, st( { element: 'a', attributes: { 'class': 'cl1 cl2' } } ) );
			test( true, st( { element: 'p' } ) );
			test( true, st( { element: 'a', attributes: { 'class': 'cl2 cl1' } } ) );

			test( false, st( { element: 'p', styles: { height: '10px' } } ) );
			test( false, st( { element: 'p', attributes: { 'class': 'cl3' } } ) );
			test( false, st( { element: 'p', attributes: { foo: 'bar' } } ) );
		},

		'test dynamic rules adding': function() {
			var filter = new CKEDITOR.filter( 'p' );

			assert.isTrue( filter.check( 'p' ) );

			filter.allow( 'a' );

			assert.isTrue( filter.check( 'p' ) );
			assert.isTrue( filter.check( 'a' ) );
			assert.isFalse( filter.check( 'b' ) );
		},

		// These tests show how useless may be strict mode.
		// a[href] does not pass because it's empty. This may have more
		// sense in the future after allowing passing htmlParser.elements to check().
		// But for now these test just check if everything work as it is indented to.
		'test checks with strict check': function() {
			var test = createTest( 'a[href,name]; img[src,data-*]; b[data-*]', true );

			test( true, 'a[name]' );
			test( true, 'a[name,href]' );
			test( true, 'img[src]' );
			test( true, 'img[src,data-foo]' );
			test( true, 'b[data-x]' );
			test( true, 'b' );

			test( false, 'a' );
			test( false, 'a[href]' );
			test( false, 'a[foo]' );
			test( false, 'img' );
			test( false, 'img[alt]' );
		},

		'test required attributes with strict check': function() {
			var test = createTest( 'c[!attr1,attr2,!attr3]; b[!attr1]; b[!attr2]; d[!data-*,attr1]', true );

			test( true, 'c[attr1,attr2,attr3]' );
			test( true, 'c[attr1,attr3]' );
			test( true, 'b[attr1,attr2]' );
			test( true, 'b[attr1]' );
			test( true, 'd[data-x,data-y,attr1]' );
			test( true, 'd[data-x]' );

			test( false, 'c' );
			test( false, 'c[attr1]' );
			test( false, 'c[attr1,attr2]' );
			test( false, 'b' );
			test( false, 'd[attr1]' );
			test( false, 'd' );
		},

		// Identical to 'test required attributes'.
		'test required styles with strict check': function() {
			var test = createTest( 'c{!st1,st2,!st3}; b{!st1}; b{!st2}; d{!data-*,st1}', true );

			test( true, 'c{st1,st2,st3}' );
			test( true, 'c{st1,st3}' );
			test( true, 'b{st1,st2}' );
			test( true, 'b{st1}' );
			test( true, 'd{data-x,data-y,st1}' );
			test( true, 'd{data-x}' );

			test( false, 'c' );
			test( false, 'c{st1}' );
			test( false, 'c{st1,st2}' );
			test( false, 'b' );
			test( false, 'd{st1}' );
			test( false, 'd' );
		},

		// Identical to 'test required attributes'.
		'test required classes with strict check': function() {
			var test = createTest( 'c(!cl1,cl2,!cl3); b(!cl1); b(!cl2); d(!cl-*,cl1)', true );

			test( true, 'c(cl1,cl2,cl3)' );
			test( true, 'c(cl1,cl3)' );
			test( true, 'b(cl1,cl2)' );
			test( true, 'b(cl1)' );
			test( true, 'd(cl-x,cl-y,cl1)' );
			test( true, 'd(cl-x)' );

			test( false, 'c' );
			test( false, 'c(cl1)' );
			test( false, 'c(cl1,cl2)' );
			test( false, 'b' );
			test( false, 'd(cl1)' );
			test( false, 'd' );
		},

		'test required properties with strict check': function() {
			var test = createTest( {
				f: {
					classes: 'cl1,!cl2',
					attributes: '!attr1'
				},
				'b c': {
					styles: '!st1,!st2',
					propertiesOnly: true
				},
				b: true,
				d: {
					classes: { cl1: true, cl2: true },
					requiredClasses: 'cl2',
					attributes: [ '!attr1', 'attr2', 'attr3', 'attr4' ],
					requiredAttributes: [ 'attr3', 'attr4' ],
					styles: { st1: true, st2: true, st3: true },
					requiredStyles: 'st2,st3'
				},
				e: {
					classes: '*',
					requiredClasses: 'cl1,cl2'
				}
			}, true );

			test( true, 'f(cl1,cl2)[attr1]' );
			test( true, 'f(cl2)[attr1]' );
			test( true, 'b{st1,st2}' );
			test( true, 'd(cl2)[attr1,attr3,attr4]{st2,st3}' );
			test( true, 'd(cl1,cl2)[attr1,attr2,attr3,attr4]{st1,st2,st3}' );
			test( true, 'e(cl1,cl2,cl3,cl4)' );

			test( false, 'f' );
			test( false, 'f(cl2)' );
			test( false, 'f(cl1)[attr1]' );
			test( false, 'b{st1}' );
			test( false, 'c{st1,st2}' );
			test( false, 'd(cl1)[attr1,attr3,attr4]{st2,st3}' );
			test( false, 'd(cl2)[attr3,attr4]{st2,st3}' );
			test( false, 'd(cl2)[attr1,attr4]{st2,st3}' );
			test( false, 'd(cl2)[attr1,attr3]{st2,st3}' );
			test( false, 'd(cl2)[attr1,attr3,attr4]{st1,st3}' );
			test( false, 'e(cl1,cl3)' );
		},

		'test required properties with normal check': function() {
			var test = createTest( 'a[!attr1,attr2](cl1,!cl2); b[!attr-*]' );

			test( true, 'a[attr1,attr2](cl1,cl2)' );
			test( true, 'a[attr2]' );
			test( true, 'a[attr1]' );
			test( true, 'a[attr1](cl1)' );
			test( true, 'a(cl1)' );
			test( true, 'a(cl2)' );
			test( true, 'a' );
			test( true, 'b[attr-x]' );
			test( true, 'b[attr-x,attr-y]' );

			test( false, 'a[attr3]' );
			test( false, 'a[attr1,attr3]' );
			test( false, 'b[foo]' );
		},

		'test two required properties with wildcards': function() {
			var test = createTest( 'b[!x-*,!y-*]; c[!x-*](!c-*)' );

			test( true, 'b[x-a,y-a]' );
			test( true, 'b[x-a,y-a,y-b]' );
			test( true, 'c[x-a](c-a)' );
			test( true, 'b[x-a]' );
			test( true, 'b[y-a,y-b]' );
			test( true, 'c(c-a)' );
			test( true, 'c[x-a]' );

			test( false, 'b[foo]' );
			test( false, 'c(bar,c-x)' );
		},

		'test two required properties with wildcards with strict check': function() {
			var test = createTest( 'b[!x-*,!y-*]; c[!x-*](!c-*)', true );

			test( true, 'b[x-a,y-a]' );
			test( true, 'b[x-a,y-a,y-b]' );
			test( true, 'c[x-a](c-a)' );

			test( false, 'b[x-a]' );
			test( false, 'b[y-a,y-b]' );
			test( false, 'c(c-a)' );
			test( false, 'c[x-a]' );
		},

		'test checks cache': function() {
			var filter = new CKEDITOR.filter( 'img[!src]' );

			filter.addTransformations( [
				[
					{
						element: 'img',
						right: function( el ) {
							el.attributes.src = '1';
						}
					}
				]
			] );

			assert.isTrue( filter.check( 'img' ) );
			assert.isFalse( filter.check( 'img', false, true ), 'Cache should be aware of 3rd arg.' );
			assert.isTrue( filter.check( 'img', true, true ), 'Cache should be aware of 2nd arg.' );
		},

		'test check with transformations': function() {
			var filter = new CKEDITOR.filter( 'img[width,height]' );

			filter.addTransformations( [
				[ 'img{width}: sizeToStyle', 'img[width]: sizeToAttribute' ]
			] );

			assert.isTrue( filter.check( 'img' ) );
			assert.isTrue( filter.check( 'img[width]' ) );
			assert.isTrue( filter.check( 'img[height]' ) );
			assert.isTrue( filter.check( 'img[width,height]' ) );
			assert.isTrue( filter.check( 'img{width}' ) );
			assert.isTrue( filter.check( 'img{width,height}' ) );
			assert.isTrue( filter.check( new CKEDITOR.style( { element: 'img' } ) ) );
			assert.isTrue( filter.check( new CKEDITOR.style( { element: 'img', attributes: { width: '10', height: '20' } } ) ) );
			assert.isTrue( filter.check( new CKEDITOR.style( { element: 'img', styles: { width: '10px', height: '20px' } } ) ) );

			assert.isFalse( filter.check( 'b' ) );
			assert.isFalse( filter.check( 'img{width,border}' ) );
		},

		'test check with transformations 2': function() {
			var filter = new CKEDITOR.filter( 'img{width,height}' );

			filter.addTransformations( [
				[ 'img{width}: sizeToStyle', 'img[width]: sizeToAttribute' ]
			] );

			assert.isTrue( filter.check( 'img' ) );
			assert.isTrue( filter.check( 'img[width]' ) );
			assert.isTrue( filter.check( 'img[height]' ) );
			assert.isTrue( filter.check( 'img[width,height]' ) );
			assert.isTrue( filter.check( 'img{width}' ) );
			assert.isTrue( filter.check( 'img{width,height}' ) );
			assert.isTrue( filter.check( new CKEDITOR.style( { element: 'img' } ) ) );
			assert.isTrue( filter.check( new CKEDITOR.style( { element: 'img', attributes: { width: '10', height: '20' } } ) ) );
			assert.isTrue( filter.check( new CKEDITOR.style( { element: 'img', styles: { width: '10px', height: '20px' } } ) ) );

			assert.isFalse( filter.check( 'b' ) );
			assert.isFalse( filter.check( 'img{width,border}' ) );
		},

		'test check with rules as an array': function() {
			var test = createTest( 'a' );

			test( true, [ 'a', 'x' ] );
			test( true, [ 'x', 'a', 'x' ] );
			test( true, [ 'x', 'a' ] );
			test( false, [ 'x' ] );
			test( false, [ 'x', 'y' ] );
		}
	} );
} )();
