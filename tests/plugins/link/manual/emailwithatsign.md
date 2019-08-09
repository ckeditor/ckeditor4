@bender-tags: bug, link, 4.13.0, 2027
@bender-ui: collapsed
@bender-ckeditor-plugins: link, toolbar, wysiwygarea, sourcearea, basicstyles, undo

## Scenario 1:

1. Open link dialog for first link (@CKSource).
1. Click OK.

### Expected:

Display text for link didn't change.

### Unexpected:

Display text change to link's href.

## Scenario 2:

1. Open link dialog for second link (Victoria@ckeditor.com).
2. Change E-mail Address to whatever.

### Expected:

Display name changed alongside address.

### Unexpected:

Display name changed to something else or didn't change at all.
