@bender-tags: colorbutton, 4.7.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, basicstyles

### Scenario 1:

1. Select the bold text in Editor 1.
   Click *Text Color* button and select a color.
	* **Expected**: The selected text gets the selected color.
	* **Expected**: (Inspect Element) &lt;span style="color"&gt; wraps around &lt;strong&gt;
1. Select the bold text in Editor 1.
   Click *Background Color* button and select a color.
	* **Expected**: The selected text gets the selected color.
	* **Expected**: (Inspect Element) &lt;span style="color"&gt; wraps around &lt;strong&gt;

### Scenario 2:

1. Select the bold text in Editor 1.
   Click *Text Color* button and select a color.
	* **Expected**: The selected text gets the selected color.
	* **Expected**: (Inspect Element) &lt;span style="color"&gt; is wrapped by &lt;strong&gt;
1. Select the bold text in Editor 1.
   Click *Background Color* button and select a color.
	* **Expected**: The selected text gets the selected color.
	* **Expected**: (Inspect Element) &lt;span style="color"&gt; is wrapped by &lt;strong&gt;
