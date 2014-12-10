@bender-tags: tc
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, maximize, floatingspace, font

This bug is only reproducible in IE8-10.

1. Click `maximize` button to maximize editor.
2. Start selecting text starting from header `Apollo 11` and finish at the end of the first sentence in the first paragraph.
3. Hover over some dropdown in eiditor toolbar and wait until title reveals.
4. Click hovered dropdown.

**Expected result**: Dropdown options becomes visible.
**Unexpected result**: Dropdown options are located in wrong position. This means that might be located outside viewport i.e. invisible.