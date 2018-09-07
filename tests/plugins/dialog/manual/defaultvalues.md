@bender-tags: 4.11.0, feature, 2277, dialog
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, link

1. Click `link` button.
1. Wait until dialog show up.
1. Compare `Protocol` field with expected results.
1. Click `Advanced` tab.
1. Compare `Id` and `Name` fields with expected results.

## Expected

* `Info:Protocol`: `https://`
* `Advanced:Id`: `1`
* `Advanced:Name`: `test`

## Unexpected

Values are different than expected.
