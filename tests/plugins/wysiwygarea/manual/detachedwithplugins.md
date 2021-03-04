@bender-tags: 4.17.0, feature, 4462
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo,image,editorplaceholder,about,resize,showblocks,docprops,dialog,colorbutton,mathjax,autolink,embed,autoembed

**Note:** Open dev console to track possible errors. If any occurs, test failed.

1. Use each available plugin and use toggle button to detach and reattach editor in random moments.

	**Expected:** Editor shows with same data. Content is editable.

	**Unexpected:** Editor data is lost. Content area is not editable.
