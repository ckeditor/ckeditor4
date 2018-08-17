@bender-tags: mentions, feature, 4.10.0, 1969
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, mentions

1. Focus the editor.
1. Type `@anna`.
1. Press enter.
1. Press space.
1. Type `@anna` again.
1. Press enter.
1. Check request history log above the editor.


## Expected

History log doesn't contain duplicated request values.

## Unexpected

There are requests in the history log.
