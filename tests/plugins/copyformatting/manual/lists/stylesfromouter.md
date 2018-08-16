@bender-ui: collapsed
@bender-tags: bug, copyformatting
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, elementspath, list, indentlist, liststyle, undo

1. Put the caret inside list item with "start-value-6-lower-roman" content.
2. Click "Copy Formatting" button.
3. Click inside list item with "Simple list" content.

### Expected

Selected numbered list should have start value of 6 & list style of lower-roman.


### Unexpected

Selected numbered list has start value of 5 & list style of upper-alpha which is the style of the outer list from where the styles were copied.
