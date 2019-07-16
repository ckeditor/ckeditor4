/* bender-tags: editor */
/* bender-ckeditor-plugins: undo,clipboard,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		// (#3245)
		'test filter.addRule': function() {
			var undoManager = this.editor.undoManager,
				rule = function() {};

			undoManager.addFilterRule( rule );

			assert.areSame( rule, undoManager._filterRules.pop() );
		},
		// (#3245)
		'test filter.filterData': function() {
			var editor = this.editor,
				undoManager = editor.undoManager,
				data = 'foobarfoobazfoobar';

			undoManager.addFilterRule( function( data ) {
				return data.replace( /foo/g, '' );
			} );

			undoManager.addFilterRule( function( data ) {
				return data.replace( /bar/g, 'far' );
			} );

			sinon.stub( editor, 'getSnapshot' ).returns( data );

			var newData = new CKEDITOR.plugins.undo.Image( editor, true ).contents;

			editor.getSnapshot.restore();

			assert.areEqual( 'farbazfar', newData );
		}
	} );
} )();
