/* bender-tags: editor */

bender.test( {
	'test disableReadonlyStyling=true': function() {
		bender.editorBot.create(
			{
				name: 'test_dRS_true',
				startupData: '<p>Text <span contenteditable=false id="marker1">text</span> text.</p>',
				config: {
					disableReadonlyStyling: true,
					allowedContent: true // Disable filter.
				}
			},
			function( bot ) {
				var editor = bot.editor,
					range = editor.createRange(),
					style = new CKEDITOR.style( { name: 'Bold', element: 'b' } );

				range.selectNodeContents( editor.editable() );
				editor.getSelection().selectRanges( [ range ] );
				editor.applyStyle( style );

				assert.isFalse( editor.document.getById( 'marker1' ).hasAscendant( 'b' ) );
			}
		);
	},

	'test disableReadonlyStyling=false': function() {
		bender.editorBot.create(
			{
				name: 'test_dRS_false',
				startupData: '<p>Text <span contenteditable=false id="marker2">text</span> text.</p>',
				config: {
					// false is default value
					allowedContent: true // Disable filter.
				}
			},
			function( bot ) {
				var editor = bot.editor,
					range = editor.createRange(),
					style = new CKEDITOR.style( { name: 'Bold', element: 'b' } );

				range.selectNodeContents( editor.editable() );
				editor.getSelection().selectRanges( [ range ] );
				editor.applyStyle( style );

				assert.isTrue( editor.document.getById( 'marker2' ).hasAscendant( 'b' ) );
			}
		);
	}
} );
