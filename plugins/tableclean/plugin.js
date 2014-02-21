/*
Copyright (c) 2012-2014, TRF4 - bcu
*/

if (CKEDITOR.env.ie && CKEDITOR.env.version<9) {
	Array.prototype.indexOf = function(obj, start) {
    for (var i = (start || 0), j = this.length; i < j; i++) {
        if (this[i] === obj) { return i; }
    }
    return -1;
}

}
function cleanAttribute(elemento){
	var attribAllowed=['width','style','moz_resizing','colspan','rowspan'];
	
	if (elemento.nodeName=="TABLE") {
		attribAllowed.push('class');
		attribAllowed.push('border');
	}
	else {
		attribAllowed.push('align');
	}
	
	var tmp=[];	
	var attrib=elemento.attributes,qtd=attrib.length;
	
	if (qtd>0){
		for (var i=0;i<qtd;i++) 
			if (attribAllowed.indexOf(attrib[i].name.toLowerCase())==-1)				
				tmp.push(attrib[i].name);									
		for (var a=0;a<tmp.length;a++) {
//			console.warn("removendo attrib: "+tmp[a]);
			attrib.removeNamedItem(tmp[a]);
		}
	}
}
function cleanStyle(elemento){
	var styleAllowed=['width','font-family','font-size','font-weight','text-align','border-spacing','nowrap'];
	var tmp=[],attrib=elemento.style,qtd=attrib.length;	
	if (CKEDITOR.env.ie && CKEDITOR.env.version<9) {
		if (attrib.cssText.length==0) qtd=0; else {
			var attribIE=attrib.cssText.split(';');
			qtd=attribIE.length;
		}
	}
	var estilo;
	if (qtd>0){
		for (var i=0;i<qtd;i++){ 
			if (attribIE) { 
				estilo=attribIE[i].split(':')[0].toLowerCase();
				if (styleAllowed.indexOf(estilo)!=-1) 
					tmp.push(attribIE[i]);
			} else {
				estilo=attrib[i];
				if (styleAllowed.indexOf(estilo)==-1) 
					tmp.push(estilo);
			}			
		}
		if (attribIE) {
			attrib.cssText=tmp.join(';');
		} else {
			for (var a=0;a<tmp.length;a++){
	//			console.warn("removendo style: "+tmp[a]);			
				attrib.removeProperty(tmp[a]);
			}
		}
	}
}

function cleanTable(tabela){
	if (tabela.nodeName!="TABLE") return;

	if (CKEDITOR.env.ie) {
		cleanElement(tabela.children[0]);
	} else 	cleanElement(tabela.firstElementChild);
	
	//console.log("limpar TABLE");		
  cleanAttribute(tabela);
	cleanStyle(tabela);	
	
}


function cleanElement(elemento){
	var elementos=['THEAD','TBODY','TR','TD','TH'];
	
	if (elementos.indexOf(elemento.nodeName)==-1) return;
	
	//console.log("limpar tag "+elemento.nodeName);

	cleanAttribute(elemento);
	cleanStyle(elemento);
	if (CKEDITOR.env.ie) {
		if (elemento.children[0]!=null) cleanElement(elemento.children[0]); 
		if (elemento.nextSibling!=null) cleanElement(elemento.nextSibling);
	} else {
		if (elemento.firstElementChild!=null) cleanElement(elemento.firstElementChild); 
		if (elemento.nextElementSibling!=null) cleanElement(elemento.nextElementSibling);
	}
}

CKEDITOR.plugins.add( 'tableclean',
{
	requires : [ 'table' ],
	init : function( editor )
	{
		var table = CKEDITOR.plugins.table,
			lang = editor.lang.table;

		
		editor.addCommand( 'tableClearFormat', { 
			exec: function(editor) { 
			
			var selection = editor.getSelection(),
				ranges = selection.getRanges(),
				selectedTable = null;

 			if ( ( selectedTable = selection.getSelectedElement() ) )
						selectedTable = selectedTable.getAscendant( 'table', true );
					else if ( ranges.length > 0 )
					{
						if ( CKEDITOR.env.webkit )
							ranges[ 0 ].shrink( CKEDITOR.NODE_ELEMENT );

						var rangeRoot = ranges[0].getCommonAncestor( true );
						selectedTable = rangeRoot.getAscendant( 'table', true );
					}
					this._.selectedElement = selectedTable;
				cleanTable(selectedTable.$);
				selectedTable.setAttribute('border','1');
			  selectedTable.removeClass('cke_show_border');
			} 
		});
		
		if ( editor.addMenuItems )
		{
			editor.addMenuItems(
				{
					tableclean :
					{
						label : 'Limpar Formatação',
						command : 'tableClearFormat',
						group : 'table',
						order : 4
					}
				} );
		}


		// If the "contextmenu" plugin is loaded, register the listeners.
		if ( editor.contextMenu )
		{
			editor.contextMenu.addListener( function( element, selection )
				{
					if ( !element || element.isReadOnly() )
						return null;

					var isTable = element.hasAscendant( 'table', 1 );

					if ( isTable )
					{
						return {
							tableclean :  CKEDITOR.TRISTATE_OFF
						};
					}

					return null;
				} );
		}
	}
} );
