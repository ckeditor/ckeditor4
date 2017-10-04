## Inline Style

### How it works

* Inline styles are applied differently than block formats. They require either
an inline selection of characters within a block, an empty selection where you
immediately insert characters, or in special circumstances, the selection of one
or more text blocks.

* If you apply an inline style to an empty selection, the characters that you type
immediately after choosing a style from the menu will have that style applied to
them.

* With an empty selection, if you choose an inline style and then do not type any
characters and change the position of the cursor, the style will not be applied.

### Why it's important

* Inline styles are important semantically at a lower level than block formats.
For example, choosing 'Emphasis' for a word or phrase within a text block will
highlight them both visually and semantically, which is important for users of
assistive technologies such as screen readers.

* Thinking in terms of block formats first, and inline styles at a lower level
as necessary, results in documents with more comprehensible structure and semantics.

* When block formats are considered as primary, and inline styles secondary, many
visual styling decisions are already made by default.

### More information
