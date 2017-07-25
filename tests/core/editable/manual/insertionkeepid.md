@bender-tags: 4.7.2, bug, trac17009
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, undo, specialchar

----

Note: Perform below steps on both editors.

### Insert text.
1. Switch to `Source mode` and make sure there is a `span` with `id` attribute.
1. Switch back to `WYSIWYG mode` and put caret inside `Foo` word.
1. Insert character usinng `Insert Special Character` button.
1. Check `Source mode` again.

**Expected:** There should remain one `span` element with `id`.

**Unexpected:** After specal character insertion `span` element was splited into two: e.g. `<span id="SomeId2">Fo#</span><span>o</span>`.
