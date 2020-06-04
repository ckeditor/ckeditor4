@bender-tags: 4.7.0, bug, uicolor
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, basicstyles, uicolor, floatingspace

# Scenario

Play with `uicolor` plugin, changing the UI color of both editors.

## Things to notice:
- When new color in a dialog is selected (in color palette or dropdown) the editor UI color changes.
- Editor UI color does not change when new color is highlighted.
- When dialog is reopened the ui color should be selected
	- If standard it will be highlighted and selected in the color palette.
	- If predefined it will be selected in a dropdown (dropdown should be focused).
