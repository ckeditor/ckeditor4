/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: font,toolbar */

bender.editor = true;
bender.test(
{
   'test apply font size (collapsed cursor)' : function() {
	   var bot = this.editorBot, editor = this.editor;
	   bot.combo( 'FontSize', function( combo ) {
			  combo.onClick( 48 );
			  editor.insertText( 'foo' );
			  assert.areSame( '<p><span style="font-size:48px;">foo</span></p>', bot.getData( 1, 1 ) );

			  this.wait( function() {
				  // Click again to exit the style.
				  bot.combo( 'FontSize', function( combo ) {
					  combo.onClick( 48 );
					  this.wait( function() {
						  editor.insertText( 'bar' );
						  assert.areSame( '<p><span style="font-size:48px;">foo</span>bar</p>', bot.getData( 1, 1 ) );
					  }, 0 );
				  } );
			  }, 0 );
		  } );
   },

   'test apply font size (text range)': function() {
	   var bot = this.editorBot, editor = this.editor;
	   bot.setHtmlWithSelection( '<p>[foo]</p>' );
	   bot.combo( 'FontSize', function( combo ) {
			  combo.onClick( 48 );
			  assert.areSame( '<p><span style="font-size:48px;">foo</span></p>', bot.getData( 1, 1 ) );
		  } );
   }
} );