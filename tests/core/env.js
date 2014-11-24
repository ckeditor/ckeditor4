/* bender-tags: editor,unit */

'use strict';

function countTrue( names ) {
	names = names.split( ',' );

	var sum = 0,
		name;

	while ( ( name = names.pop() ) ) {
		if ( CKEDITOR.env[ name ] )
			sum += 1;
	}
	return sum;
}

bender.test( {
	'test only one browser is true': function() {
		assert.areSame( 1, countTrue( 'ie,webkit,gecko' ) );
	},

	'test safari and chrome are webkit': function() {
		if ( !( CKEDITOR.env.safari || CKEDITOR.env.chrome ) )
			assert.ignore();

		assert.isTrue( CKEDITOR.env.webkit );
	},

	'test isCompatible': function() {
		assert.isTrue( CKEDITOR.env.isCompatible );
	}
} );