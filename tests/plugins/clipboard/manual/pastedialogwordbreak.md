@bender-tags: bug, 4.5.2, 13495
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, clipboard, floatingspace, htmlwriter,

1. Click paste button on the toolbar.
1. If the browser will ask for clipboard access permission - chose option that will **not allow** it.
1. In the paste dialog, put word longer than text area's width.

#### Expected result:
Long words should be broken into separate lines and no horizontal scroll bar should be visible.
