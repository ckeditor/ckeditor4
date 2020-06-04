@bender-tags: 4.8.0, bug, 1040
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, elementspath, sourcearea

## Scenario 1:

1. Select `Hello` word.
2. Apply **Courier New** font.
3. Expand selection to contain whole text line.
4. Apply **Courier New** font.

### Expected result

Font has been applied to whole `Hello world!` text.

## Scenario 2:

1. Select `again` word.
2. Apply **36** size.
3. Expand selection to contain whole text line.
4. Apply **36** size.

### Expected result

Size has been applied to whole `Hello again!` text.
