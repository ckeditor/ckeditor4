@bender-tags: link, bug, 4.4.8
@bender-ui: collapsed
@bender-ckeditor-plugins: link,toolbar,wysiwygarea,sourcearea

1. Edit the link (change URL to "bar").
2. Switch to source mode.
3. Link should contain `class="foo"`, red border, `tabindex="555"` and the `href` that you set.
