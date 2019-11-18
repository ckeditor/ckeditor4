@bender-ui: collapsed
@bender-tags: 3544, 4.13.1, bug
@bender-ckeditor-plugins: wysiwygarea, toolbar, specialchar

1. Open specialchar dialog.
2. Turn on Voice Over on MacOS (`CMD + F5`) or Narrator on Windows (`WIN + CTRL + Enter`).
3. Move selection to the last character.
4. For MacOS: press `CapsLock + Right Arrow`.
5. For Windows: press `Right Arrow`.

In case that you have problem with performing steps with assistive technology:
1. Open console.
2. Inspect if there exists empty table cells after last character in the dialog.

### Expected result:
Assisitve technology doesn't detect and read content of empty table cells at the end of special char dialog.
There shouldn't be any empty cells at the end.

### Unexpected result
Empty table cells are added at the end of characters list.
