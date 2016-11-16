@bender-ui: collapsed
@bender-tags: tc, copyformatting, 4.6.0
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace

**Procedure**

1. Open console.
2. Place cursor in the middle of first line, like so: `under^lined`.
3. Click "Copy Formatting" button.
4. Click in the middle of the second line, `bazfo^obaz`.

**Expected**

* Whole contents of the second paragraph gets styled.
* No error is logged into console.
