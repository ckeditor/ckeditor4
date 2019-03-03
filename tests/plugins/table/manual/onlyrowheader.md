@bender-tags: 4.11.4, bug, table, 1397
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,table,sourcearea,dialogadvtab,contextmenu

1. Open developer console.
1. Open context menu on table and choose table properties.
1. Change headers to none and press ok.

## Expected
Table headers transforms into regular cells.

## Unexpected
- Table headers doesn't change into cells.
- Type Error is thrown in console.
