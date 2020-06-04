@bender-tags: selection, fake, widget, 4.9.0, bug, 1516
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, placeholder, basicstyles, toolbar, floatingspace

1. Focus the placeholder widget.
2. Blur the placeholder widget.
3. Focus placeholder widget again.
4. Press `delete/backspace` key.

## Expected

The placeholder widget shouldn't change.

## Unexpected

The placeholder widget has been deleted.
