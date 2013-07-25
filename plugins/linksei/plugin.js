CKEDITOR.plugins.add( 'linksei',
{
	requires: [ 'iframedialog' ],
	init: function( editor )
	{
		editor.addCommand( 'linkseiDialog', new CKEDITOR.dialogCommand( 'linkseiDialog' ) );
		editor.ui.addButton( 'linksei',
		{
			label: 'Inserir um Link para documento do SEI!',
			command: 'linkseiDialog',
			icon: this.path + 'images/sei.png'
		} );		
		
		var height = 480, width = 750;
		var link=  "http://sei.trf4.jus.br";
		
		CKEDITOR.dialog.addIframe(
				'myiframedialogDialog',
			   'Propriedades do Link',
			   link, width, height,
			   function()
			   {
				   // Iframe loaded callback.
			   },

			   {
					onOk : function()
					{
						// Dialog onOk callback.
						var dialog = this,
						data = {},
						link = editor.document.createElement( 'a' );
					this.commitContent( data );
					link.setAttribute( 'id', "lnkSei"+data.url );
					link.setHtml( data.url );
					editor.insertElement( link );
					}
			   }
			);

		editor.addCommand( 'linkseiDialog', new CKEDITOR.dialogCommand( 'myiframedialogDialog' ) );

	}
} );