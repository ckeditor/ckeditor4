@bender-tags: 4.12.0, feature, 2975
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,contextmenu,stylescombo,language

## Test Scenario

1. Open context menu inside the editor and press <kbd>Space</kbd>.
	### Expected

	* Alert with focused menu item's name is displayed.

	### Unexpected

	* Nothing happens.
2. Repeat the same procedure for <kbd>Enter</kbd>.
3. Repeat above steps also for Language button and Styles combo
	### Expected

	* Options activated via keyboard works correctly.

	### Unexpected

	* Options are not activated via keyboard.
