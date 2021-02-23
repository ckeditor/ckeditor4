@bender-tags: 4.17.0, bug, 4462, wysiwygarea
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo,image,editorplaceholder,about,resize,showblocks,sourcedialog,docprops,dialog,colorbutton,mathjax,autolink,embed,autoembed


1. Open dev console

2. Use each available plugin and toggle editor in random moments.

	**Expected:** Editor shows with same data. Content is editable.

	**Unexpected:** Editor data is lost, content area is not editable.

