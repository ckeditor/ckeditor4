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
		if ( !( CKEDITOR.env.safari || CKEDITOR.env.chrome ) ) {
			assert.ignore();
		}

		assert.isTrue( CKEDITOR.env.webkit );
	},

	'test edge is ie12+': function() {
		if ( !CKEDITOR.env.edge ) {
			assert.ignore();
		}

		assert.isTrue( CKEDITOR.env.ie, 'is ie' );
		assert.isTrue( CKEDITOR.env.version >= 12, 'version >= 12' );
	},

	'test isCompatible': function() {
		assert.isTrue( CKEDITOR.env.isCompatible );
	}
} );