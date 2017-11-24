@bender-ui: collapsed
@bender-tags: 4.8.0, bug, tp3167, inlinetoolbar
@bender-ckeditor-plugins: wysiwygarea,toolbar,undo,basicstyles,notification,floatingspace,inlinetoolbar,sourcearea,list,link,image,language,stylescombo

1. Open browser browser console.

## Expected

There is no error with inlinetoolbar CSS loading, like: `GET http://tests.ckeditor.test:1030/apps/ckeditor/plugins/inlinetoolbar/skins/kama,/apps/ckeditor/skins/kama//inlinetoolbar.css net::ERR_ABORTED`

## Unexpected

An error regarding `plugins/inlinetoolbar/skins/kama,/apps/ckeditor/skins/kama//inlinetoolbar.css` file is thrown.

## Note

There might be one error logged regarding balloon panel, which should be fixed by [#1221](https://github.com/ckeditor/ckeditor-dev/issues/1221). It's the same issue but it's originating from **balloonpanel** plugin, not inlinetoolbar.