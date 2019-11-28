@bender-tags: 4.13.1, bug, 3524
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, htmlwriter, wysiwygarea, floatingspace, toolbar, easyimage, undo
@bender-include: ../_helpers/tools.js

1. Open browsers dev console if possible.
2. Copy-paste or drag and drop image to the editor.

    ### Expected:
    * Image is pasted to the editor.
    * Image with logo is upcasted to the easyimage widget.
    * Image with equation is not upcasted to easyimage widget.

    ### Unexpected:
    * Image with equation is not copied and error appears in the console.
    * Image with equation is upcasted to easyimage widget.

3. Check source view.

    ### Expected:
    * Image with equation should have src attribute starting with: `data:image/svg+xml;`.

**Important**: Using native context menu for copying triggers [`#3568`](https://github.com/ckeditor/ckeditor4/issues/3568) bug.

**Important**: On IE 11 and Edge browser use copy-paste only due to [`#3546`](https://github.com/ckeditor/ckeditor4/issues/3546) and [`#3568`](https://github.com/ckeditor/ckeditor4/issues/3568) bugs.

