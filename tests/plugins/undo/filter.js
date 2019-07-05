/* bender-tags: editor */
/* bender-ckeditor-plugins: undo,clipboard,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		// (#3245)
		'test filter.addRule': function() {
			var undoFilter = this.editor.undoManager.filter,
				rule = function() {};

			undoFilter.addRule( rule );

			assert.areSame( rule, undoFilter.rules.pop() );
		},
		// (#3245)
		'test filter.filterData': function() {
			var undoFilter = this.editor.undoManager.filter,
				data = 'foobarfoobazfoobar';

			undoFilter.addRule( function( data ) {
				return data.replace( /foo/g, '' );
			} );

			undoFilter.addRule( function( data) {
				return data.replace( /bar/g, 'far' );
			} );

			var newData = undoFilter.filterData( data );

			assert.areEqual( 'farbazfar', newData );
		}
	} );
} )();
