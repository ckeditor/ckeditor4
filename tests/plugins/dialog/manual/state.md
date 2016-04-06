@bender-tags: dialog, 13434, tc, 4.5.2
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, dialog

## Observe dialog state change

1. Click the toolbar button.
1. Click "Set dialog busy". A **spinning** indicator should appear in the **upper left corner** (**upper _right_ corner** in RTL mode) of the dialog, before the title.
1. Click the **OK** button. Nothing should happen. It supposed to be disabled.
1. Click "Set dialog idle". The spinner should disappear.
1. Click the **OK** button. The dialog should disappear.
1. Re–open the dialog. Click each of the buttons multiple times. There should be no errors in console. Nothing extra should happen except of
	* the spinner appearing and disappearing
	* **OK** button being locked and unlocked

## Dialog state reset on hide

1. Re–open the dialog.
1. Click "Set dialog busy".
1. Click **Cancel**.
1. Re–open the dialog.
1. The dialog should be idle (**OK** button **enabled**, no spinner).

## Notes

* Expect the "Ok" and "Cancel" buttons and their tooltips in RTL mode to be in Hebrew.
