/* bender-tags: editor */
/* bender-ckeditor-plugins: undo,clipboard,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {

		setUp: function() {
			this.editor.undoManager.reset();
			this.editor.undoManager._filterRules = [];
		},

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
		},

		// (#3245)
		'test filter.filterData (double replace)': function() {
			var editor = this.editor,
				undoManager = editor.undoManager,
				data = 'foobarfoobazfoobar';

			undoManager.addFilterRule( function( data ) {
				return data.replace( /foo/g, 'ba' );
			} );

			undoManager.addFilterRule( function( data ) {
				return data.replace( /bab/g, 'f' );
			} );

			sinon.stub( editor, 'getSnapshot' ).returns( data );

			var newData = new CKEDITOR.plugins.undo.Image( editor, true ).contents;

			editor.getSnapshot.restore();

			assert.areEqual( 'farfazfar', newData );
		},

		// (#3245)
		'test filter.filterData (multiple replace)': function() {
			var editor = this.editor,
				undoManager = editor.undoManager,
				data = 'foobarfoobazfoobar';

			undoManager.addFilterRule( function( data ) {
				return data.replace( /foo/g, 'bar' );
			} );

			undoManager.addFilterRule( function( data ) {
				return data.replace( /bar/g, 'far' );
			} );

			undoManager.addFilterRule( function( data ) {
				return data.replace( /farfar/g, '-' );
			} );

			sinon.stub( editor, 'getSnapshot' ).returns( data );

			var newData = new CKEDITOR.plugins.undo.Image( editor, true ).contents;

			editor.getSnapshot.restore();

			assert.areEqual( '-farbaz-', newData );
		}
	} );
} )();
