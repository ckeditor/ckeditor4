@bender-tags: 4.7.1, 478, bug, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, enterkey

---

## Scenario 1:

1. Open browser developer console.
2. Select text from the end, e.g. `commodo consequat.`.
3. Click below the whole paragraph.
4. Press `enter` key.

## Scenario 2:

1. Open browser developer console.
2. Select text from the end, e.g. `commodo consequat.`.
3. Click `Remove selection` button (one without the icon) on toolbar.
4. Click `enter` key.

**Expected:** No error occurred in the browser developer console.

**Unexpected result:** An error in the browser developer console occurred: `Uncaught TypeError: Cannot read property 'isContextFor' of null`

#### Notes:
* On different browsers, the caret may behave differently. Only in Chrome, when clicked below (and after) selected text,
the caret disappears.
* In IE8 for the *Scenario 2* the caret may appear on the text beginning when pressing enter (so newline will be inserted)
which is fine.

