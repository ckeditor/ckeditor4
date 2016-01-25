@bender-tags: clipboard, tc, 4.5.7, 13884
@bender-ui: collapsed
@bender-ckeditor-plugins: clipboard, wysiwygarea, toolbar, sourcearea, sourcedialog, floatingspace, elementspath, table

## First row copy

1. Select three cells in the first row.
2. Copy using `CTRL + C`.
3. Paste in any other place of the editor.

### Expected

Table with three cells and one row is created (pasted).

----

## Partial multi ranges (Firefox only)

1. Make a 2x2 cells selection - that's 4 cells including 11, 22, 44, 55 cells, so that you end with a square selection.
2. Copy using `CTRL + C`.
3. Paste in any other place of the editor.

### Expected

Pasted table has 2 rows with 2 cells in each row resulting with following HTML:

```
&lt;table border=&quot;1&quot;&gt;
    &lt;tbody&gt;
	&lt;tr&gt;
		&lt;td&gt;11&lt;/td&gt;
		&lt;td&gt;22&lt;/td&gt;
		&lt;td&gt;33&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;44&lt;/td&gt;
		&lt;td&gt;55&lt;/td&gt;
		&lt;td&gt;66&lt;/td&gt;
	&lt;/tr&gt;
    &lt;/tbody&gt;
&lt;/table&gt;
```