@bender-tags: widget, feature, 4.16.1, 4467
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, image2, contextmenu, undo

## Insert a paragraph before and after a widget

Test should be performed with browser dev tools opened.

### Scenario 1: `INSERT PARAGRAPH BEFORE A WIDGET`

1. Focus the widget.
2. Press `SHIFT + ALT + ENTER`.

**Expected:**

* A paragraph should appear before the widget.
* No errors must occur. No visible characters are deleted (use source mode to verify).
* Selection is moved into the newly created paragraph.
* There is an undo step created.

 **Unexpected:** No paragraphs are inserted before the widget.
### Scenario 2: `INSERT PARAGRAPH AFTER A WIDGET`

1. Focus the widget.
2. Press `SHIFT + ENTER`.

**Expected:**

* A paragraph should appear after the widget.
* No errors must occur. No visible characters are deleted (use source mode to verify).
* Selection is moved into the newly created paragraph.
* There is an undo step created.

 **Unexpected:** No paragraphs are inserted after the widget.