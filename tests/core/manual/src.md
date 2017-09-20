@bender-ui: collapsed
@bender-tags: bug, 4.7.0, tp2259, htmldataprocessor
@bender-ckeditor-plugins: wysiwygarea,sourcearea,htmlwriter,toolbar,elementspath,undo,clipboard,basicstyles,divarea

## Iframe `src=javascript/data` escaping

1. Select iframe object under "Source iframe" (it can include wrapping text).
1. Copy to clipboard.
1. Focus the editor.
1. Paste.

## Expected

No alert is displayed directly after the paste.

## Unexpected

An alert is displayed with "Fail" message.
