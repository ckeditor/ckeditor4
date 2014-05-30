/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: richcombo,toolbar */

var customCls = 'my_combo';
bender.editor =
{
	config : { toolbar : [ [ 'custom_combo' ] ], on :
	{
		'pluginsLoaded' : function( evt ) {
			var ed = evt.editor;
			ed.ui.addRichCombo( 'custom_combo',
				{
					className : customCls,
					panel: {
						css: [],
						multiSelect: false
					},

					init: function() {},

					onClick: function() {},

					onRender: function() {}
				} );
		}
	} }
};

bender.test(
{
	'test combo class names': function() {
		var combo = this.editor.ui.get( 'custom_combo' ),
			btnEl = CKEDITOR.document.getById( 'cke_' + combo.id );

		assert.isTrue( btnEl.hasClass( 'cke_combo' ), 'check ui type class name' );
		assert.isTrue( btnEl.hasClass( 'cke_combo__custom_combo' ), 'check named ui type class name' );
		assert.isTrue( btnEl.hasClass( customCls ), 'check ui item custom class name' );
	}
} );

//]]>