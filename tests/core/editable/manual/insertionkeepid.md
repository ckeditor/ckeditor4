@bender-tags: 4.7.1, tc, 17009
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, divarea, toolbar, sourcearea, undo, elementspath, justify, specialchar

----

### Insert text.
1. Open `Source` in editor. Make sure there is `span` with `id` attribute.
1. Put carret in editor.
1. Insert text, by usinng `Insert Special Character` button.
1. Check `Source` again
1. There should remain one `spane` element with `id`
1. Repeat steps in 2nd editor

**Unexpected:** As result you will obtain splited text into 2 span elements.
