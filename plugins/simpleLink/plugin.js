CKEDITOR.plugins.add( 'simpleLink',
{
	init: function( editor )
	{
		editor.addCommand( 'simpleLinkDialog', new CKEDITOR.dialogCommand( 'simpleLinkDialog' ) );
		editor.ui.addButton( 'SimpleLink',
		{
			label: 'Inserir um Link',
			command: 'simpleLinkDialog',
			icon: this.path + 'images/icon.png'
		} );
 
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
								type : 'textarea',
								id : 'contents',
								label : 'Texto Visível',
								validate : CKEDITOR.dialog.validate.notEmpty( 'O texto visível não pode ser vazio.' ),
								required : true,
								commit : function( data )
								{
									data.contents = this.getValue();
								}
							},
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
							},
							{
								type : 'select',
								id : 'style',
								label : 'Estilo',
								items : 
								[
									[ '<nenhum>', '' ],
									[ 'Negrito', 'b' ],
									[ 'Sublinhado', 'u' ],
									[ 'Itálico', 'i' ]
								],
								commit : function( data )
								{
									data.style = this.getValue();
								}
							},
							{
								type : 'checkbox',
								id : 'newPage',
								label : 'Abrir em nova página.',
								'default' : true,
								commit : function( data )
								{
									data.newPage = this.getValue();
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
					link.setAttribute( 'href', data.url );
					if ( data.newPage )
						link.setAttribute( 'target', '_blank' );
					switch( data.style )
					{
						case 'b' :
							link.setStyle( 'font-weight', 'bold' );
						break;
						case 'u' :
							link.setStyle( 'text-decoration', 'underline' );
						break;
						case 'i' :
							link.setStyle( 'font-style', 'italic' );
						break;
					}
					link.setHtml( data.contents );
					editor.insertElement( link );
				}
			};
		} );
	}
} );