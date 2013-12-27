CKEDITOR.plugins.add( 'linksei',
{
	//requires: [ 'iframedialog' ],
	onLoad: function() {
		CKEDITOR.addCss( '.ancoraSei' +
			'{' +
				'background-color: #d5d5d5;' +
				( CKEDITOR.env.gecko ? 'cursor: default;' : '' ) +
			'}'
			);
	},
	init: function( editor )
	{
		editor.addCommand( 'linkseiDialog', new CKEDITOR.dialogCommand( 'linkseiDialog' ) );
		editor.ui.addButton( 'linksei',
		{
			label: 'Inserir um Link para processo ou documento do SEI!',
			command: 'linkseiDialog',
			icon: this.path + 'images/sei.png'
		} );		
		
		//var height = 200, width = 750;
		//var linksei=  "http://sei.trf4.jus.br";
		
		CKEDITOR.dialog.add( 'linkseiDialog', function( editor )
				{
					return {
						title : 'Propriedades do Link',
						minWidth : 200,
						minHeight : 70,
						contents :
						[
							{
								id : 'general',
								label : 'Settings',
								elements :
								[
									{
										type : 'text',
										id : 'protocolo',
										label : 'Protocolo',
										validate : CKEDITOR.dialog.validate.SEI(),
										required : true,
										commit : function( data )
										{
											data.protocolo = window._protocoloFormatado;
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
							link.setAttributes( {
								'id':'lnkSei'+window._idProtocolo,
								contentEditable: "false",
								'data-cke-linksei':1,
								'class': "ancoraSei",
								'style':"text-indent:0px;"
									});							
							link.setHtml( data.protocolo );
							editor.insertElement( link );
						}
					};
				} );
		

	}
} );