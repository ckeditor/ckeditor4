/* bender-tags: editor,dom */

( function() {
	'use strict';

	bender.test( {
		'test nodeList.toArray()': function() {
			var list = CKEDITOR.document.find( '#playground span[id]' ),
				ret = list.toArray();

			assert.isArray( ret );
			assert.areSame( 3, ret.length, 'Array length' );

			for ( var i = 0; i < ret.length; i++ ) {
				assert.areSame( list.getItem( i ), ret[ i ], 'Item ' + i );
			}
		},

		'test nodeList.toArray() empty list': function() {
			var ret = CKEDITOR.document.find( '#nonExistingId__' ).toArray();

			assert.isArray( ret );
			assert.areSame( 0, ret.length, 'Array length' );
		}
	} );

} )();
