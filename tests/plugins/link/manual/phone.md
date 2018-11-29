@bender-tags: feature, link, 2154, 4.11.0
@bender-ckeditor-plugins: link, toolbar, wysiwygarea, sourcearea
@bender-ui: collapsed
----

## For both editors

1. Click on link button.

1. Chose link type: 'Phone'.

1. Press 'OK'.

	### Expected

	- Alert appears with information to type a phone number.

1. Type following into dialog and press 'OK':

		Display name: Foo
		Phone number: 123123123

	### Expected

	- Link appears in editor.

1. Press 'source'.

	### Expected

	- Editor has following code inside:

	`<a href="tel:123123123">Foo</a>`

1. Repeat steps 1 and 2.

1. Type following into dialog, and press 'OK':

		Display name: Foo
		Phone number: Bar

	### Expected

	- First editor: link appears in editor.

	- Second editor: alert appears with information that number is invalid.


### Note:

Valid phone number for this test is XXXXXXXXX (9 digits).
