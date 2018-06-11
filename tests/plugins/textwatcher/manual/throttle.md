@bender-tags: 4.10.0, feature, 1997
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, textwatcher

1. Focus the editor.
1. Start typing `a` constantly.
1. Check log above the editor.

## Expected

Typed text should be logged:

1. Immediately after first typed character.
1. Not more often than once every 2000ms.

## Unexpected

Typed text is logged immediately or in invalid interval times.
