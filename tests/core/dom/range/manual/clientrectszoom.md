@bender-tags: 4.10.0, feature, range, selection

# Selection rectangles

This manual test checks result returned by `range.getClientRects()` method. Returned results are visualized with red rectangle.

## Things to test:

Select some part of editable and see if red rectangles matches selection. Play around whit selection using mouse and keyboard (`shift + arrow keys`).

### Note:
There will be one rectangle representing each HTML element inside selection. Also keep in mind that presented results, are values for first rectangle from returned array.


#### Notes for Internet Explorer:
* When image is selected alone rectangle will match only text height, not whole image.
* IE8: This method is only partially supported. Only one rectangle is returned which begins at top left corner for the first selected row, and ends at bottom right corner of the last selected row.
