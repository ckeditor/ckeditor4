/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: contextmenu */

bender.test( {
	'test contextmenu disabled': function(){
		
		bender.editorBot.create( {
			name: 'editor',
			config: {
				allowedContent: true
			}
		}, function( bot ) {
		
			var preventDefaultCalled = 0;
			
			var editor = bot.editor,
			editable = editor.editable();
							
			editable.fire( 'contextmenu', new CKEDITOR.dom.event( {
				target: editable.$,
				preventDefault: function() {
					++preventDefaultCalled;
				}
			} ) );
			
			assert.areSame( 1, preventDefaultCalled, 'PreventDefault was called' );
			
		});
	}
} );