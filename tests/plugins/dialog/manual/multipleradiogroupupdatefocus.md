@bender-tags: 4.20.1, bug, 439
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, dialog

1. Click `Open Dialog` button.
2. Click `bar2` to check and focus radio group item.
3. Press `TAB` key.

**Expected** Focus was moved to the second radio group to the `foo5` radio group item.

4. Click again the `bar2` radio group item and repeat step 3.

**Expected** Focus again was moved correctly to the `foo5` radio group item.

**Unexpected** Focus was moved to third radio group to the`foo9` radio group item.

5. Click `bar10` to check and focus radio group item.
6. Press `Shift+Tab` key.

**Expected** Focus was moved to the previous radio group to the `bar8` radio group item.

7. Click again the `bar10` radio group item and repeat step 6.

**Expected** Focus again was moved correctly to the `bar8` radio group item.

**Unexpected** Focus was moved to the first radio group to the `bar4` radio group item.
