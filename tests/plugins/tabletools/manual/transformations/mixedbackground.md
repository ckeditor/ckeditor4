@bender-tags: 4.7.0, bug, trac16971
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, sourcearea

1. Open source area using "Source" button.
1. Insert following HTML:
```html
<table border="1" style="width:300px">
	<tbody>
		<tr>
			<td style="background:#00cc99 no-repeat center">&nbsp;</td>
			<td>&nbsp;</td>
		</tr>
	</tbody>
</table>
```
1. Go back to wysiwyg mode, by clicking "Source" button again.
	**Expected:** Background in the first cell is different than the other.
1. Right click the first cell, and use "Cell / Cell Properties".
	**Expected:** "Background Color" property is set.

Note there's an issue that the value in the dialog is displayed in `rgb()` format, it's an unrelated issue. You can verify the transformation by checking source once again.
