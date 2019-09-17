@bender-tags: feature, link, 2227, 4.13.0
@bender-ckeditor-plugins: link, toolbar, wysiwygarea
@bender-ui: collapsed

1. Click link button in the first editor.

**Expected:** Protocol set to `https://`.

2. Change protocol into `http://`.
3. Fill URL field with `foo`.
4. Click `OK`.
5. Double click inserted link to open dialog.

**Expected**: Link protocol remains `http://`.

6. Repeat 1-5 test steps with the second editor using `<other>` protocol instead of `http://`.
