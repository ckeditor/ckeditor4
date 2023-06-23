@bender-tags: 4.22.0, bug, 5316
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, pastefromword, sourcearea, list

1. Copy and paste content from unordered list between and including `Paragraph before` and `Paragraph after` of the following file into both editors:
[keep zero margins.docx](_assets/keep_zero_margins.docx)
2. Switch to source mode.

## Expected

* **The first editor**: `ul` or `ol` elements have styles: ```margin-bottom:0; margin-top:0;```.

* **The second editor**: none of the elements have margin `0`, or `0+unit`.

## Unexpected

* The first editor does not have styles mentioned in **Expected**.

* The second editor has elements with margin value of `0`.


3. Repeat above steps for the ordered list.
