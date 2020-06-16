@bender-tags: 4.10.0, feature, range, selection, 1498

# Selection rectangles

This manual test checks the result returned by the `range.getClientRects()` method. Returned results are visualized with red rectangles.

## Things to test:

Select some part of the editable and see if red rectangles match the selection. Play around with the selection using pointer and keyboard (`shift + arrow keys`).

### Note:

There will be one rectangle representing each HTML elements inside the selection which is not same as browser selection visualisation. Also keep in mind that the presented results, are values for the first rectangle from returned array.


#### Notes for Internet Explorer:

* When an image is selected alone the rectangle will match only text height, not the whole image.
* IE8:
	* This method is only partially supported. Only one rectangle is returned which begins at the top left corner for the first selected row, and ends at the bottom right corner of the last selected row.
	* There is known bug when text is wrapping to next line returned rect doesn't match selection [#1895](https://github.com/ckeditor/ckeditor4/issues/1895).
