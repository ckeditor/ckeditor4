@bender-tags: feature, 4.13.0, 2306
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ckeditor-plugins: wysiwygarea,sourcearea,htmlwriter,entities,toolbar,elementspath,undo,clipboard,format,basicstyles,autolink,autoembed,embed,link,preview

1. Compare how widget looks in editor and in preview to the right.
  ## Expected
  Widgets looks almost identical.
  
  ## Unexpected
  Widget in editor doesn't have thumbnail, tittle, description or footer.

1. Copy following: <input type="text" readonly value="https://github.com/ckeditor/ckeditor-dev">

1. Press `Get preview` button, when prompt appears paste copied URL, and press `OK`.

1. Double click on widget in editor and paste copied URL, and press `OK`.

## Expected
Widgets looks almost identical.

## Unexpected
Widget in editor doesn't have thumbnail, tittle, description or footer.
