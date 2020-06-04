@bender-tags: 4.13.0, feature, 2975
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,contextmenu,stylescombo,language

## Test Scenario

1. Open context menu inside the editor and press <kbd>Space</kbd>.
	### Expected

	* Alert with focused menu item's name is displayed.

	### Unexpected

	* Nothing happens.
2. Repeat the same procedure for <kbd>Enter</kbd>.

	Note: <kbd>Enter</kbd> does not work in Firefox on macOS – [#3271](https://github.com/ckeditor/ckeditor4/issues/3271).
3. Repeat above steps also for Language button and Styles combo
	### Expected

	* Options activated via keyboard works correctly.

	### Unexpected

	* Options are not activated via keyboard.
