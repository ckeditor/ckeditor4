@bender-tags: 4.7.2, bug, 426
@bender-ui: collapsed
@bender-ckeditor-plugins: divarea, toolbar, basicstyles

1. Make selection of **bar** word
1. Press button below editor

**Expected:** There will be displayed `bar` below with green background. It's possible that, result will be as follows: `<strong>bar</strong>`, what is ok.

**Unexpected:** There will be displayed `bar baz` below with green background.
