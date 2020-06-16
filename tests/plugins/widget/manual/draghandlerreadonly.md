@bender-tags: 4.13.0, bug, 3260
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, widget, clipboard, image2

## Scenario 1:

Mouse hover on widget.

### Expected

Drag handler appears.

### Unexpected

Drag handler doesn't appear.

---

## Scenario 2:

1. Make editor readonly with checkbox.

1. Mouse hover on widget.

### Expected

Drag handler doesn't appear.

### Unexpected

Drag handler appears.
