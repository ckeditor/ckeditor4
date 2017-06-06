CKEDITOR.plugins.add( 'scripler', {
    init: function( editor ) {
        function isEmpty( node ) {
            var trimmed;
			if (node.getData) {
				trimmed = node.getData();
			} else {
				trimmed = node.getText();
			}
			trimmed = CKEDITOR.tools.ltrim(trimmed);
            if (trimmed && trimmed.length > 0) {
                //Paragraph contains some text, so not empty
                return false;
            }

            //Didn't identify any content, so should be empty
            return true;
        }
        
        function checkBlock(block) {
            if (block && block.is('p')) {
                if (isEmpty(block)) {
                    block.addClass('empty-paragraph');
                } else {
                    block.removeClass('empty-paragraph');
                }
            }
        }
        
        var changed = function () {
            if (editor.elementPath() && editor.elementPath().block) {
                // Check the block where the users cursor is currently located.
                checkBlock(editor.elementPath().block);
                // Check the previous block (maybe we just left it empty, while auto paragraphing to the next block)
                checkBlock(editor.elementPath().block.getPrevious());
            }
			
            //Reset change timer
            //resetChangeTimeout();
        }; 
        
        // For any content check, check for empty paragraph.
        editor.on('change', changed);
        // Make sure that we identify an empty paragraph after auto-paragraphing.
        editor.on('selectionChange', changed);
        editor.on('elementsPathUpdate', changed);
		
		
        //editor.on('key', resetChangeTimeout);
        
        var toolbarObj;
		var editorObj;
		var inFocus = false;
		var fading = true;
		var op = 0.0;
		var timerFadeIn;
		var timerFadeOut;
		var timerChangeTimeout;
		
		function showToolbar() {
            fadeIn(toolbarObj);
		}
		
		function hideToolbar(force) {
			//console.log('hide toolbar');
			//Hide Toolbar
			if (force) {
				fading = true;	
				if (doAbortToolbarHide()) {
					fading = false;
					return;
				}
				clearInterval(timerFadeOut);
				clearInterval(timerFadeIn);
				clearTimeout(timerChangeTimeout);
				toolbarObj.style.display = 'none';
				toolbarObj.style.opacity = 0.0;
				toolbarObj.style.filter = 'alpha(opacity=0)';
			} else if (!inFocus) {
				fadeOut(toolbarObj);
			}
		}
		
		function resetChangeTimeout() {
			//console.log('wow-'+Math.floor(Math.random()*101));
			if (timerChangeTimeout) {clearTimeout(timerChangeTimeout)};
			timerChangeTimeout = setTimeout(function(){fadeOut(toolbarObj)}, 5000);//5 seconds
		}
		
		function fadeOut(element) {
			if (!fading) {
				fading = true;
				var delay = 0;
				clearInterval(timerFadeIn);
				
				//Done hide if any open panels
				if (doAbortToolbarHide()) {
					fading = false;
					return;
				}
				
				//Fade toolbar
				timerFadeOut = setInterval(function () {
					if (!delay) {
						if (op <= 0.1){
							clearInterval(timerFadeOut);
							element.style.display = 'none';
							op = 0.0;
						}
						element.style.opacity = op;
						element.style.filter = 'alpha(opacity=' + op * 100 + ')';
						op -= 0.1;
					} else {
						delay--;
					}
				}, 25);
			}
		}
		
		function doAbortToolbarHide() {
			var panels = document.querySelectorAll('div.cke_panel');
			for (var i = 0;i<panels.length;i++){
				if (panels[i].style.display!='none') {
					//console.log(panels[i]);
					//panels[i].style.display = 'none';
					//console.log('Cancelled hide')
					return true;
				}
			}
			return false;
		}
		
		function fadeIn(element) {
			if (fading) {
				fading = false;
				op = 1;
				clearInterval(timerFadeOut);
				element.style.opacity = op;
				element.style.filter = 'alpha(opacity=' + op * 100 + ')';
				element.style.display = 'block';
			}
			resetChangeTimeout();
		}
		
        editor.on('paste', function (ev) {
            //onPaste();
        
			//Identify empty paragraphs in pasted data
			//alert("Pasted 1");
			if (ev.data.dataValue) {
				ev.data.dataValue = ev.data.dataValue.replace(/(<p)(?![^>]*empty-paragraph)([^>]*?)(class\s*=\s*["']([^"']*)["']([^>]*))?(>(\s|&nbsp;)*<\/p>)/g, '$1$2 class="$4 empty-paragraph"$5$6');
			}
			//alert("Pasted 2");
            //var innerDocument = editor.$.document;
            
            var checkPasteDone = setInterval(function(){
                //alert('Readystate: ' + CKEDITOR.instances.editor1.window.$.document.readyState);
				var readyState = CKEDITOR.instances.editor1.window.$.document.readyState;
				console.log(readyState);
                if (!/in/.test(readyState) || readyState=="interactive") {
					document.getElementById('mask').style.display = 'none';
					clearInterval(checkPasteDone);
				}
            },100);
            //setInterval(function(){alert('Readystate: ' + CKEDITOR.instances.editor1.window.$.document.readyState);},5000);
		});
		
		var maskElm = document.getElementById('mask');
		//var onPaste = function () {
		//	maskElm.style.display = 'block';
			//console.log('Pasting...');
		//}
        
        // Hide/show toolbar
        editor.on('focus', function () {inFocus = true; showToolbar();});
        editor.on('blur', function () {inFocus = false; hideToolbar(true);});
        editor.on('instanceReady', function (event){
			//console.log(JSON.stringify(CKEDITOR.instances.editor1.window.$.document.getElementsByTagName("body")[0]));

			var instanceName = 'bodyeditor';
			
			var editableBody = CKEDITOR.instances[instanceName].window.$.document.getElementsByTagName("body")[0]
			//editableBody.addEventListener ("paste", onPaste, false);
			//editableBody.addEventListener ("beforepaste", onPaste, false);
        
			var editorDocument;
			var editorId = editor.id;
			toolbarObj = document.getElementById( editorId+'_top' );
			editorObj = document.getElementById( editorId+'_contents' );
			toolbarArea = document.getElementById( 'toolbar-area' );
            toolbarObj.style.position = 'absolute';
            toolbarObj.style.margin = '-2em 5em';
            toolbarObj.style.display = 'none';
			toolbarObj.onmousemove = showToolbar;
			toolbarArea.onmousemove = showToolbar;
			editorObj.onmouseover = showToolbar;
			toolbarObj.onmouseout = function () {hideToolbar(false) };
			toolbarArea.onmouseout = function () {hideToolbar(false) };
			editorObj.onmouseout = function () {hideToolbar(false) };
			editableBody.onblur = function () {inFocus = false; hideToolbar(true);};
			editableBody.onfocus = function () {inFocus = true; showToolbar();};
			toolbarObj.onmouseover = showToolbar;


			//Drag'n'Drop stuff from http://html5demos.com/dnd-upload
			var tests = {
				  filereader: typeof FileReader != 'undefined',
				  dnd: 'draggable' in document.createElement('span'),
				  formdata: !!window.FormData,
				  progress: "upload" in new XMLHttpRequest
				}, 
				support = {
				  filereader: document.getElementById('filereader'),
				  formdata: document.getElementById('formdata'),
				  progress: document.getElementById('progress')
				},
				progress = document.getElementById('uploadprogress'),
				fileupload = document.getElementById('upload');
			
			"filereader formdata progress".split(' ').forEach(function (api) {
			  if (tests[api] === false) {
				support[api].className = 'fail';
			  } else {
				support[api].className = 'hidden';
			  }
			});
			initEventsListeners();
			
			function initEventsListeners() {
				editorDocument = CKEDITOR.instances[instanceName].window.$.document;
				
				editorDocument.onmousemove = showToolbar;
				
				if (tests.dnd) { 
				  //Drag'n'Drop supported
				  editorDocument.ondragover = function () { this.className = 'hover'; return false; };
				  editorDocument.ondragend = function () { this.className = ''; return false; };
				  editorDocument.ondrop = function (e) {
					this.className = '';
					e.preventDefault();
					readfiles(e.dataTransfer.files);
				  }
				} else {
				  //Drag'n'Drop NOT supported
				  fileupload.className = '';
				  fileupload.querySelector('input').onchange = function () {
					readfiles(this.files);
				  };
				}
			}
			

			function readfiles(files) {
				//debugger;
				maskElm.style.display = 'block';
				var formData = tests.formdata ? new FormData() : null;
				for (var i = 0; i < files.length; i++) {
				  if (tests.formdata) formData.append('file', files[i]);
				  //previewfile(files[i]);
				  //console.log('File: ' + files[i]);
				}

				// now post a new XHR request
				if (tests.formdata) {
				  var xhr = new XMLHttpRequest();
				  xhr.open('POST', 'http://scripler.dk/document/upload');
				  xhr.onreadystatechange=function(){
					if (xhr.readyState==4 && xhr.status==200) {
						console.log('Done 1');
					} else {
						//console.log('Could not upload...: ' + JSON.stringify(xhr));
						maskElm.style.display = 'none';
					}
				  }
				  xhr.onload = function() {
					console.log('Done 2');
					progress.value = progress.innerHTML = 100;
					//Upload done
					//console.log(this.responseText);
					CKEDITOR.instances[instanceName].setData(this.responseText, function() {
						//Seems like we need to redo event attachments after every DnD (in Chrome at least)
						initEventsListeners();
						maskElm.style.display = 'none';
					});
				  };

				  if (tests.progress) {
					xhr.upload.onprogress = function (event) {
					  if (event.lengthComputable) {
						var complete = (event.loaded / event.total * 100 | 0);
						progress.value = progress.innerHTML = complete;
					  }
					}
				  }

				  xhr.send(formData);
				}
			}
					
			
        });
	
		
    }
});