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
		'test getEditableScrollPosition': function( editor ) {
			var sel = bender.tools.selection.setWithHtml( editor, '<div style="width:4000px;height:4000px;border:1px solid blue;"></div><p style="margin-left:3800px">[selection]</p>' ),
				editable = editor.editable(),
				doc,
				docEl;

			// IE automatically scrolls to selection, we need to reset that.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				doc = editable.getDocument();
				docEl = doc.$.documentElement || doc.$.body;
				docEl.scrollTop = 0;
				docEl.scrollLeft = 0;
				editable.$.scrollTop = 0;
				editable.$.scrollLeft = 0;
			}

			assert.areSame( 0, editable.getEditableScrollPosition().scrollTop );
			assert.areSame( 0, editable.getEditableScrollPosition().scrollLeft );

			// Usage of some good working old method.
			sel.scrollIntoView();

			assert.areNotSame( 0, editable.getEditableScrollPosition().scrollTop );
			assert.areNotSame( 0, editable.getEditableScrollPosition().scrollLeft );
		},

		'test setEditableScrollPosition': function( editor ) {
			bender.tools.selection.setWithHtml( editor, '<div style="width:2000px;height:4000px;border:1px solid blue;"></div>' );
			var editable = editor.editable();

			editable.setEditableScrollPosition( 0, 0 );

			assert.areSame( 0, editable.getEditableScrollPosition().scrollTop );
			assert.areSame( 0, editable.getEditableScrollPosition().scrollLeft );


			editable.setEditableScrollPosition( 10, 9 );
			assert.areSame( 10, editable.getEditableScrollPosition().scrollTop );
			assert.areSame( 9, editable.getEditableScrollPosition().scrollLeft );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
