@bender-tags: 4.8.0, bug, 605
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea

**Scenario:**

1. Check whether the displayed text is equal to: `lorem ipsum dolor sit amet`.
	* **Unexpected result:** The displayed text is equal to: `loremipsum dolor sitamet`.

2. Click `Source` button.
	* **Expected result:** The `Source` data is equal to `<p>lorem<span> ipsum&nbsp;<strong>dolor sit </strong></span>amet</p>`
