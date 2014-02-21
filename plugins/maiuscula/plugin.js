/**
 * Plugin que insere o valor selecionado por extenso.
 */

CKEDITOR.plugins.add( 'maiuscula',
{
	init: function( editor )
	{
		editor.addCommand( 'alterarMaiuscula',
			{
				exec : function( editor )
				{
						var str=editor.getSelection().getSelectedText();
						editor.insertHtml(str.toUpperCase());						
				}
			});
		editor.addCommand( 'alterarMinuscula',
				{
					exec : function( editor )
					{
							var str=editor.getSelection().getSelectedText();
							editor.insertHtml(str.toLowerCase());						
					}
				});
		editor.ui.addButton( 'Maiuscula',
		{
			label: 'Altera o texto para MAIÚSCULAS',
			command: 'alterarMaiuscula',
			icon: this.path + 'images/maiusculas.gif'
		} );
		editor.ui.addButton( 'Minuscula',
				{
					label: 'Altera o texto para minúsculas',
					command: 'alterarMinuscula',
					icon: this.path + 'images/minusculas.gif'
				} );

	}
} );