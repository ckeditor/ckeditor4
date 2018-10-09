@bender-tags: widget, bug, 4.11.0, 1722
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea

1. Click `Destroy` button first time.
1. Click `Destroy` button second time.

## Expected

After first click `Filter` label should stay `active`. Second click should change `Filter` label into `removed`.

## Unexpected

`Filter` label stays `active` regardless of button clicks or changes status into `removed` after first click.
