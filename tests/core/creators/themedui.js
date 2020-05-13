/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea,toolbar,table */

( function() {
	'use strict';

	// Helper functions
	function getEditorContentHeight( editor ) {
		return editor.ui.space( 'contents' ).$.offsetHeight;
	}

	function getEditorOuterHeight( editor ) {
		return editor.container.$.offsetHeight;
	}

	function getEditorInnerHeight( editor ) {
		return editor.container.findOne( '.cke_inner' ).$.offsetHeight;
	}

	var unitsToTest = [
		// absolute lengths
		'cm', 'mm', 'q', 'in', 'pc', 'pt', 'px'
	];

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
		},

		// (#1883)
		'test resize event with css units': function() {
			var editor = this.editor,
				lastResizeData = 0;

			editor.on( 'resize', function( evt ) {
				lastResizeData = evt.data;
			} );

			for ( var i = 0; i < unitsToTest.length; i++ ) {
				var width = 20 + unitsToTest[i],
					height = 50 + unitsToTest[i];

				editor.resize( width, height );
				assert.areSame( CKEDITOR.tools.convertToPx( height ), lastResizeData.outerHeight );
				assert.areSame( CKEDITOR.tools.convertToPx( width ), lastResizeData.outerWidth );
				assert.areSame( getEditorContentHeight( editor ), lastResizeData.contentsHeight );
				assert.areSame( CKEDITOR.tools.convertToPx( height ), getEditorOuterHeight( editor ) );
			}
		},

		// (#1883)
		'test resize event with css units and isContentHeight': function() {
			var editor = this.editor,
				lastResizeData = 0;

			editor.on( 'resize', function( evt ) {
				lastResizeData = evt.data;
			} );

			for ( var i = 0; i < unitsToTest.length; i++ ) {
				var width = 20 + unitsToTest[i],
					height = 50 + unitsToTest[i];

				editor.resize( width, height, true );
				assert.areSame( getEditorOuterHeight( editor ), lastResizeData.outerHeight );
				assert.areSame( CKEDITOR.tools.convertToPx( width ), lastResizeData.outerWidth );
				assert.areSame( getEditorContentHeight( editor ), lastResizeData.contentsHeight );
				assert.areSame( CKEDITOR.tools.convertToPx( height ), getEditorContentHeight( editor ) );
			}
		},

		// (#1883)
		'test resize event with css units and resizeInner': function() {
			var editor = this.editor,
				lastResizeData = 0;

			editor.on( 'resize', function( evt ) {
				lastResizeData = evt.data;
			} );

			for ( var i = 0; i < unitsToTest.length; i++ ) {
				var width = 20 + unitsToTest[i],
					height = 50 + unitsToTest[i];

				editor.resize( width, height, null, true );
				assert.areSame( getEditorInnerHeight( editor ), lastResizeData.outerHeight );
				assert.areSame( CKEDITOR.tools.convertToPx( width ), lastResizeData.outerWidth );
				assert.areSame( getEditorContentHeight( editor ), lastResizeData.contentsHeight );
				assert.areSame( CKEDITOR.tools.convertToPx( height ), getEditorInnerHeight( editor ) );
			}
		}
	} );
} )();
