@bender-ui: collapsed
@bender-tags: 3544, 4.13.1, bug
@bender-ckeditor-plugins: wysiwygarea, toolbar, specialchar

1. Open specialchar dialog

### Expected result:
Empty table cells at the end of character list should have role="presentation". You can inspect element to check it, however,
there are also a css rules which marks `<td>` elements with `role="presentation"` with red dashed border.

### Unexpected result
Empty table cells at the end of the list don't have presentation role.
