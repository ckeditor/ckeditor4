@bender-tags: widget, faeture, 4.16.0, 4467
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, image2, contextmenu, undo

## Insert a paragraph above and below a widget

Test should be performed with browser dev tools opened.

### Scenario 1: `INSERT PARAGRAPH ABOVE A WIDGET`

1. Focus the widget.
2. Press `SHIFT + UP ARROW`.

**Expected:**

* A paragraph should appear above the widget.
* No errors must occur. No visible characters are deleted (use source mode to verify).
* There is an undo step created.

 **Unexpected:** No paragraphs are inserted above the widget.
### Scenario 2: `INSERT PARAGRAPH BELOW A WIDGET`

1. Focus the widget.
2. Press `SHIFT + DOWN ARROW`.

**Expected:**

* A paragraph should appear below the widget.
* No errors must occur. No visible characters are deleted (use source mode to verify).
* There is an undo step created.

 **Unexpected:** No paragraphs are inserted below the widget.