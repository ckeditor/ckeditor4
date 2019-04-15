@bender-tags: bug, 4.11.2, 2690, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, pastefromword, sourcearea, list, liststyle

----

## Test preserving content of pasted list:

1. Paste content from given Word file:
 [Ordered_list_symbol_in_text.docx](../generated/_fixtures/Ordered_list_symbol_in_text/Ordered_list_symbol_in_text.docx).

1. Compare pasted text with what was copied.

### Expected:

Each list item text looks the same

### Unexpected

List number repeated in text is missing.
Eg. `1. Foo 1. Bar` is converted to `1. Foo Bar`.
