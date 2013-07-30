CKEDITOR.plugins.add( 'linksei',
{
	//requires: [ 'iframedialog' ],
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
		
		CKEDITOR.dialog.add( 'simpleLinkDialog', function( editor )
				{
					return {
						title : 'Propriedades do Link',
						minWidth : 400,
						minHeight : 200,
						contents :
						[
							{
								id : 'general',
								label : 'Settings',
								elements :
								[
									{
										type : 'text',
										id : 'url',
										label : 'URL',
										validate : CKEDITOR.dialog.validate.notEmpty( 'O link deve ter uma URL.' ),
										required : true,
										commit : function( data )
										{
											data.url = this.getValue();
										}
									}
								]
							}
						],
						onOk : function()
						{
							var dialog = this,
								data = {},
								link = editor.document.createElement( 'a' );
							this.commitContent( data );
							link.setAttribute( 'id', "lnkSei"+data.url );
							link.setHtml( data.url );
							editor.insertElement( link );
						}
					};
				} );
		
/*		CKEDITOR.dialog.addIframe(
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
*/
	}
} );