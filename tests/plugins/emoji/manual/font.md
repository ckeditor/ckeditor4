@bender-tags: 4.14.0, feature, emoji, 2583
@bender-ckeditor-plugins: wysiwygarea, toolbar, emoji
@bender-ui: collapsed
@bender-include: ../_helpers/tools.js

1. Focus editor.
1. Type `:smiling_face:`

## Expected:

Nice colored emoji is displayed in emoji suggestion box: <span style="font-family:&quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">☺</span>

## Unexpected:

Ugly black and white smiley is displayed in emoji suggestion box: <span style="font-family:sans-serif">☺</span>
