@bender-tags: 4.19.0, 2444, feature, button
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, maximize

1. Wait for editor to fully load.
1. Check the info about the "Maximize" button that is rendered inside the editor.

	**Expected** The "Is pressed" equals `false` and "Label" equals "Maximize".

	**Unexected** The "Is pressed" equals `true` or is not set.
1. Click the button in the toolbar.

	**Expected** The "Is pressed" equals `true` and "Label" equals "Maximize".

	**Unexected** The "Is pressed" equals `false` or "Label" equals "Minimize".
1. Click the button once more.

	**Expected** The "Is pressed" equals `false` and "Label" equals "Maximize".

	**Unexected** The "Is pressed" equals `true` or is not set.
