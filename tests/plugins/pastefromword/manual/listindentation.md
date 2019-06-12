@bender-tags: bug, 4.12.0, 2870, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, pastefromword, sourcearea, list

## Things to know before testing

- Default list in Word has `48px` indentation, and each sublist has `level * 48px`. In output it is represented by `margin-left`.
- Default sublist in Word has `margin-left: 96px` (`2 * 48px`).
- List items in Word output aren't grouped by any parent element.
- Default `ol` and `ul` in HTML has 40px padding.
- To keep Word indentation we need to take list item, subtract `40px` from it's `margin-left`, and wrap it in `ol` or `ul`. This turns default Word list into: `<ol><li style="margin-left:8px">Foo</li><ol>`
- List items with negative margins are broken in editor, so such values are removed.
- When merging sublist into parent list, we need to subtract (`40px` + parent's `margin-left`).

### Conclusion

List items in Word are separate beings with absolute indentation based on `margin-left`, while list items in editor are nested with relative indentation based on `margin-left` + parents default `padding-left: 40px`, and indentation of parent.

## Test scenario

1. Paste text from Word with indented lists. You can use example file: [List_indentation.docx](../generated/_fixtures/List_indentation/List_indentation.docx).
2. Hover list items (`li`), to see it's `margin-left`.

### Expected:

- Indentation of top list looks visually the same in Word and in Editor.
- Bottom list items has margin-left matching what's described in it.

### Unexpected

- Top list doesn't look the same.
- Any element has negative `margin-left` values.
- Bottom list has different `margin-left` than described.
