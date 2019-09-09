@bender-tags: 2395, bug, 4.13.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, link

1. Read expected.
1. Scroll down until editor is visible.
1. Press link button.
1. Resize browser window.
1. Resize dialog window.
1. Drag dialog window.
1. Close and reopen dialog.

## Expected

- When dialog is shown scrollbars are invisible.
- When resizing browser window dialog is still horizontally and vertically centered.
- When window is too small to fit dialog window scrollbars should appear allowing to scroll dialog.
- Dialog window can be resized and dragged around.
- When closing and reopening dialog it has same size and position as it had before when it was closed.

### Note
When you reposition dialog it won't be centered when resizing browser window. Repositioned dialog will move in a way that it will have same percentage of free space on each side. E.g. Consider there is when there is free space around dialog:
- on the left 10px
- on the right 90px

Then when window width is increased so that there will be 200px of free space around dialog now there will be:
- on the left 20px
- on the right 180px

If instead window width is decreased so there is 50px free space then there will be:
- on the left 5px
- on the right 45px
