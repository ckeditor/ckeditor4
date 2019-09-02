@bender-ui: collapsed
@bender-tags: 4.13.0, feature, 3240
@bender-ckeditor-plugins: wysiwygarea,toolbar,clipboard,image2,sourcearea,list,undo

**Note:**

**Please test with dev tools open and after each step check mask size and alignment. Each time it should adjust to the changes made.**

Expected and unexpected results are always the same:

### Expected result:
Mask adjusted to the new size of caption element. There is only one mask element for widget.
### Unexpected result:
Mask stayed the same size, didn't move properly or there are more than one mask elements.

1. Check if mask covers `caption` element of image widget.
1. Check text widget - the first `editable` should be editable and the second one should be masked.
1. Resize image using resize handler.
1. Drag image widget to the end of the document.
1. Switch to source code editing and back.
1. Undo all changes.
1. Focus image widget and click list button multiple times to check if there is always only one mask element.
