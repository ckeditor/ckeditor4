@bender-tags: bug, 4.11.0, 651, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, pastefromword, sourcearea

----

## Test indentation of pasted text

Paste text from Word with indentation. You can use example file: [Paragraph_indentation.docx](../generated/_fixtures/Paragraph_indentation/Paragraph_indentation.docx).

### Expected:

Pasted text has same indentation as in Word.

### Unexpected

Text has no indentation.
