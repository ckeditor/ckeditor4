@bender-ui: collapsed
@bender-tags: 4.8.0, feature, balloontoolbar, 933
@bender-ckeditor-plugins: wysiwygarea, basicstyles, floatingspace, balloontoolbar, sourcearea, link, elementspath, image2, placeholder, codesnippet

## Balloon Toolbar with Widgets

Linking toolbar should be shown for:

* Placeholders,
* Image widgets.

Bold/underline toolbar should be shown for:

* `<strong>` elements,
* `<u>` elements.

### TC1

1. Focus image widget.

#### Expected

Linking toolbar is visible.

### TC2

1. Put selection in a "example" word in a editable, like `ex^ample`.

#### Expected

Bold/underline toolbar is visible.

### TC3

1. Focus code snippet widget.

#### Expected

No toolbar is visible.