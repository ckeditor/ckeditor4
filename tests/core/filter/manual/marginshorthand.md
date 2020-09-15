@bender-tags: bug, 1330, 4.15.1
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, sourcearea, floatingspace, toolbar, indentblock

# Margin shorthand conversion

*Repeat below steps in all editors.*

1. Copy the content of `textarea` below "Source to copy:".
1. Switch editor into source mode using "Source" button.
1. Paste copied markup into editor source area.
1. Switch back to WYSIWG mode by clicking "Source" button again.
1. Switch back to Source mode by clicking "Source" button again.

## Expected

Paragraph has source code like below:

`<p style="margin-bottom:12px; margin-left:0; margin-right:0; margin-top:0">This paragraph should have a margin.</p>`

## Unexpected

Paragraph has wrong margin values.
