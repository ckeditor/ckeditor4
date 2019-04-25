@bender-tags: feature, 4.12.0, 2935, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, sourcearea

1. Copy and paste content of the following file into both editors:
[Vertical_margin.docx](../generated/_fixtures/Vertical_margin/Vertical_margin.docx)
1. Open source mode.

## Expected

- **The first editor**: the first `p` element has styles:
```margin-right:0; margin-bottom:0; margin-left:0;```
or in IE: ```margin: 16px 0px 0px```

- **The second editor**: none of elements have any margin with value of `0`, or `0+unit`.

## Unexpected

- The first editor doesn't have styles mentioned in **Expected**.

- Second editor has elements with margin value equal 0.
