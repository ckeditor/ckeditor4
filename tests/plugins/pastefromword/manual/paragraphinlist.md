@bender-tags: bug, 4.11.4, 2871, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, pastefromword, sourcearea, list, liststyle, indentblock, undo, elementspath

Paste into editor Word document with paragraphs between list items which has same or higher indentation as list items around. You can use following file:
[Paragraph_indentation.docx](../generated/_fixtures/Paragraph_in_list/Paragraph_in_list.docx).

### Expected:

- Each paragraph which has same or higher indentation as preceding list item in Word becomes child of this list in editor.
- If list items around such paragraph in Word are part of one list they become children of same `<ol>`/`<ul>` element.
- Paragraph margin looks the same as in Word.

### Unexpected

- Such paragraph is not merged into preceding list.
- List items are not merged into same list.
- Margin is distorted.
