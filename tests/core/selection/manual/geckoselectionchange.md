@bender-ui: collapsed
@bender-tags: 4.9.0, 1113, bug
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, elementspath

----

1. Put selection inside text with normal font style e.g. `You can ^type here`
2. Put selection inside text text with italic font style e.g. *`and you can type again inside this editable ^part and some underline inside`*

## Expected

Upper square toggles color blue/red (default is yellow).

## Unexpected

Upper square is not changing when moving selection between text nodes.
