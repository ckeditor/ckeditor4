@bender-tags: 4.7.2, feature, 590
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, undo

**Scenario:**

1. Select text in editor.
2. Click `Text Colour` button.
3. Change color by using a proposed color. (**Expected:** Text color has been changed. Text is selected.)
5. Click `Text Colour` button.
6. Click `More Colours` button.
7. Select color and click `OK` button. (**Expected:** Text color has been changed. Text is selected.)
8. Click `Text Colour` button.
9. Click `More Colours` button.
10. Click `Cancel` button. (**Expected:** Text color has not been changed. Text is selected.)
11. Check wether `Undo`/`Redo` button works correctly.

Repeat steps above but instead of `Text Colour` button use `Background Colour` button.

