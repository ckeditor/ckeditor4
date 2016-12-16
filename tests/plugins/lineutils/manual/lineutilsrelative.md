@bender-tags: lineutils, tc, 4.4.8
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image2, font, stylescombo, basicstyles, format, maximize, blockquote, list, table, resize, elementspath, justify, clipboard, floatingspace, sourcearea, htmlwriter

## Lineutils in a relatively positioned body

There's a number of classic and inline editors in this page.

1. **Scroll right** to reveal the editors.
2. **Hover** the mouse over each **editable**. A number of red, stripped lines should appear. Don't worry about the number of lines, neither which elements trigger them.
3. However, make sure:
  1. Each line is visible within the **rectangle of editable**, e.g. does not overlap the UI of the editor or any other page element (excluding scrollbars – a known bug).
  2. Each line is displayed either at the **top** or **bottom** edge of a green element or directly **in the middle** of the gap between two such elements.
4. **Play.** Scroll the page, scroll editables, resize editors, resize browser window. **Repeat steps 2-3** with different geometries the viewport.