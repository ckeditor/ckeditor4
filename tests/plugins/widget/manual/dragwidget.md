@bender-tags: widget, bug, 4.7.2, 711
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, image2, contextmenu

**Scenario:**

1. Click `Image` on toolbar.
2. Input image URL, set width to 100 and mark `Captioned image` checkbox.
3. Use the left mouse button to drag and drop image below `Hello world` paragraph. ***Expected result:*** Image has been dragged and dropped.
4. Mouse over the image and click right mouse button. ***Expected result:*** Context menu has been opened.
5. Mouse over the image and try to drag and drop by using right mouse button. ***Expected result:*** It's not possible to drag an image.
