/*
 * Copyright (c) 2012, TRIBUNAL REGIONAL FEDERAL DA 4ª REGIAO. All rights reserved.
 */
var txa;
(function()
{
	function autotextoDialog( editor, isEdit )
	{
    
		var generalLabel = 'Inserir Autotexto';
		return {
			title : 'Autotexto',
			minWidth : 700,
			maxWidth:700,
			minHeight : 500,
			maxHeight:500,
			resizable: CKEDITOR.DIALOG_RESIZE_NONE,			
			contents :
			[
				{
					id : 'info',
					label : generalLabel,
					title : generalLabel,
					elements :
					[
						{
							type : 'select',
							id : 'selDlgAutotexto',
							label : 'Autotexto',
							items : [],
							
							setup : function( )
							{
								if (typeof(selAutotextoItens)=='object') {
									this.clear();
									for(var i=0;i<selAutotextoItens.length;i++){
										this.add(selAutotextoItens[i],i);
									}
								}
								this.setValue(0,true);
							},
							onChange: function()
							{
								var document = this.getElement().getDocument();
								var element = document.getById( 'myDiv' );
								if ( element )								
								element.setHtml(arrAutotextoItens[parseInt(this.getValue())]);
							}
							
						
						},
						{
							type : 'html',
							id : 'htmlConteudo',
							html: '<div id="myDiv" style="padding:5px; width:700px; max-width:700px; white-space:pre-wrap; border:1px solid; height:440px; overflow-y:auto; overflow-x:hidden"></div>',
							setup: function() {
								var document = this.getDialog().getElement().getDocument();
								var element = document.getById( 'myDiv' );
								if (typeof(arrAutotextoItens[0])=='string') {
							 	  element.setHtml(arrAutotextoItens[0]);
								} else {
									//alert("Nenhum AutoTexto encontrado!");
									//CKEDITOR.dialog.getCurrent().hide();
								}
							},
							commit : function()
							{
								var document = this.getDialog().getElement().getDocument();
								var element = document.getById( 'myDiv' );
								editor.insertHtml(element.getHtml());
							}
						}
					]
				}
			],
			onShow : function()
			{				
				this.setupContent( this._element );
			},
			onOk : function()
			{
				this.commitContent( this._element );
				delete this._element;
			},
			onCancel : function() {
				this.reset();
			}
		};
	}

	CKEDITOR.dialog.add( 'autotexto', function( editor )
		{
			return autotextoDialog( editor );
		});

} )();
