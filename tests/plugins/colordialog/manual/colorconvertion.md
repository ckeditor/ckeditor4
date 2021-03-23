@bender-tags: bug, 4.16.1, 4351
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog

1. Select some text in the editor.
2. Click "Text Color" button in the toolbar and choose "More Colors" option.
3. Insert into color text field `hsla(150,50%,52%,0.2)` value.
4. Confirm the color by clicking "Ok".
5. Reopen color dialog by repeating steps 1-2.
6. Check the value of the color text field

	## Expected

	* The value is equal to `#DAF3E7`.

	## Unexpected

	* The value is equal to `#rgba(71, 194, 133, 0.2)`.
7. Repeat the whole procedure for following values (input → expected output):

	* `hsl(150,50%,52%)` → `#47C28`,
	* `rgba(100,200,50,.4)` → `#C1E9AD`.
