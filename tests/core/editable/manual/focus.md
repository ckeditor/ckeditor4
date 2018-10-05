@bender-tags: 4.11.0, feature, 2420
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, floatingspace, toolbar, easyimage

## For each editor:

1. Press button to focus editor.

	### Expected

	Window doesn't scroll and editor is focused.

	### Unexpected

	Window scrolls to the editor or editor isn't focused.

1. Scroll down to see editor, and focus caption image.

1. Blur editor.

1. Scroll top and press button again.

	### Expected

	Window doesn't scroll and caption is focused.

	### Unexpected

	Window scrolls to the editor or caption isn't focused.

## Note

Edge and IE can have visible flickering when pressing buttons.
