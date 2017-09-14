( function() {
	'use strict';

	bender.editors = {
		divarea: {
			creator: 'replace',
			name: 'divarea',
			config: {
				extraPlugins: 'divarea',
				height: 300,
				width: 300
			}
		},
		classic: {
			creator: 'replace',
			name: 'classic',
			config: {
				height: 300,
				width: 300
			}
		}
	};

	var tests = {
		'test getEditableScroll': function( editor ) {
			var sel = bender.tools.selection.setWithHtml( editor, '<div style="width:4000px;height:4000px;border:1px solid blue;"></div><p style="margin-left:3800px">[selection]</p>' );
			var editable = editor.editable();

			assert.areSame( 0, editable.getEditableScroll( true ) );
			assert.areSame( 0, editable.getEditableScroll().scrollTop );
			assert.areSame( 0, editable.getEditableScroll().scrollLeft );

			sel.scrollIntoView();

			assert.areNotSame( 0, editable.getEditableScroll( true ) );
			assert.areNotSame( 0, editable.getEditableScroll().scrollTop );
			assert.areNotSame( 0, editable.getEditableScroll().scrollLeft );
		},

		'test setEditableScroll': function( editor ) {
			bender.tools.selection.setWithHtml( editor, '<div style="width:2000px;height:4000px;border:1px solid blue;"></div>' );
			var editable = editor.editable();

			editable.setEditableScroll( 0, 0 );

			assert.areSame( 0, editable.getEditableScroll( true ) );
			assert.areSame( 0, editable.getEditableScroll().scrollTop );
			assert.areSame( 0, editable.getEditableScroll().scrollLeft );


			editable.setEditableScroll( 10, 9 );
			assert.areSame( 10, editable.getEditableScroll( true ) );
			assert.areSame( 10, editable.getEditableScroll().scrollTop );
			assert.areSame( 9, editable.getEditableScroll().scrollLeft );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
