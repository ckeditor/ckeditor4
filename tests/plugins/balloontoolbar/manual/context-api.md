@bender-ui: collapsed
@bender-tags: 4.8.0, feature, 1346, balloontoolbar
@bender-ckeditor-plugins: wysiwygarea,toolbar,undo,basicstyles,notification,floatingspace,sourcearea,list,link

Check if `balloontoolbar` api is available in plugin.init().

This test should not throw error after page load.

Open console and check if `editor.balloonToolbars should be initialized` error has been thrown.

If not, test passed.
