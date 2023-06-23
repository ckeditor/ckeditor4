@bender-tags: 4.22.0, bug, 5316
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, pastefromword, sourcearea, list

1. Copy and paste content from unordered list between and including `Paragraph before` and `Paragraph after` of the following file into both editors:
[list with margins.docx](_assets/list_with_margins.docx)
2. Switch to source mode.

## Expected

* **The first editor**: `ul` or `ol` element have styles: ```margin-bottom:32px; margin-top:32px;```.

* **The second editor**: neither element has a margin.

## Unexpected

* The first editor does not have styles mentioned in **Expected**.

* The second editor has elements with a margins value of `32px`.


3. Repeat above steps for the ordered list.
