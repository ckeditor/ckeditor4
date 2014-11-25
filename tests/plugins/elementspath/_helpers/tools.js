/* exported elementspathTestsTools */

var elementspathTestsTools = ( function() {
	'use strict';

	// @param {String} tags Expected elements path (excludding body) as string
	// i.e. 'p,strong,span'.
	var assertPath = function( tags ) {
		var path = this.editor.ui.space( 'path' );
		path = path.getElementsByTag( 'a' );
		var list = [];
		for ( var i = 0, length = path.count(), el; i < length; i++ ) {
			el = path.getItem( i );
			list.push( el.getText() );
		}

		var expected = [];
		expected.push( this.editor.editable().getName() );
		expected = expected.concat( tags.split( ',' ) );

		assert.areEqual( expected, list.join( ',' ), 'Invalid elements path.' );
	};

	return {
		assertPath: assertPath
	};
} )();