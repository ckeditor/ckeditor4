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
		}
	} );
} )();
