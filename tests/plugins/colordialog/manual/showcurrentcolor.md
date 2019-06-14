@bender-tags: feature, 4.12.0, 2639
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog

**Scenario 1:**

1. Select text in editor 1.

2. Click `Text Colour` button and `More Colours` button.
	#### Expected
	Color of text is by default focused, highlighted, selected and its RGB code is displayed.

3. Select different color and click `OK` button.
	#### Expected
	Text color has been changed. Text is selected.

4. Click `Text Colour` button and `More Colours` button again.
	#### Expected
	New color is focused, highlighted, selected and its RGB code is displayed.

**Scenario 2:**

1. Change color of the word `Hello` in editor 2.

2. Select whole `Hello world!` sentence.

3. Click `Text Colour` button and `More Colours` button.
	#### Expected
	The color in the top left corner is focused and highligthed and no color is selected.
