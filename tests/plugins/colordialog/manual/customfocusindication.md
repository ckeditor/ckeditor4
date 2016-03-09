@bender-tags: tc, colordialog, 8679
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, link, colorbutton, colordialog

Make sure the dev console is open during testing so any possible errors or warnings can be noticed.

## Scenarios

### Editor 1:
1. Click *Text Color* button, then *More Colors*.
	* Dialog with color picker opens.
1. Focus few different color cells inside color grid using keyboard and mouse.
	* Focus is indicated by 1px dotted border (black or white) and is visible only on currently focused cell. Highlight
	preview changes to currently focused color.
1. Select few different color cells using keyboard (space) and mouse.
	* Selection is not indicated in any way inside color grid. Selection preview changes to currently selected color.
1. Perform steps 1 - 3 using *Background Color* button.

### Editor 2:
1. Click *Text Color* button, then *More Colors*.
	* Dialog with color picker opens.
1. Focus few different color cells inside color grid using keyboard and mouse.
	* Focus is indicated by 2px solid red border and is visible only on currently focused cell. Highlight
	preview changes to currently focused color.
1. Select few different color cells using keyboard (space) and mouse.
	* Selection is indicated 2px solid blue border. Selection preview changes to currently selected color.
1. Use *Clear* button inside the dialog to clear currently selected color.
	* Border indicating selected color is removed and selection preview is cleared.
1. Perform steps 1 - 4 using *Background Color* button.

_When color is focused and selected at the same time, the selection style should be visible._
