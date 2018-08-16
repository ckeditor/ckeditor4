@bender-tags: 4.6.0, bug, config
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image2

For each editor:

1. Click inside the editor.
1. Open "Image Properties" dialog by clicking "Image" button in the toolbar.
1. Use `https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2.png` as URL.
1. Click OK button.

	**Expected:** For editor 1 and 2 the image gets inserted. For editor 3 an error should be shown with msg "Alternative text is missing.".

1. (Editor 3 only) "foo" as "Alternative Text".

	**Expected:** Image gets inserted, no alert is shown.
