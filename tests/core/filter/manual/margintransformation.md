@bender-tags: bug, 450, 4.7.1, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, indentblock, sourcearea

# Margin transformation

1. Copy the content of `textarea` below "Source:".
1. Switch editor into source mode using "Source" button.
1. Paste copied markup into editor source area.
1. Switch back to WYSIWG mode by clicking "Source" button again.

## Expected

Paragraph has left margin visible and source code like below:

`<p style="margin-left:60px; margin-right:60px">This paragraph should have a margin.</p>`

## Unexpected

Margin is stripped completely.
