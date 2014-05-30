/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: button,toolbar */

var customCls = 'my_btn';
bender.editor =
{
	config : { toolbar : [ [ 'custom_btn' ] ], on :
	{
		'pluginsLoaded' : function( evt ) {
			var ed = evt.editor;
			ed.ui.addButton( 'custom_btn',
				{
					label : 'button with custom class',
					className : customCls
				} );
		}
	} }
};

bender.test(
{
	'test button class names': function() {
		var btn = this.editor.ui.get( 'custom_btn' ),
		btnEl = CKEDITOR.document.getById( btn._.id );

		assert.isTrue( btnEl.hasClass( 'cke_button' ), 'check ui type class name' );
		assert.isTrue( btnEl.hasClass( 'cke_button__custom_btn' ), 'check named ui type class name' );
		assert.isTrue( btnEl.hasClass( customCls ), 'check ui item custom class name' );
	}
} );

//]]>