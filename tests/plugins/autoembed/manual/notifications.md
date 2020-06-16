@bender-tags: bug, 4.5.2, 4.11.0, trac13566, 2340
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ckeditor-plugins: wysiwygarea,sourcearea,htmlwriter,entities,toolbar,elementspath,undo,clipboard,autolink,autoembed,link

1. Paste one of non-embeddable links.
1. Wait until two notifications are showed. First informing about embedding process in progress, second informing about embedding failure.<br />
  _Note: IE8 doesn't display second notification. There is an upstream issue which prevents of error handling on this browser._
  _More information: [#2553](https://github.com/ckeditor/ckeditor4/issues/2553)_
1. Paste one of embeddable links.
1. Check if notifications are showed and embedding is finished correctly.
