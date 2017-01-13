@bender-tags: 16733, tc, 4.6.2, config
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, floatingspace

### Scenario 1:

1. Click *Text Color* button in Editor 1.
	* **Expected**: It has 10 colors in each row (except the last one which has 4).
1. Click *Background Color* button in Editor 1.
	* **Expected**: It has 10 colors in each row (except the last one which has 4).

### Scenario 2:

1. Click *Text Color* button in Editor 2.
	* **Expected**: It has 6 colors in each row.
1. Click *Background Color* button in Editor 2.
	* **Expected**: It has 6 colors in each row.
