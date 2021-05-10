@bender-tags: 4.16.1, bug, 4617
@bender-ui: collapsed
@bender-ckeditor-plugins: divarea, toolbar, basicstyles, autocomplete
@bender-include: _helpers/utils.js

**Note**: It's a longish one, requires the constant editor focus, so better read it whole before doing anything!

1. Open screen reader.
2. Focus the editor.

	**Expected:** Screen reader announces the editor and its autocomplete (e.g. "has popup" or "has autocomplete). Note: JAWS can announce the autocomplete only if the editor is empty.

	**Unexpected:** Screen reader does not announce the editor or its autocomplete.

3. Press `@` and wait until autocomplete opens.

	**Expected:** Screen reader announces the autocomplete ("expanded" with optional "listbox"/"list") and reads the selected item.

	**Unexpected:** Screen reader does not announce the autocomplete or doesn't read the selected item.

4. Press arrow up/arrow down.

	**Expected:** Screen reader announces the newly selected item (e.g. "at thomas, 2 of 5").

	**Unexpected:** Screen reader does not announce the newly selected item.

5. Press Esc (you probably will need to press it twice) to close the autocomplete.

	**Expected:** Screen reader optionally inform about collapsed autocomplete. Screen reader reannounces the editor.

	**Unexpected:** Screen reader does not say anything.
