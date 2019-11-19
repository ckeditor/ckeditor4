@bender-tags: 4.14.0, feature, emoji, 2583
@bender-ckeditor-plugins: wysiwygarea, toolbar, emoji
@bender-ui: collapsed
@bender-include: ../_helpers/tools.js

1. Focus the editor.
1. Type `:smiling_face:`

## Expected:

Emoji suggestion box displays a nicely colored emoji symbol like this one: <span style="font-family:&quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">☺</span>.

## Unexpected:

Emoji suggestion box displays an ugly black and white smiley like this one: <span style="font-family:sans-serif">☺</span>
