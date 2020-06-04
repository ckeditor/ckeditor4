@bender-tags: 4.7.2, feature, 590
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, undo

**Scenario 1:**

1. Select text in editor.
2. Click `Text Colour` button and `More Colours` button.
3. Select color and click `OK` button. (**Expected:** Text color has been changed. Text is selected.)
4. Click `Text Colour` button and `More Colours` button.
5. Click `Cancel` button. (**Expected:** Text color has not been changed. Text is selected.)
6. Check wether `Undo`/`Redo` button works correctly.

**Scenario 2:**

1. Lose focus by clicking outside the editor.
2. Click `Text Colour` button and `More Colours` button.
3. Select color and click `OK` button.
4. Start typing. (**Expected:** The typed text has a color chosen in step 3).
5. Check whether `Undo`/`Redo` button works correctly.

Repeat scenarios above but instead of `Text Colour` button use `Background Colour` button.
