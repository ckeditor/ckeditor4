@bender-tags: 4.14.0, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, table, quicktable, undo

# Test steps for all browsers

1. Click Quick Table button.
2. Use keyboard navigation keys to change grid selection.

## Expected

* `ARROW UP/DOWN/LEFT/RIGHT` - changes focus position according to the button direction
* `TAB` - moves focus one position forward
* `SHIFT + TAB` - moves focus one position back


3. Move selection using keyboard to 2 rows and cols position (2x2).
4. Press `SPACE`

## Expected

Table has been inserted into the editor with 2 rows and columns.

# Test steps for Firefox with JAWS text reader:

1. Click Quick Table button.
2. Use `ARROW UP/DOWN/LEFT/RIGHT` navigation keys to change grid selection.

## Expected

### For cell movement:

Text reader reads status below grid (replace `1 x 1` with current focus position):

	1 x 1 button, to activate press space bar

### For table button focus

Text reader reads button title:

	Insert table button, to activate press space bar
