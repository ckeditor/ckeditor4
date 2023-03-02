@bender-tags: 4.20.3, bug, 5316
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, pastefromword, sourcearea, list

1. Copy and paste content of the following file into both editors:
[keep zero margins.docx](_assets/keep-zero-margins.docx)
1. Open source mode.

## Expected

* **The first editor**: the `ul` and `ol` elements have styles: ```margin-bottom:0; margin-top:0;```

* **The second editor**: none of elements have any margin with value of `0`, or `0+unit`.

## Unexpected

* The first editor doesn't have styles mentioned in **Expected**.

* Second editor has elements with margin value equal 0.
