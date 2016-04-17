CKEDITOR.plugins.add( 'coedit', {
    init: function( editor ) {


    	window.__coedit__plugin__ = this;
    	console.log("coedit init");


    	var ceConfig = editor.config.coedit_config;
    	this.editor = editor;
    	this.docId = ceConfig.docId;
    	this.userId = ceConfig.userId;
    	this.saving = [];


    	var that = this;
    	editor.coEdit = that;

    	editor.addFeature({
			allowedContent: '*[ce-*,id,contenteditable]'
		});

    	editor.on("instanceReady",function(){
			editor.on("change",function(){
				console.log("changing");
				that._buildData();
			});
			that.document = editor.document.$;
			that._buildData();
			that._enableLock();
    	});
    },


    _getRdId: function(){
		var arr = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		var res = "";
		for(var i=0;i<8;i++){
			res += arr[Math.floor(Math.random()*arr.length)]
		}
		return res.toUpperCase();
	},

	_buildData: function(){
		var editor = this.editor;
		var body = this.document.body;
		var children = body.childNodes;
		var node,i,paraData;
		var preParaId = "__beginning__";

		var oldData = this.data || {
			"__beginning__":{nextParaId:"__ending__",content:""},
			"__ending__":{content:""}
		};

		var data = {
			"__beginning__":{nextParaId:"__ending__",content:""},
			"__ending__":{content:""}
		}

		for(var i = 0; i < children.length; i++){
			node = children[i];
			if(node.nodeType == 1){
				paraData = this._buildParaData(node);
				data[preParaId].nextParaId = paraData.paraId;
				data[paraData.paraId] = paraData;
				preParaId = paraData.paraId;
			}
		}
		this.data = data;
	},

	_buildParaData: function(node){
		var paraData = {};

		var docId = node.getAttribute("ce-doc-id");
		if(docId && docId != this.docId){
			node.removeAttribute("ce-para-id");
		}
		paraData.docId = this.docId;
		

		var paraId = node.getAttribute("ce-para-id");
		if(!node.id){
			paraId = null;
		}
		paraData.paraId = paraId || this._getRdId();

		node.setAttribute("ce-doc-id",paraData.docId);
		node.setAttribute("ce-para-id",paraData.paraId);
		node.setAttribute("id","ce_para_"+paraData.paraId);
		
		paraData.content = node.outerHTML;
		paraData.nextParaId = "__ending__";

		return paraData; 
	},

	getHTML: function(){
		var s = "";
		var data = this.data;
		var paraData = data["__beginning__"]; 
		while(paraData.nextParaId != "__ending__"){
			paraData = data[paraData.nextParaId];
			s += paraData.content;
		}
		console.log(s)
		return s;
	},

	save: function(){
		this.saving.push(this.data)
	},
	
	diff: function(newData,oldData){
		var arr = this.saving
		if(arr.length<2){
			console.log("需要save两次之后调用diff")
		}
		var n = newData || arr[arr.length-1];
		var o = oldData || arr[arr.length-2];
		var diff = {
			chg:[],
			del:[],
			add:[]
		};
		var diffKeys = [];
		
		var key = "__beginning__";
		while(o[key].nextParaId){
			if(n[key]){
				if(!this._compare(o[key],n[key])){
					diff.chg.push(n[key]);
				}
			}else{
				diff.del.push({
					paraId:key
				})
			}
			diffKeys.push(key);
			key = o[key].nextParaId;
		}

		var key = "__beginning__";
		while(n[key].nextParaId!="__ending__"){
			key = n[key].nextParaId;
			if(diffKeys.indexOf(key) == -1){
				diff.add.push(n[key]);
			}
		}

		console.log(diff);
		return diff;
	},

	_compare: function(a,b){
		if(a.nextParaId!=b.nextParaId){
			return false;
		}
		if(a.content!=b.content){
			return false;
		}
		return true;
	},

	lock: function(paraId){
		var doc = this.document;
		var node = doc.getElementById("ce_para_"+paraId);
		if(node && node.nodeType == 1){
			node.style.backgroundColor="#e4e4e4"
			node.setAttribute("ce-locked",true);
			node.setAttribute("contenteditable",false);
		}

	},

	unlock: function(paraId){
		var doc = this.document;
		var node = doc.getElementById("ce_para_"+paraId);
		if(node && node.nodeType == 1){
			node.style.backgroundColor="#ffffff"
			node.setAttribute("ce-locked",false);
			node.setAttribute("contenteditable",true);
		}

	},

	_enableLock: function(){
		var doc = this.document;
		doc.body.addEventListener("keydown",function(evt){
			var sel = doc.getSelection();
			console.log(sel);
			var rge = sel.getRangeAt(0);
			var aNode = rge.startContainer;
			var bNode = rge.endContainer;
			var aRootNode = aNode;
			var bRootNode = bNode;

			while(aRootNode.parentNode!=doc.body){
				aRootNode = aRootNode.parentNode;
			}

			while(bRootNode.parentNode!=doc.body){
				bRootNode = bRootNode.parentNode;
			}

			if(rge.collapsed){
				var aRootNodeTmp;
				//没有选择区域，只是光标位置
				if((evt.keyCode == 8 || evt.keyCode == 46)){
					if(evt.keyCode == 8){
						aRootNodeTmp = aRootNode.previousSibling;
					}else{
						aRootNodeTmp = aRootNode.nextSibling;
					}
					if(aRootNodeTmp && aRootNodeTmp.getAttribute("ce-locked") == "true"){
						if(evt.keyCode == 8 && sel.anchorOffset == 0){
							evt.preventDefault();
							console.log("ce: can not delete locked node");
						}else if(evt.keyCode == 46 && true){
							if(!sel.anchorNode.nextSibling && sel.anchorNode.length == sel.anchorOffset){
								evt.preventDefault();	
								console.log("ce: can not delete locked node");
							}
						}
					}
				}
			}else{
				//包含选择区域
				var hasLockedNode = false;
				var chkNode = aRootNode;
				if(aRootNode && aRootNode.getAttribute("ce-locked") == "true" ){
					hasLockedNode = true;
				}
				if(bRootNode && bRootNode.getAttribute("ce-locked") == "true" ){
					hasLockedNode = true;
				}
				while(chkNode != bRootNode){
					if(chkNode && chkNode.getAttribute("ce-locked") == "true" ){
						hasLockedNode = true;
					}
					chkNode = chkNode.nextSibling;
				}
				if(hasLockedNode){
					evt.preventDefault();
					console.log("ce: can not delete locked node");
				}
			}
		})
	}	
});
/*
1. 段落编辑完成事件
2. 段落失去光标事件
3. 待checklist的模板
4. 嵌套列表的编号
*/