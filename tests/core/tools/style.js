/* bender-tags: editor */

( function() {
	'use strict';

	bender.test( {
		setUp: function() {
			this.parse = CKEDITOR.tools.style.parse;
		},

		'test style.parse.background return type': function() {
			var ret = this.parse.background( 'red url(foo.bar)' );

			assert.isObject( ret, 'Type returned' );
			// Array is also an object, so it needs some extra checking.
			assert.areNotSame( Array, ret.constructor, 'Returned value constructor' );
		},

		'test style.parse.background single background': function() {
			var ret = this.parse.background( 'red url(foo.bar) no-repeat' );

			objectAssert.areEqual( { color: 'red', unprocessed: 'url(foo.bar) no-repeat' }, ret );
		},

		'test style.parse.background unknown markup': function() {
			var ret = this.parse.background( 'foo bar   baz!' );

			objectAssert.areEqual( { unprocessed: 'foo bar   baz!' }, ret );
		},

		'test style.parse.background docs sample': function() {
			var background = CKEDITOR.tools.style.parse.background( '#0C0 url(foo.png)' );
			objectAssert.areEqual( { color: '#0C0', unprocessed: 'url(foo.png)' }, background );
		},

		'test style.parse._findColor empty value': function() {
			var ret = this.parse._findColor( '' );

			assert.isInstanceOf( Array, ret, 'Return type' );
			assert.areSame( 0, ret.length, 'Returned item count' );
		},

		'test style.parse._findColor hex': function() {
			var ret = this.parse._findColor( 'foo #foo #aa1 #000 aa #1234 #123456 #aag #AAB #AAB' );

			arrayAssert.itemsAreEqual( [ '#aa1', '#000', '#123456', '#AAB', '#AAB' ], ret );
		},

		'test style.parse._findColor rgba': function() {
			var ret = this.parse._findColor( 'rgb(255,0,128), rgb(),rgb,rgba(0000), rgb(10%, 10% ,10%) rgba(0,0,0,0.3) rgba(0,0,0,0)' );

			arrayAssert.itemsAreEqual( [ 'rgb(255,0,128)', 'rgb(10%, 10% ,10%)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0)' ], ret );
		},

		'test style.parse._findColor hsla': function() {
			var ret = this.parse._findColor( 'hsl(10,30%,30%)   hsla(10,30%,30%,1)  hsla( 90.5, 10%, 10%, 1)' );

			arrayAssert.itemsAreEqual( [ 'hsl(10,30%,30%)', 'hsla(10,30%,30%,1)', 'hsla( 90.5, 10%, 10%, 1)' ], ret );
		},

		'test style.parse._findColor predefined': function() {
			var ret = this.parse._findColor( 'xa orange red blueish' );

			arrayAssert.itemsAreEqual( [ 'orange', 'red' ], ret );
		},

		'test style.parse.margin 1 member': function() {
			var ret = this.parse.margin( '7px' ),
				expected = {
					/* vertical | horizontal */
					top: '7px',
					right: '7px',
					bottom: '7px',
					left: '7px'
				};

			objectAssert.areEqual( expected, ret );
		},

		'test style.parse.margin 2 members': function() {
			var ret = this.parse.margin( '10px 20px' ),
				expected = {
					/* vertical | horizontal */
					top: '10px',
					right: '20px',
					bottom: '10px',
					left: '20px'
				};

			objectAssert.areEqual( expected, ret );
		},

		'test style.parse.margin 3 members': function() {
			var ret = this.parse.margin( ' 3px 0 2' ),
				expected = {
					top: '3px',
					right: '0',
					bottom: '2',
					left: '0'
				};

			objectAssert.areEqual( expected, ret );
		},

		'test style.parse.margin 4 members': function() {
			var ret = this.parse.margin( ' 20px 2.5em 0 auto	' ),
				expected = {
					top: '20px',
					right: '2.5em',
					bottom: '0',
					left: 'auto'
				};

			objectAssert.areEqual( expected, ret );
		},

		'test style.parse.margin percentage': function() {
			var ret = this.parse.margin( ' 10px 5%;' ),
				expected = {
					top: '10px',
					right: '5%',
					bottom: '10px',
					left: '5%'
				};

			objectAssert.areEqual( expected, ret );
		},

		'test style.parse.margin docs sample': function() {
			objectAssert.areEqual( { top: '3px', right: '0', bottom: '2', left: '0' }, CKEDITOR.tools.style.parse.margin( '3px 0 2' ) );
		},

		// (#1490)
		'test style.parse.sideShorthand docs sample': function() {
			objectAssert.areEqual( { top: 'solid', right: 'dotted', bottom: 'solid', left: 'dotted' }, CKEDITOR.tools.style.parse.sideShorthand( 'solid dotted' ) );
		},

		// (#1490)
		'test style.parse.sideShorthand docs sample with split function': function() {
			objectAssert.areEqual( { top: 'foo', right: 'baz', bottom: 'foo', left: 'baz' },
				CKEDITOR.tools.style.parse.sideShorthand( 'foo baz', split ), 'foo baz' );

			objectAssert.areEqual( { top: 'bar', right: 'quix', bottom: 'bar', left: 'quix' },
				CKEDITOR.tools.style.parse.sideShorthand( 'something else', split ), 'something else' );

			function split( value ) {
				return value.match( /(foo|baz)/g ) || [ 'bar', 'quix' ];
			}
		},

		// (#1490)
		'test style.parse.sideShorthand 1 member': function() {
			objectAssert.areEqual( { top: '1px', right: '1px', bottom: '1px', left: '1px' }, CKEDITOR.tools.style.parse.sideShorthand( '1px' ) );
		},

		// (#1490)
		'test style.parse.sideShorthand 2 members': function() {
			objectAssert.areEqual( { top: '1px', right: '2px', bottom: '1px', left: '2px' }, CKEDITOR.tools.style.parse.sideShorthand( '1px 2px' ) );
		},

		// (#1490)
		'test style.parse.sideShorthand 3 members': function() {
			objectAssert.areEqual( { top: '1px', right: '2px', bottom: '3px', left: '2px' }, CKEDITOR.tools.style.parse.sideShorthand( '1px 2px 3px' ) );
		},

		// (#1490)
		'test style.parse.sideShorthand 4 members': function() {
			objectAssert.areEqual( { top: '1px', right: '2px', bottom: '3px', left: '4px' }, CKEDITOR.tools.style.parse.sideShorthand( '1px 2px 3px 4px' ) );
		},

		// (#1490)
		'test style.border.splitCssValues docs sample': function() {
			var styles = {
				'border-color': 'red blue',
				'border-style': 'solid dotted solid',
				'border-width': '1px 2px 3px 4px'
			};

			objectAssert.areEqual( {
				'border-top': '1px solid red',
				'border-right': '2px dotted blue',
				'border-bottom': '3px solid red',
				'border-left': '4px dotted blue'
			}, CKEDITOR.tools.style.border.splitCssValues( styles ) );
		},

		// (#1490)
		'test style.border.splitCssValues docs sample with fallback': function() {
			var styles = {
					'border-style': 'solid',
					'border-width': '2px'
				},
				fallback = { color: 'red' };

			objectAssert.areEqual( {
				'border-top': '2px solid red',
				'border-right': '2px solid red',
				'border-bottom': '2px solid red',
				'border-left': '2px solid red'
			}, CKEDITOR.tools.style.border.splitCssValues( styles, fallback ) );
		},

		// (#1490)
		'test style.border.splitCssValues side border modifiers': function() {
			var styles = {
				'border-style': 'solid',
				'border-width': '2px',
				'border-color': 'red',
				'border-left-color': 'blue',
				'border-right-width': '10px',
				'border-top-style': 'dotted',
				'border-top-color': 'green'
			};

			objectAssert.areEqual( {
				'border-top': '2px dotted green',
				'border-right': '10px solid red',
				'border-bottom': '2px solid red',
				'border-left': '2px solid blue'
			}, CKEDITOR.tools.style.border.splitCssValues( styles ) );
		},

		// (#1490)
		'test style.border.splitCssValues side border modifiers with fallback': function() {
			var styles = {
					'border-style': 'solid',
					'border-width': '2px',
					'border-left-color': 'blue',
					'border-right-width': '10px',
					'border-top-style': 'dotted',
					'border-top-color': 'green'
				},
				fallback = {
					color: 'red'
				};

			objectAssert.areEqual( {
				'border-top': '2px dotted green',
				'border-right': '10px solid red',
				'border-bottom': '2px solid red',
				'border-left': '2px solid blue'
			}, CKEDITOR.tools.style.border.splitCssValues( styles, fallback ) );
		},

		// (#1490)
		'test style.parse.border is a correct alias': function() {
			var spy = sinon.spy( CKEDITOR.tools.style.border, 'fromCssRule' );

			CKEDITOR.tools.style.parse.border( '3px solid red' );

			spy.restore();

			assert.isTrue( spy.calledOnce );
		},

		// (#1490)
		'test style.border.fromCssRule docs sample': function() {
			assertBorder( { width: '3px', style: 'solid', color: '#ffeedd' }, CKEDITOR.tools.style.border.fromCssRule( '3px solid #ffeedd' ) );
		},

		// (#1490)
		'test style.border.fromCssRule only with width': function() {
			assertBorder( { width: '0%', style: null, color: null }, CKEDITOR.tools.style.border.fromCssRule( '0%' ) );
		},

		// (#1490)
		'test style.border.fromCssRule only with zero width': function() {
			assertBorder( { width: '0', style: null, color: null }, CKEDITOR.tools.style.border.fromCssRule( '0' ) );
		},

		// (#1490)
		'test style.border.fromCssRule only with zero width with dot': function() {
			assertBorder( { width: null, style: null, color: null }, CKEDITOR.tools.style.border.fromCssRule( '0.' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with width and style': function() {
			assertBorder( { width: '0%', style: 'groove', color: null }, CKEDITOR.tools.style.border.fromCssRule( '0% groove' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with mixed color and style': function() {
			assertBorder( { color: '#ff0000', style: 'dotted', width: null }, CKEDITOR.tools.style.border.fromCssRule( '#ff0000 dotted' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with mixed color, style and width': function() {
			assertBorder( { width: '7.5em', color: '#ff0000', style: 'dotted' }, CKEDITOR.tools.style.border.fromCssRule( '#ff0000 dotted 7.5em' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with style only': function() {
			assertBorder( { width: null, style: 'dotted', color: null }, CKEDITOR.tools.style.border.fromCssRule( 'dotted' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with style and rgba color': function() {
			assertBorder( { width: null, style: 'dotted', color: 'rgba(0,0,0,0)' }, CKEDITOR.tools.style.border.fromCssRule( 'dotted rgba(0,0,0,0)' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with style and hsla color': function() {
			assertBorder( { style: 'dotted', color: 'hsla(10,30%,30%,1)' }, CKEDITOR.tools.style.border.fromCssRule( 'dotted hsla(10,30%,30%,1)' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with color white spaces': function() {
			assertBorder( { style: 'solid', color: 'rgba(10,  20, 30,  .75)', width: '1px' },
				CKEDITOR.tools.style.border.fromCssRule( '1px solid rgba(10,  20, 30,  .75)' ) );
		}
	} );

	function assertBorder( expected, actual ) {
		for ( var key in expected ) {
			assert.areEqual( expected[ key ], actual[ key ], 'Property "' + key + '" should have correct value.' );
		}
	}
} )();
