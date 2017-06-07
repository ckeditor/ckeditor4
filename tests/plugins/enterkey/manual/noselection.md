@bender-tags: 4.7.1, 478
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, enterkey, htmlwriter, sourcearea

---

## Scenario 1: ###

1. Open browser developer console.
2. Select text from the end. E.g. `commodo consequat.`.
3. Click below the whole paragraph.
4. Press `enter` key.

## Scenario 2: ###

1. Open browser developer console.
2. Select text from the end. E.g. `commodo consequat.`.
3. Click invisible `Remove selection` button on toolbar.
4. Click `enter` key.

**Expected:** No error occurred in the browser developer console.

**Unexpected result:** An error in the browser developer console occurred: `Uncaught TypeError: Cannot read property 'isContextFor' of null`

#### Notes:
On different browsers, the caret may behave differently.

