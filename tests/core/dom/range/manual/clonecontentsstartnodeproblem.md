@bender-tags: 4.7.2, bug, 426
@bender-ui: collapsed
@bender-ckeditor-plugins: divarea, toolbar, basicstyles

1. Select `bar` word in the editor.
1. Press button below editor.
1. Check result below.

**Expected:** There will be displayed `bar` below editor within green background. It's possible that result will be `<strong>bar</strong>`, what is also ok.

**Unexpected:** There will be displayed `bar baz` below with green background.
