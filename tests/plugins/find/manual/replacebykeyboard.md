@bender-tags: 4.19.1, bug, 5022
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, find

1. Open Find and Replace dialog and move to `Replace` tab.
2. In `Find what:` input type `foo`.
3. Press `Enter` key.

**Expected:** The pattern has been founded and the searched text is highlighted on the editable.

**Unexpected:** Nothing happened.

4. In `Replace with:` input type `test`.
5. Press `Enter` key.

**Expected:** The pattern has been replaced.

**Unexpected:** Nothing happened.
