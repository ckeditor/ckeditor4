@bender-ui: collapsed
@bender-tags: 4.11.0, 1113, bug
@bender-ckeditor-plugins: divarea, toolbar, basicstyles, elementspath

1. Put selection inside text with normal font style i.e. `You can ^type here`
2. Put selection inside text with italic font style i.e. *`and you can ^type again inside this editable part`*

## Expected

Upper square changes color to blue (1st step) and red (2nd step) which means that elements path changed.

## Unexpected

Upper square is not changing when moving selection between text nodes which means that elements path didn't change.
