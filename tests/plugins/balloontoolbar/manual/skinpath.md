@bender-ui: collapsed
@bender-tags: 4.8.0, bug, tp3167, balloontoolbar
@bender-ckeditor-plugins: wysiwygarea,toolbar,undo,basicstyles,notification,floatingspace,balloontoolbar,sourcearea,list,link,image,language,stylescombo

1. Open browser browser console.

## Expected

There is no error with balloontoolbar CSS loading, like: `GET http://tests.ckeditor.test:1030/apps/ckeditor/plugins/balloontoolbar/skins/kama,/apps/ckeditor/skins/kama//balloontoolbar.css net::ERR_ABORTED`

## Unexpected

An error regarding `plugins/balloontoolbar/skins/kama,/apps/ckeditor/skins/kama//balloontoolbar.css` file is thrown.

## Note

There might be one error logged regarding balloon panel, which should be fixed by [#1221](https://github.com/ckeditor/ckeditor4/issues/1221). It's the same issue but it's originating from **balloonpanel** plugin, not balloontoolbar.
