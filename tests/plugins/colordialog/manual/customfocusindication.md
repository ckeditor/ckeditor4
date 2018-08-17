@bender-tags: bug, colordialog, trac8679, 4.5.9
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog

### Editor 1:

1. Click *Text Color* button, then *More Colors*.
	* Dialog with color picker opens.
1. Focus different color cells (using keyboard).
	* Focus is indicated by 1px dotted border (black or white).
	* Highlight color changes to the currently focused one.
1. Select few different color cells using keyboard (space) and mouse.
	* Selection preview changes to currently selected color.
1. Use *Clear* button inside the dialog to clear currently selected color.
	* Border indicating selected color is removed and selection preview is cleared.
1. Perform steps 1 - 3 using *Background Color* button.

### Editor 2:

Same steps as for Editor 1 with following exception:
* Dialog is bigger, colors are shown as circles.
* Focused color is marked with solid red border instead white dotted.
* Selected color is indicated with solid blue border.
