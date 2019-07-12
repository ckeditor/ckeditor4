@bender-include: ../../dialog/manual/_helpers/tools.js
@bender-tags: widget, dialog, 4.13.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, placeholder

1. Click `placeholder` widget button.
2. Verify status above the editor.

## Expected

Dialog name: **placeholder** in **editor** editor.

Dialog is in **creation** mode.

Currently editing: Widget (placeholder)

---

3. Insert `example.com` `placeholder` URL and click `OK`.
4. Double click `placeholder` to open dialog again.
5. Verify status above the editor.

## Expected

Dialog name: **placeholder** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: Widget (placeholder)
