@bender-tags: selection, fake, widget, 4.9.0, bug, 1452
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, placeholder, basicstyles, toolbar, floatingspace

Reproduce 2 different scenarios. After each scenario refresh the page

## 1:

1. Focus the placeholder widget.
2. Press `delete` / `backspace` key.

## 2:

1. Focus the editor.
2. Select editor content using `cmd/ctrl + a`.
3. Press `delete/backspace` key.

## Expected

Notification should showed up with information about passing test.

## Unexpected

No notification displayed.
