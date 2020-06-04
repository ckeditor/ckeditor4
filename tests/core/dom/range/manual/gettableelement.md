@bender-tags: 4.13.0, bug, range, 3101
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, sourcearea

1. Make selection in editor described below:
  * use mousedown inside first cell in first row in text node. For example here: `fo^o`,
  * select the beginning of the word and the table by dragging cusor to the margin before table,
  * below editor is displayed selection inspector with red pointer showing where it starts and ends,
  * desired result is to start selection before `<table>` element, to look like this: `[<table><tr><td>fo}o</td>...`,
  * you can try to use `shift+arrow` to select desired part, however, selection inspector reacts on mousemve events. This is why you need also move mouse to udpate its state.
2. Press the button below editor: `Get range result`.

## Expected:

There is message below editor in red box: `Range contains "table" element`

## Unexpected:

There is message below editor in red box: `Range contains "null" element`
