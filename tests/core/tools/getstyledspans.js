/* bender-tags: editor */
/* bender-ckeditor-plugins: colorbutton,undo,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.test( {
		// (#1795)
		'test getStyledSpans()': function() {
			bender.editorBot.create( {
				name: 'editor1',
				startupData: '<p><span style="color:#e74c3c">I&#39;m</span> an <span style="color:#3498db">instance</span>' +
				' of <span style="color:#2ecc71">CKEditor</span>.</p>'
			}, function( bot ) {
				var editor = bot.editor;

				assert.areEqual( 3, CKEDITOR.tools.getStyledSpans( 'color', editor.editable() ).length, 'There are 3 styled spans.' );
			} );
		},

		// (#1795)
		'test getStyledSpans() filtering correct property': function() {
			bender.editorBot.create( {
				name: 'editor2',
				startupData: '<p><span style="background-color:#e74c3c">I&#39;m</span> an <span style="color:#3498db">instance</span>' +
				' of <span style="color:#2ecc71">CKEditor</span>.</p>'
			}, function( bot ) {
				var editor = bot.editor;

				assert.areEqual( 2, CKEDITOR.tools.getStyledSpans( 'color', editor.editable() ).length, 'There are 2 styled spans.' );
			} );
		}
	} );
} )();
