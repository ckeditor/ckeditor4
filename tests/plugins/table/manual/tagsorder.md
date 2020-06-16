@bender-tags: 4.5.8, bug, trac12707
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,table,sourcearea

1. Click on the Table button.
1. Select Headers: **Both**.
1. Type **foo** in Caption field.
1. Click Ok.
	* The table with 3 row and 2 columns was created.
1. Click the Source toolbar button and view the generated HTML.
	* The `caption` element is the first, direct child of `table` element,
	* The `caption` element contains text "foo",
	* `thead` is a second child of the `table` element.
