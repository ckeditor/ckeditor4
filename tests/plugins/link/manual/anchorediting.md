@bender-tags: link, 4.7.1, 476, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: link,toolbar,wysiwygarea,sourcearea,elementspath

1. Select anchor in text (flag).
1. Edit anchor (flag icon in toolbar).
1. Change anchor text to `bar` and apply changes.

**Expected:**
* Anchor before edition should have text `foo`.
* There should remain only one anchor, after editing.
* In source should be only one anchor: `<p><a id="bar" name="bar"></a></p>`

**Unexpexted:**
* Instead of editing existing anchor new one will appear.
* In source you will see 2 anchors one nested inside another.
