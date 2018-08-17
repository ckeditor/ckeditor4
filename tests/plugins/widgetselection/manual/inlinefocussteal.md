@bender-tags: 4.10.1, bug, 1719
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,list,widgetselection,elementspath,divarea

1. Focus the text input below the editor.
1. Press `ctrl/cmd + a`.
1. Type "foo".

## Expected

The input value is now "foo".

## Unexpected

Input value remains unchanged ("init") and the focus goes into the editor, where foo gets typed.