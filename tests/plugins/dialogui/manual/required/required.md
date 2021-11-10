@bender-tags: 4.17.0, feature, 3433
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, dialog, dialogui, image, table, link, iframe, floatingspace

1. Switch on a screen reader if available.
1. Open one of the available dialogs (eg. Link)

	**Expected** Required labels have a bold asterisk.

	**Unxpected** Required labels don't have a bold asterisk.
1. (Screen Readers) Navigate to one of the required fields.

	**Expected** A screen reader does not read the asterisk.

	**Unexpected** The asterisk is read by a screen reader.

2. Repeat the above step for the remaining dialogs boxes.
