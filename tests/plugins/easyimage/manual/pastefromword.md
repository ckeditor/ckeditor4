@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage, undo, pastefromword
@bender-include: ../_helpers/tools.js
## Easy Image PFW Integration

Upload some images:

1. Open a document containing an image in MS Word (e.g. [`Image_alternative_text.docx`](https://github.com/ckeditor/ckeditor4/blob/7ecc15bc26aef53fadb7f3ec342510ca2d736236/tests/plugins/pastefromword/generated/_fixtures/PFW_image/Image_alternative_text/Image_alternative_text.docx)).
1. Copy whole file contents.
1. Focus the "Classic editor".
1. Paste into the editor.

### Expected

* Image is inserted as an Easy Image widget.
* Image gets uploaded (if you didn't see the progress bar you can examine it by checking image URL in devtools).

Repeat the steps with Inline editor.
