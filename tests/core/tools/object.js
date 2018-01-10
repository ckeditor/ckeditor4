/* bender-tags: editor */

( function() {
	'use strict';
	bender.test( {
		setUp: function() {
			this.object = CKEDITOR.tools.object;
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
