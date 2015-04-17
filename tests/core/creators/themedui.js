/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,toolbar,table */

( function() {
	'use strict';

	function getEditorContentHeight( editor ) {
		return editor.ui.space( 'contents' ).$.offsetHeight;
	}

	function getEditorOuterHeight( editor ) {
		return editor.container.$.offsetHeight;
	}

	bender.editor = {
		config: {
			// Set the empty toolbar, so bazillions of buttons in the build mode will not
			// break the resize event test (the height comparison).
			toolbar: [ [ 'Table' ] ]
		}
	};

	bender.test( {
		'test resize event': function() {
			var editor = this.editor,
			lastResizeData = 0;

			editor.on( 'resize', function( evt ) {
				lastResizeData = evt.data;
			} );

			editor.resize( 100, 400 );
			assert.areSame( 400, lastResizeData.outerHeight, 'Outer height should be same as passed one in 2nd argument.' );
			assert.areSame( 100, lastResizeData.outerWidth, 'Outer width should be same as passed one in 1st argument.' );
			assert.areSame( getEditorContentHeight( editor ), lastResizeData.contentsHeight, 'Content height should be same as calculated one.' );
			assert.areSame( 400, getEditorOuterHeight( editor ), 'Outer height should be properly set.' );

			editor.resize( 100, 400, true );
			assert.areSame( getEditorOuterHeight( editor ), lastResizeData.outerHeight, 'Outer height should be same as calculated one.' );
			assert.areSame( 100, lastResizeData.outerWidth, 'Outer width should be same as passed one in 1st argument.' );
			assert.areSame( 400, lastResizeData.contentsHeight, 'Content height should be same as passed one in 2nd argument.' );
			assert.areSame( 400, getEditorContentHeight( editor ), 'Content height should be properly set.' );
		},

		'test initial properties': function() {
			var editor = this.editor;

			assert.areSame( 'cke_' + editor.name, editor.container.getId() );
			assert.areSame( editor.ui.space( 'contents' ), editor.ui.contentsElement );
		}
	} );
} )();