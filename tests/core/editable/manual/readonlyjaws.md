@bender-tags: 4.10.2, bug, 1904, accessibility
@bender-ui: collapsed
@bender-ckeditor-plugins: clipboard, toolbar, wysiwygarea, link, floatingspace, elementspath

For each editor:

1. Run JAWS.
1. Focus the editor.

## Expected

Name of the editor is announced, followed by "readonly edit".

## Unexpected

There is no "readonly edit" part in editor's announcement.

## Known issues:

* [#2445](https://github.com/ckeditor/ckeditor-dev/issues/2445) Name in iframe-based editor is announced twice.
