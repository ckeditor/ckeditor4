/**
 * Created with JetBrains WebStorm.
 * User: bcu
 * Date: 17/08/12
 * Time: 13:44
 * To change this template use File | Settings | File Templates.
 */
CKEDITOR.plugins.add( 'stylesdefault',
  {
    init : function( editor )
    { 
    	formatApply= function(ev){
    		console.log(ev.name);
        if (this._.stylesDefinitions.length==1) {
	      	var selection = editor.getSelection(),
					elementPath = new CKEDITOR.dom.elementPath( selection.getStartElement() ),
	      	estilo=new CKEDITOR.style(this._.stylesDefinitions[0]);
	      	
	      	if (! estilo.checkActive( elementPath )) {        		
	      		estilo.apply(editor.document);
	      	}
        } 
    	}
    	formatApply2= function(ev){
    		console.log(ev.name);
        if (this._.stylesDefinitions.length==1) {
	      	var selection = editor.getSelection(),
					elementPath = new CKEDITOR.dom.elementPath( selection.getStartElement() ),
	      	estilo=new CKEDITOR.style(this._.stylesDefinitions[0]);
	      	
	          var ranges = editor.getSelection().getRanges( 1 ),
	  				iterator = ranges.createIterator(),
	  			  range = iterator.getNextRange(),
	  			  bookmark = range.createBookmark();
	  			  
	  			  editor.execCommand('selectAll');
	      		estilo.apply(editor.document);
	          range.moveToBookmark( bookmark );
	          editor.getSelection().selectRanges( ranges );
	      		
        }
    	}
    	editor.on('contentDirChanged',formatApply);
	    editor.on('afterPaste',formatApply2);
    }
  });