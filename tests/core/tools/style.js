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

			assertObject( expected, ret );
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

			assertObject( expected, ret );
		},

		'test style.parse.margin 3 members': function() {
			var ret = this.parse.margin( ' 3px 0 2' ),
				expected = {
					top: '3px',
					right: '0',
					bottom: '2',
					left: '0'
				};

			assertObject( expected, ret );
		},

		'test style.parse.margin 4 members': function() {
			var ret = this.parse.margin( ' 20px 2.5em 0 auto	' ),
				expected = {
					top: '20px',
					right: '2.5em',
					bottom: '0',
					left: 'auto'
				};

			assertObject( expected, ret );
		},

		'test style.parse.margin percentage': function() {
			var ret = this.parse.margin( ' 10px 5%;' ),
				expected = {
					top: '10px',
					right: '5%',
					bottom: '10px',
					left: '5%'
				};

			assertObject( expected, ret );
		},

		'test style.parse.margin docs sample': function() {
			assertObject( { top: '3px', right: '0', bottom: '2', left: '0' }, CKEDITOR.tools.style.parse.margin( '3px 0 2' ) );
		},


		// (#2923)
		'test recognize `windowtext` as a color': function() {
			assertObject( { color: 'windowtext' }, CKEDITOR.tools.style.parse.background( 'windowtext' ) );
		},

		// (#1490)
		'test style.parse.sideShorthand docs sample': function() {
			assertObject( { top: 'solid', right: 'dotted', bottom: 'solid', left: 'dotted' }, CKEDITOR.tools.style.parse.sideShorthand( 'solid dotted' ) );
		},

		// (#1490)
		'test style.parse.sideShorthand docs sample with split function': function() {
			assertObject( { top: 'foo', right: 'baz', bottom: 'foo', left: 'baz' },
				CKEDITOR.tools.style.parse.sideShorthand( 'foo baz', split ), 'foo baz' );

			assertObject( { top: 'bar', right: 'quix', bottom: 'bar', left: 'quix' },
				CKEDITOR.tools.style.parse.sideShorthand( 'something else', split ), 'something else' );

			function split( value ) {
				return value.match( /(foo|baz)/g ) || [ 'bar', 'quix' ];
			}
		},

		// (#1490)
		'test style.parse.sideShorthand 1 member': function() {
			assertObject( { top: '1px', right: '1px', bottom: '1px', left: '1px' }, CKEDITOR.tools.style.parse.sideShorthand( '1px' ) );
		},

		// (#1490)
		'test style.parse.sideShorthand 2 members': function() {
			assertObject( { top: '1px', right: '2px', bottom: '1px', left: '2px' }, CKEDITOR.tools.style.parse.sideShorthand( '1px 2px' ) );
		},

		// (#1490)
		'test style.parse.sideShorthand 3 members': function() {
			assertObject( { top: '1px', right: '2px', bottom: '3px', left: '2px' }, CKEDITOR.tools.style.parse.sideShorthand( '1px 2px 3px' ) );
		},

		// (#1490)
		'test style.parse.sideShorthand 4 members': function() {
			assertObject( { top: '1px', right: '2px', bottom: '3px', left: '4px' }, CKEDITOR.tools.style.parse.sideShorthand( '1px 2px 3px 4px' ) );
		},

		// (#1490)
		'test style.border init': function() {
			var expected = { width: '10px', color: 'red', style: 'solid' };
			assertObject( expected, new CKEDITOR.tools.style.border( expected ) );
		},

		// (#1490)
		'test style.border color normalization': function() {
			assertObject( { color: 'black', width: null, style: null }, new CKEDITOR.tools.style.border( { color: 'windowtext' } ) );
		},

		// (#1490)
		'test style.border.toString is overwriten': function() {
			assert.areEqual( '1px solid red', new CKEDITOR.tools.style.border( { color: 'red', width: '1px', style: 'solid' } ) );
			assert.areEqual( '10px dotted', new CKEDITOR.tools.style.border( { width: '10px', style: 'dotted' } ) );
			assert.areEqual( 'solid blue', new CKEDITOR.tools.style.border( { style: 'solid', color: 'blue' } ) );
		},

		// (#1490)
		'test style.border.splitCssValues docs sample': function() {
			var styles = {
				'border-color': 'red blue',
				'border-style': 'solid dotted solid',
				'border-width': '1px 2px 3px 4px'
			};

			assertObject( {
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

			assertObject( {
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

			assertObject( {
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

			assertObject( {
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
			assertObject( { width: '3px', style: 'solid', color: '#ffeedd' }, CKEDITOR.tools.style.border.fromCssRule( '3px solid #ffeedd' ) );
		},

		// (#1490)
		'test style.border.fromCssRule only with width': function() {
			assertObject( { width: '0%', style: null, color: null }, CKEDITOR.tools.style.border.fromCssRule( '0%' ) );
		},

		// (#1490)
		'test style.border.fromCssRule only with zero width': function() {
			assertObject( { width: '0', style: null, color: null }, CKEDITOR.tools.style.border.fromCssRule( '0' ) );
		},

		// (#1490)
		'test style.border.fromCssRule only with zero width with dot': function() {
			assertObject( { width: null, style: null, color: null }, CKEDITOR.tools.style.border.fromCssRule( '0.' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with width and style': function() {
			assertObject( { width: '0%', style: 'groove', color: null }, CKEDITOR.tools.style.border.fromCssRule( '0% groove' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with mixed color and style': function() {
			assertObject( { color: '#ff0000', style: 'dotted', width: null }, CKEDITOR.tools.style.border.fromCssRule( '#ff0000 dotted' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with mixed color, style and width': function() {
			assertObject( { width: '7.5em', color: '#ff0000', style: 'dotted' }, CKEDITOR.tools.style.border.fromCssRule( '#ff0000 dotted 7.5em' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with style only': function() {
			assertObject( { width: null, style: 'dotted', color: null }, CKEDITOR.tools.style.border.fromCssRule( 'dotted' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with style and rgba color': function() {
			assertObject( { width: null, style: 'dotted', color: 'rgba(0,0,0,0)' }, CKEDITOR.tools.style.border.fromCssRule( 'dotted rgba(0,0,0,0)' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with style and hsla color': function() {
			assertObject( { style: 'dotted', color: 'hsla(10,30%,30%,1)' }, CKEDITOR.tools.style.border.fromCssRule( 'dotted hsla(10,30%,30%,1)' ) );
		},

		// (#1490)
		'test style.border.fromCssRule with color white spaces': function() {
			assertObject( { style: 'solid', color: 'rgba(10,  20, 30,  .75)', width: '1px' },
				CKEDITOR.tools.style.border.fromCssRule( '1px solid rgba(10,  20, 30,  .75)' ) );
		}
	} );

	function assertObject( expected, actual ) {
		for ( var key in expected ) {
			assert.areEqual( expected[ key ], actual[ key ], 'Property "' + key + '" should have correct value.' );
		}
	}
} )();
