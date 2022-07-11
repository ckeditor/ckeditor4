@bender-tags: 4.19.1, bug, 5022
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, find

1. Open Find and Replace dialog and move to `Replace` tab.
2. In `Find what:` input type `foo`.
3. Press `Enter` key.

**Expected:** The pattern was found.

**Unexpected:** Nothing happened.

4. In `Replace with:` input type `test`.
5. Press `Enter` key.

**Expected:** The pattern was replaced.

**Unexpected:** Nothing happened.
