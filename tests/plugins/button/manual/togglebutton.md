@bender-tags: 4.19.0, 2444, feature, button
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, link

1. Wait for editor to fully load.
1. Check the info about `[aria-pressed]` attribute's value that is above the editor.

	**Expected** The value equals `false`.

	**Unexected** The value equals `true` or is not set.
1. Click the button in the toolbar.

	**Expected** The value equals `true`.

	**Unexected** The value equals `false` or is not set.
1. Click the button once more.

	**Expected** The value equals `false`.

	**Unexected** The value equals `true` or is not set.
