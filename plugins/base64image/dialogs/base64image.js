/*
 * Created by ALL-INKL.COM - Neue Medien Muennich - 04. Feb 2014
 * Licensed under the terms of GPL, LGPL and MPL licenses.
 * Modified by bcu@trf4.jus.br
 * utiliza a Infra para fazer uploads nos IE 7-9
 */
CKEDITOR.dialog.add("base64imageDialog", function(editor){
	
	var t = null,
		selectedImg = null,
		orgWidth = null, orgHeight = null,objUploadImg=null,
		imgPreview = null, urlI = null, imgScal = 1;
	
	/* Check File Reader Support */
	function fileSupport() {
		var r = false;
		try {
			if(FileReader) {
				var n = document.createElement("input");
				if(n && "files" in n) r = true;
			}
		} catch(e) { r = false; }		
		return r;
	}
	var fsupport = fileSupport();
	
	/* Load preview image */
	function imagePreviewLoad(s) {
		
		/* no preview */
		if(typeof(s) != "string" || !s || s.charAt(0)!=='d') {
			imgPreview.getElement().setHtml("");
			alert(s);
			return;
		}
		
		/* Create image */
		var i = new Image();
		
		/* Display loading text in preview element */
		imgPreview.getElement().setHtml("Loading...");
		
		/* When image is loaded */
		i.onload = function() {
			
			/* Remove preview */
			imgPreview.getElement().setHtml("");
			
			/* Set attributes */
			if(orgWidth == null || orgHeight == null) {
				imgScal = 1;
				if(this.height > 0 && this.width > 0) imgScal = this.width / this.height;
				if(imgScal <= 0) imgScal = 1;
			} else {
				orgWidth = null;
				orgHeight = null;
			}
			this.id = editor.id+"previewimage";
			this.setAttribute("style", "max-width:400px;max-height:100px;");
			this.setAttribute("alt", "");
			
			/* Insert preview image */
			try {
				var p = imgPreview.getElement().$;
				if(p) p.appendChild(this);
			} catch(e) {
				alert ('Erro processando imagem.')
			}
			
		};
		
		/* Error Function */
		i.onerror = function(){ imgPreview.getElement().setHtml(""); };
		i.onabort = function(){ imgPreview.getElement().setHtml(""); };
		
		/* Load image */
		i.src = s;
	}
	
	/* Change input values and preview image */
	function imagePreview(src){
		
		/* Remove preview */
		imgPreview.getElement().setHtml("");
		
		if(src == "base64") {
			
		} else if(src == "url") {
			
			/* Load preview image */
			if(urlI) imagePreviewLoad(urlI.getValue());
			
		} else if(fsupport) {
			var filetypes=CKEDITOR.config.base64image_filetypes;
			
			/* Read file and load preview */
			var fileI = t.getContentElement("tab-source", "filArquivo");
			var n = null;
			try { n = fileI.getInputElement().$; } catch(e) { n = null; }
			if(n && "files" in n && n.files && n.files.length > 0 && n.files[0]) {
				if("type" in n.files[0] && !n.files[0].type.match("image.("+filetypes+")")) {
					alert('Tipo de arquivo não permitido.');
					return;
				}
				if(!FileReader) return;
				imgPreview.getElement().setHtml("Loading...");
				var fr = new FileReader();
				fr.onload = (function(f) { return function(e) {
					imgPreview.getElement().setHtml("");
					imagePreviewLoad(e.target.result);
				}; })(n.files[0]);
				fr.onerror = function(){ imgPreview.getElement().setHtml(""); };
				fr.onabort = function(){ imgPreview.getElement().setHtml(""); };
				fr.readAsDataURL(n.files[0]);
			}
		}
	};
	function imagePreviewInfra(src){
		imgPreview.getElement().setHtml("");
		
		var filetypes=CKEDITOR.config.base64image_filetypes;
			
		/* Read file and load preview */
		var fileI = t.getContentElement("tab-source", "filArquivo");
		var n = null;
		try { n = fileI.getInputElement().$; } catch(e) { n = null; }
		imgPreview.getElement().setHtml("Loading...");
		objUploadImg.executar();
	};
	
	/* Calculate image dimensions */
	function getImageDimensions() {
		var o = {
			"w" : "",
			"h" : "",
			"uw" : "px",
			"uh" : "px"
		};
		if(o.w.indexOf("%") >= 0) o.uw = "%";
		if(o.h.indexOf("%") >= 0) o.uh = "%";
		o.w = parseInt(o.w, 10);
		o.h = parseInt(o.h, 10);
		if(isNaN(o.w)) o.w = 0;
		if(isNaN(o.h)) o.h = 0;
		return o;
	}
	
	/* Set image dimensions */
	function imageDimensions(src) {
		var o = getImageDimensions();
		var u = "px";
		if(src == "width") {
			if(o.uw == "%") u = "%";
			o.h = Math.round(o.w / imgScal);
		} else {
			if(o.uh == "%") u = "%";
			o.w = Math.round(o.h * imgScal); 
		}
		if(u == "%") {
			o.w += "%";
			o.h += "%";
		}
	}
	
	/* Set integer Value */
	function integerValue(elem) {
		var v = elem.getValue(), u = "";
		if(v.indexOf("%") >= 0) u = "%";
		v = parseInt(v, 10);
		if(isNaN(v)) v = 0;
		elem.setValue(v+u);
	}
	
	if(fsupport) {	
		/* Dialog with file and url image source */
		var sourceElements = [			
			{
					type: "file",					
					id: "filArquivo",						
					label: "Arquivo:",
					size: 50,					
					onChange: function(){ imagePreview("filArquivo"); }
			},
			{
				type: "html",
				id: "preview",
				html: new CKEDITOR.template("<div style=\"text-align:center;\"></div>").output()
			}
		];
		
	} else {
		var sourceElements = [		
			{
				type: "file",
				id: "filArquivo",
				size: 50,
				label: "Arquivo:",
				onChange: function(){ imagePreviewInfra("filArquivo"); }
			},
			
			{
				type: "html",
				id: "preview",
				html: new CKEDITOR.template("<div style=\"text-align:center;\"></div>").output()
			}
		];
	}
	
	/* Dialog */
    return {
		title: editor.lang.common.image,
        minWidth: 450,
        minHeight: 180,
		onLoad: function(){			
			imgPreview = this.getContentElement("tab-source", "preview");	
		},
		onShow: function(){
			if (!fsupport){			
				var formUpload=this.getContentElement("tab-source","filArquivo").getInputElement().$.parentNode;
				formUpload.id="EditorSeiUpload";
				objUploadImg=new infraUploadCK(formUpload,CKEDITOR.config.base64imageUploadUrl,true);
				objUploadImg.finalizou=function(arr){
					objAjaxPlugin=new infraAjaxComplementar(null,CKEDITOR.config.base64imageAjaxUrl);
			    objAjaxPlugin.tipo=null;
			    objAjaxPlugin.processarResultado=function(result_arr){
			    	imagePreviewLoad(result_arr['base64'].toString());
			    }
			    objAjaxPlugin.prepararExecucao = function(){
			      return 'img='+arr['nome_upload'];
			    }
			    objAjaxPlugin.executar();
				}
			}
			/* Remove preview */
			imgPreview.getElement().setHtml("");
		
			t = this, orgWidth = null, orgHeight = null, imgScal = 1, lock = true;
			
			/* selected image or null */
			selectedImg = editor.getSelection();
			if(selectedImg) selectedImg = selectedImg.getSelectedElement();
			if(!selectedImg || selectedImg.getName() !== "img") selectedImg = null;
			
			if(selectedImg) {
				
				if((orgWidth == null || orgHeight == null) && selectedImg.$) {
					orgWidth = selectedImg.$.width;
					orgHeight = selectedImg.$.height;
				}
				if(orgWidth != null && orgHeight != null) {
					orgWidth = parseInt(orgWidth, 10);
					orgHeight = parseInt(orgHeight, 10);
					imgScal = 1;
					if(!isNaN(orgWidth) && !isNaN(orgHeight) && orgHeight > 0 && orgWidth > 0) imgScal = orgWidth / orgHeight;
					if(imgScal <= 0) imgScal = 1;
				}
				
				if(typeof(selectedImg.getAttribute("src")) == "string") {
					if(selectedImg.getAttribute("src").indexOf("data:") === 0) {
						imagePreview("base64");
						imagePreviewLoad(selectedImg.getAttribute("src"));
					} else {
						t.setValueOf("tab-source", "url", selectedImg.getAttribute("src"));
					}
				}
			}
			
		},
		onOk : function(){
			
			/* Get image source */
			var src = "";
			try { 
				if (INFRA_IE>0 && INFRA_IE<9){
					src = CKEDITOR.document.getById(editor.id+"previewimage").$.href;
				} else {
					src = CKEDITOR.document.getById(editor.id+"previewimage").$.src;	
				}				 
			} catch(e) { src = ""; }
			if(typeof(src) != "string" || src == null || src === "") return;
			
			/* selected image or new image */
			if(selectedImg) var newImg = selectedImg; else var newImg = editor.document.createElement("img");
			newImg.setAttribute("src", src);
			src = null;
			
			/* Set attributes */
			var attr = {
				"width" : ["width", "width:#;", "integer", 1],
				"height" : ["height", "height:#;", "integer", 1],
				"vmargin" : ["vspace", "margin-top:#;margin-bottom:#;", "integer", 0],
				"hmargin" : ["hspace", "margin-left:#;margin-right:#;", "integer", 0],
				"align" : ["align", ""],
				"border" : ["border", "border:# solid black;", "integer", 0]
			}, css = [], value, cssvalue, attrvalue, k;
			if(css.length > 0) newImg.setAttribute("style", css.join(""));
			
			/* Insert new image */
			if(!selectedImg) editor.insertElement(newImg);
},
		
		/* Dialog form */
        contents: [
            {
                id: "tab-source",
                label: editor.lang.common.generalTab,
                elements: sourceElements
            }
        ]
    };
});
