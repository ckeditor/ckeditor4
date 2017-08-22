/* bender-tags: editor,unit */

( function() {
	'use strict';

	bender.test( {
		'test filter.clone': function() {
			var filter = new CKEDITOR.filter( 'p' ),
				clone;

			filter.allow( 'b' );

			clone = filter.clone();

			assert.areNotSame( filter, clone, 'Returned clone is not the same object' );

			assert.isTrue( clone.check( 'b' ), 'b is allowed' );
			assert.isFalse( clone.check( 'em' ), 'em is no allowed' );
		},

		'test filter.clone disallowed content': function() {
			var filter = new CKEDITOR.filter( 'p strong em' ),
				clone;

			filter.disallow( 'strong' );

			clone = filter.clone();

			assert.isFalse( clone.check( 'strong' ), 'strong is no allowed' );
		},

		'test filter.clone are not bound': function() {
			// We need to make sure that modifying clone won't affect the original filter.
			var filter = new CKEDITOR.filter( 'p strong em div' ),
				clone = filter.clone();

			clone.allow( 'sub' );
			clone.disallow( 'strong' );

			assert.isFalse( filter.check( 'sub' ), 'sub remains not allowed' );
			assert.isTrue( filter.check( 'strong' ), 'strong remains allowed' );
		}
	} );
} )();
