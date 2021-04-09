@bender-tags: 4.17.0, feature, 4462
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo,image,editorplaceholder,about,resize,showblocks,docprops,dialog,colorbutton,mathjax,autolink,embed

**Note:** Open dev console to track possible errors. If any occurs, test failed.

1. Use each available plugin. Use toggle button to detach and reattach editor in random moments. Also toggle source mode in random moments. Observe especially the behaviour of `undo` plugin.

	**Expected:** After each toggle editor shows with same data and content is editable.

	**Unexpected:** At some point editor data is lost or content area is not editable.
