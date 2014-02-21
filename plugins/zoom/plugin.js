/**
 * Plugin zoom
 */

CKEDITOR.plugins.add( 'zoom',
{
	requires: 'richcombo',
	init: function( editor )
	{
	  var config = editor.config,
			lang = editor.lang.stylesCombo;
 
	// Inject basic sizing for the pane as the richCombo doesn't allow to specify it
		var node = CKEDITOR.document.getHead().append( 'style' );
		node.setAttribute( 'type', 'text/css' );
		var content = '.cke_combopanel__zoom { height: 200px; width: 100px; }' +
					'.cke_combo__zoom .cke_combo_text { width: 40px;}';

		if ( CKEDITOR.env.ie )
			node.$.styleSheet.cssText = content;
		else
			node.$.innerHTML = content;
		
	  editor.ui.addRichCombo( 'Zoom',
		{
			label : "Zoom",
			title : 'Zoom',	
			multiSelect : false,
			className : 'zoom',
			modes:{wysiwyg:1,source:1 },
			panel :
			{				
				css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss )
			},

			init : function()
			{
				var zoomOptions = [50, 75, 100, 125, 150, 200, 400],zoom;
				this.startGroup( 'Zoom level' );
				for ( i = 0 ; i < zoomOptions.length ; i++ )
				{
					zoom = zoomOptions[ i ];
					this.add( zoom, zoom + " %", zoom + " %" );
				}
				zoom=CKEDITOR.config.zoom?CKEDITOR.config.zoom:100;
				this.setValue(zoom, zoom+" %");
				CKEDITOR.config.zoom=zoom;				
			},
			onRender : function (){
				editor.on( 'mode', function( ev ) {
					// Restore zoom level after switching from Source mode
					if (this.lastValue)
						this.onClick( this.lastValue );

				}, this );
				zoom=CKEDITOR.config.zoom?CKEDITOR.config.zoom:100;				
				CKEDITOR.config.zoom=zoom;
				CKEDITOR.on( 'currentInstance', function( ev )
						{	this.setValue(CKEDITOR.config.zoom,CKEDITOR.config.zoom+' %' );	},
						this);
				CKEDITOR.on( 'instanceReady', function( ev )
						{	this.apply(ev.editor);	},
						this);
				
			},
			apply: function(editor) {
				var body = editor.editable().$;
				var value=CKEDITOR.config.zoom||100;
				if (value==100|| (CKEDITOR.env.ie && CKEDITOR.env.version==7)) body.style.width='auto'; 
				else body.style.width=Math.floor(10000/value -1)+"%";
				
				if (CKEDITOR.env.gecko) {
					body.style.MozTransformOrigin = "top left";
					body.style.MozTransform = "scale(" + (value/100)  + ")";						
				} else if (CKEDITOR.env.webkit) {
					body.style.WebkitTransformOrigin = "top left";
					body.style.WebkitTransform = "scale(" + (value/100)  + ")";
				} else if (CKEDITOR.env.ie){
					body.style.zoom = value/100;	
					if (CKEDITOR.env.version>7) {		
						editor.document.getDocumentElement().$.style.overflowX='hidden';						
					}
				} else {
					body.style.OTransformOrigin = "top left";
					body.style.OTransform = "scale(" + (value/100)  + ")";	
					body.style.TransformOrigin = "top left";
					body.style.Transform = "scale(" + (value/100)  + ")";
				}	
				this.setValue(CKEDITOR.config.zoom,CKEDITOR.config.zoom+' %' );
				this.lastValue=value;
								
				editor.fire('afterZoom',null,editor);//test
			},
			onClick : function( value )
			{
				if (value != CKEDITOR.config.zoom) {
			  	CKEDITOR.config.zoom=value;
			  	var hdnCookie = document.getElementById('hdnInfraPrefixoCookie');			  	
			  	var prefixoCookie = hdnCookie.value;
 			  	infraCriarCookie(prefixoCookie+'_zoom_editor',value,365);
 			  	for (inst in CKEDITOR.instances) {
						this.apply(CKEDITOR.instances[inst]);						
					}
			  	
				}
			}
		});
	}
} );