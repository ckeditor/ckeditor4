@bender-tags: dialog
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, dialog

1. Click the toolbar button.
1. Click "Set dialog busy". A **spinning** indicator should appear in the **upper left corner** of the dialog, before the title.
1. Click the **OK** button. Nothing should happen. It supposed to remain disabled.
1. Click "Set dialog idle". The spinner should disappear.
1. Click the **OK** button. The dialog should disappear.
1. Re–open the dialog. Click each of the buttons multiple times. There should be no errors in console. Nothing extra except of showing/hiding the spinner should happen.