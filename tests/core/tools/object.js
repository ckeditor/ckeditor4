/* bender-tags: editor */

( function() {
	'use strict';
	bender.test( {
		setUp: function() {
			this.object = CKEDITOR.tools.object;
		},

		'test object.keys': function() {
			var keys = CKEDITOR.tools.object.keys;

			arrayAssert.itemsAreEqual( [ 'foo', 'bar', '$ x !/', 'bom' ], keys( { foo: 1, bar: 'a', '$ x !/': false, bom: undefined } ) );
			arrayAssert.itemsAreEqual( [], keys( {} ) );
		},

		// (#3120)
		'test object.keys dont enum attribute': function() {
			var target = CKEDITOR.tools.convertArrayToObject( CKEDITOR.tools.object.DONT_ENUMS, 1 );

			arrayAssert.itemsAreEqual( CKEDITOR.tools.object.DONT_ENUMS,
				CKEDITOR.tools.object.keys( target ) );
		},

		// (#3381)
		'test object.keys on non-objects': function() {
			var keys = CKEDITOR.tools.object.keys,
				fixtures = [
					undefined,
					null,
					function() {},
					1,
					true
				];

			CKEDITOR.tools.array.forEach( fixtures, function( fixture ) {
				arrayAssert.itemsAreEqual( [], keys( fixture ), showFixtureType( fixture ) );
			} );

			function showFixtureType( fixture ) {
				if ( fixture === null ) {
					return 'null';
				}

				return typeof fixture;
			}
		},

		// (#3381)
		'test object.keys for strings': function() {
			arrayAssert.itemsAreEqual( [ '0', '1', '2', '3', '4', '5', '6', '7' ],
				CKEDITOR.tools.object.keys( 'whatever' ) );
		},

		// (#3123)
		'test object.entries': function() {
			var obj = {
					a: 1,
					b: 2,
					c: 3
				},

			result = CKEDITOR.tools.object.entries( obj );

			assert.areEqual( 3, result.length );

			arrayAssert.itemsAreEqual( [ 'a', 1 ], result [0] );
			arrayAssert.itemsAreEqual( [ 'b', 2 ], result [1] );
			arrayAssert.itemsAreEqual( [ 'c', 3 ], result [2] );
		},

		// (#3123)
		'test object.values': function() {
			var obj = {
				a: 1,
				b: 2,
				c: 3
			};

			arrayAssert.itemsAreEqual( [ 1, 2, 3 ], CKEDITOR.tools.object.values( obj ) );
		},

		'test object.findKey': function() {
			var inputObject = {
				'a': 1,
				'b': 'something',
				'c': true
			},
			returned;

			returned = this.object.findKey( inputObject, 1 );
			assert.areSame( returned, 'a' );

			returned = this.object.findKey( inputObject, 'something' );
			assert.areSame( returned, 'b' );

			returned = this.object.findKey( inputObject, true );
			assert.areSame( returned, 'c' );

		},

		'test object.findKey for returning null': function() {
			var inputObject = {
				'a': 1
			},
			returned;

			returned = this.object.findKey( 'notObject', 'a' );
			assert.isNull( returned );

			returned = this.object.findKey( inputObject, 'z' );
			assert.isNull( returned );

			returned = this.object.findKey( inputObject );
			assert.isNull( returned );
		},

		'test object.findKeys for reference object\'s values': function() {
			var example = function() {};
			var innerArray = [ 1, 2, 3 ];
			var innerObject = { 'a': 1, 'b': 2 };

			var inputObject = {
				'a': example,
				'b': innerArray,
				'c': innerObject
			},
			returned;

			returned = this.object.findKey( inputObject, example );
			assert.areSame( returned, 'a' );

			returned = this.object.findKey( inputObject, innerArray );
			assert.areSame( returned, 'b' );

			returned = this.object.findKey( inputObject, innerObject );
			assert.areSame( returned, 'c' );
		},

		// (#1053)
		'test object.merge': function() {
			var obj1 = {
					one: 1,
					conflicted: 10,
					falsy: false,
					nully: null,
					obj: {
						nested1: 1,
						nestedObj: {
							a: 3
						}
					},
					array: [ 1, 2 ]
				},
				obj2 = {
					two: 2,
					conflicted: 20,
					truthy: true,
					undef: undefined,
					obj: {
						nested2: 2,
						nestedObj: {
							b: 4
						}
					},
					array: [ 3, 4 ]
				},
				expected = {
					one: 1,
					two: 2,
					conflicted: 20,
					falsy: false,
					truthy: true,
					nully: null,
					undef: undefined,
					obj: {
						nested1: 1,
						nested2: 2,
						nestedObj: {
							a: 3,
							b: 4
						}
					},
					array: [ 3, 4 ]
				},
				actual = this.object.merge( obj1, obj2 );

			assert.areNotSame( obj1, actual, 'Merging does not modify obj1' );
			assert.areNotSame( obj2, actual, 'Merging does not modify obj2' );
			objectAssert.areDeepEqual( expected, actual, 'Merging produces correct object' );

			// Reversed merge should produce same object, but with different conflicted and array properties.
			expected.conflicted = 10;
			expected.array = [ 1, 2 ];
			actual = this.object.merge( obj2, obj1 );

			assert.areNotSame( obj1, actual, 'Merging does not modify obj1' );
			assert.areNotSame( obj2, actual, 'Merging does not modify obj2' );
			objectAssert.areDeepEqual( expected, actual, 'Merging produces correct object' );
		}
	} );
} )();
