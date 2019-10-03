@bender-tags: 4.13.1, bug, 3524
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage, undo
@bender-include: ../_helpers/tools.js

1. Open editor's console if possible
2. Copy-paste or drag and drop image to the editor. Please notice that both image should be processed differently.
3. Check sourceview

### Expected:
* Image is pasted to the editor.
* Image with logo is upcasted to the easyimage widget.
* Image with equation is not upcasted to easyimage widget.
* Image with equation should have src attribtue started with: `data:image/svg+xml;`

### Unexpected:
* Image with equation is not copied and error appears in the console.
* Image with equation is upcasted to easyimage widget.
